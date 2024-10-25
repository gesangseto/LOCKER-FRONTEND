import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import HeaderIndex from 'src/component/HeaderIndex';
import { getLkrTransaction } from 'src/service/locker/transaction/report';
import { getLkrAccessColumn } from 'src/service/locker/master/access';
import { getProfile } from 'src/helper/storage';
import { humanizeText } from 'src/helper/utils';

const Report = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });
    const [profile, setProfile] = useState(null);

    const [fieldTable, setFieldTable] = useState([]);

    const getData = async () => {
        let res = await getLkrTransaction(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };


    useEffect(() => {
        let user = getProfile();
        if (user) {
            setProfile(user);
        }
        getData();
    }, [filter]);

    useEffect(() => {
        if (profile) {
            loadColumn(profile.section_id)
        }
    }, [profile]);

    const loadColumn = async (id) => {
        let where = { id: id }
        if (!id) { where.id = 'sa' }
        let res = await getLkrAccessColumn(where);
        if (res && res.data) {
            let data = res.data[0].access_column
            let field = []
            for (const it of data) {
                field.push({ key: it, label: humanizeText(it) })
            }
            setFieldTable(field)

            // setFieldTable({ ...data });
        }
    }
    return (
        <div className="card">
            <HeaderIndex title="Api Message" />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} />
        </div>
    );
};

export default Report;
