import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        footer: {
            marginTop: '2rem',
            height: 50,
            backgroundColor: theme.palette.primary.main,
            alignItems: 'center',

            '& p:first-child': {
                paddingLeft: '1rem',
                color: 'white',

                [theme.breakpoints.down('md')]: {
                    paddingLeft: '.7rem',
                    fontSize: '.7',
                },
            },

            '& p:last-child': {
                paddingRight: '1rem',
                color: 'white',

                [theme.breakpoints.down('md')]: {
                    paddingRight: '.7rem',
                    fontSize: '.7',
                },
            },
        },
    })
);

export default useStyles;
