import { Image } from 'primereact/image';
import React, { useEffect, useState } from 'react';

import { getConfigApp } from '../src/helper/storage';
const Dashboard = () => {
    const [appConf, setAppConf] = useState({ logo: null, name: '' });

    useEffect(() => {
        if (getConfigApp()) { setAppConf(getConfigApp()) }
    }, []);


    return (
        <div className="flex  h-screen" >
            <div className="m-auto">
                <Image src={appConf.logo_home} />
                <h1 style={{ textAlign: "center" }}>{appConf.name}</h1>

            </div>
        </div>
    );
};

export default Dashboard;
