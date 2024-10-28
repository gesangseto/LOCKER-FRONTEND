import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import HeaderIndex from 'src/component/HeaderIndex';
import { getLkrUser, deleteLkrUser } from 'src/service/locker/master/user';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getLkrUser(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'username', label: 'Username' },
        { key: 'phone_number', label: 'Phone' },
        { key: 'pin_number', label: 'Pin' },
        { key: 'card_number', label: 'Card' },
        { key: 'status', label: 'status' },
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    const handleClickDelete = async (id) => {
        let send = await deleteLkrUser({ id: id });
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            getData();
        }
    };
    return (
        <div className="card">
            <HeaderIndex title="User" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickDelete={(data) => handleClickDelete(data.id)} />
        </div>
    );
};

export default Index;
