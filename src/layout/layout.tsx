import React from 'react';
import Box from '@material-ui/core/Box';

import Header from './components/header/header';
import Footer from './components/footer/footer';

import useStyles from './styles';

type Props = {
    layoutStyles?: string;
    children: React.ReactNode;
};

const Layout: React.FC<Props> = (props: Props) => {
    const { layoutStyles, children } = props;
    const classes = useStyles();

    return (
        <Box
            component="main"
            className={
                layoutStyles
                    ? ` ${layoutStyles} ${classes.layout}`
                    : classes.layout
            }
        >
            <Header />
            {children}
            <Footer />
        </Box>
    );
};

export default Layout;
