import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import { useToast } from 'src/component/ToastProvider';
import { getWorkflowTransition } from 'src/service/config/workflow-transition';
import HeaderIndex from 'src/component/HeaderIndex';
import { Dialog } from 'primereact/dialog';
import { Timeline } from 'primereact/timeline';
import TextInput from 'src/component/TextInput';
import moment from 'moment';

const Section = () => {
    const showToast = useToast();
    const router = useRouter();
    const title = router.asPath.match(/\/([^/]+)\/$/)[1];
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });
    const [selectedData, setSelectedData] = useState({});

    const getData = async () => {
        let res = await getWorkflowTransition(filter);
        if (res && !res.error) {
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'ref_id', label: 'Trx ID', type: 'text' },
        { key: 'ref_name', label: 'Transaction Name' },
        { key: 'created_at', label: 'Trx Date' },
        { key: 'created_by_name', label: 'Created By', type: 'text' },
        { key: 'updated_by_name', label: 'Last Update By', type: 'text' },
        { key: 'updated_at', label: 'Last Update Date', type: 'date' },
        { key: 'first_status_name', label: 'Initial Status' },
        { key: 'last_status_name', label: 'Last Status' }
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    const handleClickAction = async (item) => {
        let res = await getWorkflowTransition({ ref_id: item.ref_id });
        if (res.data) {
            setSelectedData(res.data[0]);
        }
    };

    const customizedContent = (item) => {
        return (
            <>
                {moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
                <p>
                    Created By: {item.created_by_name || 'N/A'} <br /> Remark: {item.remark || 'N/A'}
                </p>
            </>
        );
    };

    return (
        <div className="card">
            <HeaderIndex title={title} />
            <Table showGridlines data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickRead={(item) => handleClickAction(item)} keyId={'ref_id'} />
            <Dialog visible={Object.keys(selectedData).length > 0} style={{ width: '750px' }} header="Transition Detail" modal className="p-fluid" onHide={() => setSelectedData({})}>
                <div className="grid p-fluid mt-5">
                    <div className="field col-6 md:col-6">
                        <div className="grid p-fluid">
                            <div className="field col-6 md:col-12">
                                <TextInput disabled={true} title="Trx ID" value={selectedData.ref_id} />
                            </div>
                            <div className="field col-6 md:col-12">
                                <TextInput disabled={true} title="Trx Name" value={selectedData.ref_name} />
                            </div>
                        </div>
                    </div>
                    <div className="field col-6 md:col-6">
                        <Timeline value={selectedData.details} opposite={(item) => item.status_name} content={customizedContent} />
                    </div>
                </div>
            </Dialog>
        </div>
    );
};

export default Section;
