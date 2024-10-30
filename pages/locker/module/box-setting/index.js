import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useToast } from 'src/component/ToastProvider';
import { getLkrBoxNumber, updateLkrBoxNumber } from 'src/service/locker/master/box';
import Table from '../../../../src/component/Table';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({
        first: 1,
        page: 1,
        limit: 10,
        totalData: 0,
        search: '',
        search_options: null
    });

    const getData = async () => {
        let res = await getLkrBoxNumber(filter);
        if (res && !res.error) {
            setResApi(res)
        }
    };



    useEffect(() => {
        getData();
    }, [filter]);



    const handleClickUpdate = async (item, type) => {
        console.log(item, type);
        let send = await updateLkrBoxNumber({ ...item, status: type })
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            getData();
        }
        // setFormData({ ...item, update: true })
    };

    const Action = (item) => {
        return (
            <div className="grid">
                <Tooltip target=".enable-btn" content="Disable Item" />
                <Button disabled={item.status == 'enable'} size="small" icon={"pi pi-check"} className={`p-button-success mx-1 enable-btn`} onClick={() => handleClickUpdate(item, 'enable')} />

                <Tooltip target=".disable-btn" content="Set to Disable" />
                <Button disabled={item.status == 'disable'} size="small" icon={"pi pi-times"} className={`p-button-warning mx-1 disable-btn`} onClick={() => handleClickUpdate(item, 'disable')} />

                <Tooltip target=".broken-btn" content="Set to Broken" />
                <Button disabled={item.status == 'broken'} size="small" icon={"pi pi-ban"} className={`p-button-danger mx-1 broken-btn`} onClick={() => handleClickUpdate(item, 'broken')} />
            </div>

        )
    }

    const fieldTable = [
        { key: 'number', label: 'Number' },
        { key: 'module', label: 'Module Number' },
        { key: 'cabinet', label: 'Cabinet' },
        { key: 'status', label: 'Status' },
    ];
    return (

        <div className="card">
            {/* HEADER */}
            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                    <h5> Box Setting </h5>
                </div>
            </div>
            {/* TABLE */}
            <Table keyId={'module'} customAction={(e) => Action(e)} coloringStatus data={resApi} disableDelete={true} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickUpdate={(data) => handleClickUpdate(data)} />

        </div>
    );
};

export default Index;
