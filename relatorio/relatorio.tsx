import React, { useState } from 'react';
import Head from 'next/head';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TreeView from '@material-ui/lab/TreeView';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { ChevronRight, ChevronDown } from '@styled-icons/evaicons-solid';
import coursesData from '../utils/data/courses_w_id_2018.json';
import yearsData from '../utils/data/years';
import { TypeCourses } from '../services/models/data';
import ScrollToTopButton from '../components/scrollTopButton/scrollTopButton';
import homeUseStyles from '../styles/pages/yearDashboard';
import useStyles from '../styles/pages/report';
import { Checkbox } from '@material-ui/core';
import { TreeItem } from '@material-ui/lab';
import Button from '@material-ui/core/Button';
import { Plus } from '@styled-icons/entypo';
import Layout from '../layout/layout';
import api from '../services/api'

import scoresData from '../utils/data/report/scores';
import presencesData from '../utils/data/report/presences';
import participantsData from '../utils/data/report/participants';
import exportsData from '../utils/data/report/exports';
import yearsReportData from '../utils/data/report/years';
import { dataApi } from '../services/useCases/data';


import ReportCard from '../components/report/reportCard';
import RadioCard from '../components/report/radioCard';

import useSWR from 'swr'

let ids = 0;

const getNewID = () => {
    const tmp = ids;
    ids++;
    return String(tmp);
}

enum eFiltroOpcoes {
    quantidade = 1,
    idade = 2,
    sexo = 3,
    renda = 4,
    modalidade = 5,
    etnia = 6
}


enum eFiltroArquivoValues {
    CSV = 1,
    XLSX = 2,
    JSON = 3
}

class IValues {
    nome: string
    id: number
    valor: boolean
}

abstract class INode {
    values: Array<IValues>;
    childs: Array<INode>;

    public abstract adicionarFilho(): void;
    public abstract noFolha(): boolean;
}

class FiltroNota extends INode {
    public adicionarFilho(): void {

    }

    public noFolha(): boolean {
        return true;
    }

    constructor() {
        super()
        const op = ['Por quantidade de alunos', 'Por idade', 'Por sexo', 'Por renda familiar', 'Por modalidade de ensino', 'Por etnia']
        const opCode: Array<number> = [eFiltroOpcoes.quantidade, eFiltroOpcoes.idade, eFiltroOpcoes.sexo, eFiltroOpcoes.renda, eFiltroOpcoes.modalidade, eFiltroOpcoes.etnia]

        this.values = new Array<IValues>(op.length)
        this.childs = new Array<INode>(0)

        for (let index = 0; index < op.length; index++) {
            this.values[index] = { nome: op[index], id: opCode[index], valor: false }
        }
    }
}

class FiltroPresenca extends INode {
    public adicionarFilho(): void {

    }
    public noFolha(): boolean {
        return true;
    }
    constructor() {
        super()
        const op = ['Por quantidade de alunos', 'Por idade', 'Por sexo', 'Por renda familiar', 'Por modalidade de ensino', 'Por etnia']
        const opCode: Array<number> = [eFiltroOpcoes.quantidade, eFiltroOpcoes.idade, eFiltroOpcoes.sexo, eFiltroOpcoes.renda, eFiltroOpcoes.modalidade, eFiltroOpcoes.etnia]

        this.values = new Array<IValues>(op.length)
        this.childs = new Array<INode>(0)

        for (let index = 0; index < op.length; index++) {
            this.values[index] = { nome: op[index], id: opCode[index], valor: false }
        }
    }
}

class Curso extends INode {
    public adicionarFilho(): void {

    }
    public noFolha(): boolean {
        return false;
    }
    constructor(ano: number[]) {
        super()
        const cursos = coursesData;
        this.childs = [new FiltroNota(), new FiltroPresenca()]
        this.values = new Array<IValues>(cursos.length)

        for (let i = 0; i < cursos.length; i++) {
            this.values[i] = { nome: cursos[i].name, id: cursos[i].id, valor: cursos[i].checked }

        }
    }
}

class Ano extends INode {
    public adicionarFilho(): void {
        const anos: number[] = []

        this.values.map(x => {
            anos.push(Number(x.nome))
        })

        this.childs.push(new Curso(anos))
    }

