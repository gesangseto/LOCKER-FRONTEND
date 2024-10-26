import getConfig from 'next/config';
import React, { useContext, useEffect, useState } from 'react';
import { getConfigApp } from '../src/helper/storage';
import { LayoutContext } from './context/layoutcontext';


const AppFooter = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [profile, setProfile] = useState({});
    const [appConf, setAppConf] = useState({ logo: null, name: '' });


    useEffect(() => {
        if (getConfigApp()) { setAppConf(getConfigApp()) }
    }, []);

    return (
        <div className="layout-footer">
            <img src={appConf.logo} alt="Logo" height="20" className="mr-2" />
            by
            <span className="font-medium ml-2">SOMEONE</span>
        </div>
    );
};

export default AppFooter;
