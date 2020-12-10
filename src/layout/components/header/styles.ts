import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            padding: '5px 0 1rem',
            fontWeight: 'bold',
            boxShadow: theme.shadows[2],
            backgroundColor: 'white',
            alignItems: 'center',

            '& div:first-child': {
                paddingLeft: '2rem',

                [theme.breakpoints.down('md')]: {
                    paddingLeft: '1rem',
                },

                '& img': {
                    marginTop: 20,
                    height: 40,

                    [theme.breakpoints.down('md')]: {
                        width: 150,
                        height: 'auto',
                    },
                },
            },

            '& div:last-child': {
                paddingRight: '1rem',

                [theme.breakpoints.down('md')]: {
                    paddingRight: '.1rem',
                },
            },
        },
    })
);

export default useStyles;
