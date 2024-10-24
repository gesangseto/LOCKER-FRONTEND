import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import HeaderIndex from '../../../src/component/HeaderIndex';
import { deletePattern } from '../../../src/service/config/pattern';
import { deleteStatusInformation, getStatusInformation } from '../../../src/service/config/status-information';

const Department = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getStatusInformation(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'Status ID' },
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'uri', label: 'URI' },
        { key: 'is_lock_data', label: 'Is Lock Data', type: 'boolean' },
        { key: 'is_final', label: 'Final', type: 'boolean' },
        { key: 'sys', label: 'Is System', type: 'boolean' }
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    const handleClickDelete = async (id) => {
        let send = await deleteStatusInformation({ id: id });
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            getData();
        }
    };
    return (
        <div className="card">
            <HeaderIndex title="Status Information" />
            <Table enableUpdate showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickDelete={(data) => handleClickDelete(data.id)} />
        </div>
    );
};

export default Department;
