import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { getSection } from 'src/service/administrator/section';
import HeaderIndex from '../../../src/component/HeaderIndex';

const Section = () => {
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });

    const getData = async () => {
        let res = await getSection({ ...filter, status: 1 });
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'code', label: 'Code' },
        { key: 'name', label: 'Name' },
        { key: 'department_name', label: 'Department Name' },
        { key: 'description', label: 'Description' },
        { key: 'status_name', label: 'Status' }
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    return (
        <div className="card">
            <HeaderIndex title="Role-Section" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} />
        </div>
    );
};

export default Section;
