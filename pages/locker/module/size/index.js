import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import HeaderIndex from 'src/component/HeaderIndex';
import { getLkrSize, deleteLkrSize } from 'src/service/locker/master/size';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getLkrSize(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'size', label: 'Size' },
        { key: 'price', label: 'Proce' },
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    const handleClickDelete = async (id) => {
        let send = await deleteLkrSize({ id: id });
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            getData();
        }
    };
    return (
        <div className="card">
            <HeaderIndex title="Size" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickDelete={(data) => handleClickDelete(data.id)} />
        </div>
    );
};

export default Index;
