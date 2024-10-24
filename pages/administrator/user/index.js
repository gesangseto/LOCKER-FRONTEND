import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import { deleteUser, getUser } from 'src/service/administrator/user';
import HeaderIndex from '../../../src/component/HeaderIndex';

const User = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getUser(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'department_name', label: 'Department' },
        { key: 'section_name', label: 'Section' },
        { key: 'status_name', label: 'Status' }
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    const handleClickDelete = async (id) => {
        let send = await deleteUser({ id: id });
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            getData();
        }
    };
    return (
        <div className="card">
            <HeaderIndex title="Section" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickDelete={(data) => handleClickDelete(data.id)} />
        </div>
    );
};

export default User;