    public noFolha(): boolean {
        return false;
    }
    constructor() {
        super()
        this.childs = new Array<Curso>()
        this.values = new Array<IValues>(yearsData.length)

        for (let i = 0; i < yearsData.length; i++) {
            this.values[i] = { nome: String(yearsData[i]), id: yearsData[i], valor: false };
        }

    }
}

class Arquivo extends INode {
    public adicionarFilho(): void {
        this.childs.push(new Ano())
    }
    public noFolha(): boolean {
        return false;
    }
    constructor() {
        super()
        this.childs = new Array<Ano>()
        this.values = [{ nome: "CSV", id: eFiltroArquivoValues.CSV, valor: false }, { nome: "XLSX", id: eFiltroArquivoValues.XLSX, valor: false }]
    }
}

function limpaLixo(data: INode) {
    const values_clean = data.values.filter(x => x.valor === true).map((x) => { delete x['valor']; return x })
    data.values = values_clean;
    data.childs.forEach(c => {
        limpaLixo(c);
    });
}

async function gerarRelatorio(data: Array<Arquivo>) {
    data.forEach(e => {
        limpaLixo(e)
    });
    console.log("axios call")
    try {
        const fetch = async (str) => { await api.get<number>(str, { params: { data } }) }

        const { data, error } = await useSWR('http://localhost:3232/relatorio', fetch)
        console.log("resposta:", data)
    }
    catch (e) {
        console.log("Erro ao chamar API", e)
    }

}

const Report: React.FC = () => {
    const homeClasses = homeUseStyles();
    const classes = useStyles();
    const [courses, setCourse] = useState<TypeCourses | null>(null);
    const [relatorios, setRelatorios] = useState<Array<Arquivo>>([new Arquivo()])

    const adicionarRelatorio = () => {
        const aux = [...relatorios]
        aux.push(new Arquivo());
        setRelatorios(aux)
    }

    const RenderCheckBox: React.FC<Array<IValues>> = (props: Array<IValues>) => {
        const [upt, setUpt] = useState(0)
        const comp = props.props
        return (
            <FormGroup row>

                {comp.map((item, index) => (
                    <FormControlLabel
                        id={getNewID()}
                        control={<Checkbox checked={item.valor} onChange={(event) => { setUpt(upt + 1); item.valor = event.target.checked }} />}
                        label={item.nome}
                    />
                ))}
            </FormGroup>
        )
    }

    const RenderNode: React.FC<INode> = (props: INode) => {
        const noID = getNewID()
        const comp = props.props
        const [upt, setUpt] = useState(0)

        const adicionarFilho = (pai: INode) => {

            pai.adicionarFilho()
            setUpt(upt + 1);
        }

        return (
            <TreeItem nodeId={noID} label={comp.constructor.name} >
                <RenderCheckBox props={comp.values} />
                {
                    comp.childs.map(x => (
                        <RenderNode key={getNewID()} props={x} />)
                    )
                }{
                    comp.noFolha() === false ? (
                        <Button variant="contained" size="small"
                            color="default" endIcon={<Plus />} onClick={(e) => { adicionarFilho(comp) }}>
                            Adicionar
                        </Button>) : <div></div>
                }
            </TreeItem >)

    }


    return (
        <Layout>
            <Grid container className={homeClasses.container}>
                <Head>
                    <title>Geração de Relatório</title>
                </Head>

                <Grid container>
                    <Grid
                        container
                        component={Typography}
                        variant="h1"
                        className={homeClasses.title}
                    >
                        <Typography>Geração</Typography>{' '}
                        <Typography>de Relatório</Typography>
                    </Grid>
                </Grid>

                <Grid>
                    <TreeView
                        defaultExpanded={["1"]}
                        defaultCollapseIcon={<ChevronDown />}
                        defaultExpandIcon={<ChevronRight />}>

                        {
                            relatorios.map(x => (
                                <RenderNode key={getNewID()} props={x} />)
                            )
                        }
                        <Button variant="contained" size="small"
                            color="default" endIcon={<Plus />} onClick={adicionarRelatorio} >
                            Adicionar
                    </Button>
                    </TreeView>
                    <Button variant="contained" size="small"
                        color="default" endIcon={<Plus />} onClick={async (e) => { await gerarRelatorio(relatorios) }} >
                        Gerar Relatorio
                    </Button>
                </Grid>

                <ScrollToTopButton />
            </Grid>
        </Layout>
    );
};

export default Report;
