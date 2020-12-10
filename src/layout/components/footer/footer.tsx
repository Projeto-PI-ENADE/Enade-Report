import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import useStyles from './styles';

const Footer: React.FC = () => {
    const classes = useStyles();
    return (
        <Grid container component="footer" className={classes.footer}>
            <Grid item xs={6} component={Typography}>
                Informações da base de dados do INEP
            </Grid>
            <Grid
                container
                item
                xs={6}
                component={Typography}
                justify="flex-end"
            >
                Desenvolvido em 2020
            </Grid>
        </Grid>
    );
};

export default Footer;
