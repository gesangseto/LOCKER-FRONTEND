import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import HeaderIndex from 'src/component/HeaderIndex';
import { getLkrCustomer } from 'src/service/locker/master/customer';
const Customer = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getLkrCustomer(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'box_number', label: 'Box No.' },
        { key: 'locker_name', label: 'Locker Name' },
        { key: 'phone_number', label: 'Phone' },
        { key: 'pin_number', label: 'Pin' },
        { key: 'start_at', label: 'Start' },
        { key: 'expire_at', label: 'Expire' },
        { key: 'update_at', label: 'Update' },
        { key: 'status', label: 'status' },
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    return (
        <div className="card">
            <HeaderIndex title="Customer" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} />
        </div>
    );
};

export default Customer;
