import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Logo from '../../../assets/logo.png';
import useStyles from './styles';

const Header: React.FC = () => {
    const classes = useStyles();

    return (
        <Grid container component="header" className={classes.container}>
            <Grid item xs={4} md={4}>
                <img
                    src={Logo}
                    alt="logo do site com os dizeres ENADE e INEP"
                    draggable="false"
                />
            </Grid>
        </Grid>
    );
};

export default Header;
