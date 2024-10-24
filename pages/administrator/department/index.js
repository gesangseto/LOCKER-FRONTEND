import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import { deleteDepartment, getDepartment } from 'src/service/administrator/department';
import HeaderIndex from '../../../src/component/HeaderIndex';

const Department = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getDepartment(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
        { key: 'status_name', label: 'Status' }
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    const handleClickDelete = async (id) => {
        let send = await deleteDepartment({ id: id });
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            getData();
        }
    };
    return (
        <div className="card">
            <HeaderIndex title="Department" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickDelete={(data) => handleClickDelete(data.id)} />
        </div>
    );
};

export default Department;
