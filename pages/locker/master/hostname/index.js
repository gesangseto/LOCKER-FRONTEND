import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import HeaderIndex from 'src/component/HeaderIndex';
import { getLkrHostname } from 'src/service/locker/master/hostname';
const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getLkrHostname(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'locker_name', label: 'Locker Name' },
        { key: 'locker_id', label: 'Locker ID' },
        { key: 'locker_ip', label: 'Locker IP' },
        { key: 'updated_at', label: 'Updated at' },
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    return (
        <div className="card">
            <HeaderIndex title="Hostname" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} />
        </div>
    );
};

export default Index;
