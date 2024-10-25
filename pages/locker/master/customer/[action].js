import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FooterTemplate from 'src/component/FooterTemplate';
import HeaderForm from 'src/component/HeaderForm';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { getLkrCustomer } from 'src/service/locker/master/customer';

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
        let res = await getLkrCustomer({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };

    return (
        <div className="card">
            <HeaderForm title="Customer" data={formData} onFinishApprove={() => getData(id)} />
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Box" value={formData.box_number} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Loker" value={formData.locker_name} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Phone" value={formData.phone_number} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Pin" value={formData.pin_number} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Start At" value={formData.start_at} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Expire At" value={formData.expire_at} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Update At" value={formData.update_at} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Card No." value={formData.card_number} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Status" value={formData.status} />
                </div>
            </div>
            <FooterTemplate checkMetadata={'adm_user'} onClickSave={() => save()} onClickBack={() => router.back()} data={formData} onChangeMetadata={(item) => setFormData({ ...formData, metadata: item })} />
        </div>
    );
};

export default Index;
