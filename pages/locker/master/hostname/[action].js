import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FooterTemplate from 'src/component/FooterTemplate';
import HeaderForm from 'src/component/HeaderForm';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { getLkrHostname } from 'src/service/locker/master/hostname';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const { action, id } = router.query;
    const [initialLoad, setInitialLoad] = useState(true);
    const [formData, setFormData] = useState({});
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    useEffect(() => {
        if (id) getData(id);
    }, [action, id]);


    const getData = async (id) => {
        let res = await getLkrHostname({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };

    return (
        <div className="card">
            <HeaderForm title="Hostname" data={formData} onFinishApprove={() => getData(id)} />
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Loker Name" value={formData.locker_name} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Locker ID" value={formData.locker_id} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Locker IP" value={formData.locker_ip} />
                </div>
            </div>
            <FooterTemplate checkMetadata={'adm_user'} onClickSave={() => save()} onClickBack={() => router.back()} data={formData} onChangeMetadata={(item) => setFormData({ ...formData, metadata: item })} />
        </div>
    );
};

export default Index;
