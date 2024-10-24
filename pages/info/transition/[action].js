import moment from 'moment/moment';
import { useRouter } from 'next/router';
import { Timeline } from 'primereact/timeline';
import React, { useEffect, useState } from 'react';
import FooterTemplate from 'src/component/FooterTemplate';
import HeaderForm from 'src/component/HeaderForm';
import TextInput from 'src/component/TextInput';
import TrxDetailTabel from 'src/component/TrxDetailTabel';
import { getWorkflowTransition } from 'src/service/config/workflow-transition';
const Index = () => {
    const router = useRouter();
    const { action, id } = router.query;
    const [formData, setFormData] = useState({ details: [] });

    const customizedContent = (item) => {
        return (
            <>
                {moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')}
                <p>
                    Created By: {item.created_by_name || 'N/A'}
                    <br />
                    Remark: {item.remark || 'N/A'}
                </p>
            </>
        );
    };

    useEffect(() => {
        if (id) getData(id);
    }, [action, id]);

    const getData = async (id) => {
        let res = await getWorkflowTransition({ ref_id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };
    return (
        <div className="card">
            <HeaderForm title="Pre-Inbound" />
            <div className="grid p-fluid mt-5">
                <div className="field col-6 md:col-6">
                    <TextInput disabled={true} title="Transaction" value={formData.ref_name} />
                    <br />
                    <TextInput disabled={true} title="Trx ID" value={formData.ref_id} />
                </div>
                <div className="field col-6 md:col-6">
                    <Timeline value={formData.details} opposite={(item) => item.status_name} content={customizedContent} />
                </div>
            </div>
            <FooterTemplate onClickBack={() => router.back()} />
        </div>
    );
};

export default Index;
