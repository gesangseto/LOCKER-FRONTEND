import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import HeaderIndex from 'src/component/HeaderIndex';
import { getLkrApiMessage } from 'src/service/locker/transaction/message';

const Message = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getLkrApiMessage(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'type', label: 'Type' },
        { key: 'message', label: 'Message' },
        { key: 'sync', label: 'Sync' },
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

export default Message;
