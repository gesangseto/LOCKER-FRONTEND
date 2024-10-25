import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import HeaderIndex from 'src/component/HeaderIndex';
import { getLkrTransaction } from 'src/service/locker/transaction/report';

const Report = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getLkrTransaction(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'box_number', label: 'Box No.' },
        { key: 'locker_name', label: 'Locker Name' },
        { key: 'gross_amount', label: 'Gross Amount.' },
        { key: 'phone_number', label: 'Phone' },
        { key: 'pin_number', label: 'Pin' },
        { key: 'start_at', label: 'Start' },
        { key: 'expire_at', label: 'Expire' },
        { key: 'updated_at', label: 'Update' },
        { key: 'status', label: 'status' },
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    return (
        <div className="card">
            <HeaderIndex title="Api Message" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} />
        </div>
    );
};

export default Report;
