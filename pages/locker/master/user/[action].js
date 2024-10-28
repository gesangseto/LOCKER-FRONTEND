import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FooterTemplate from 'src/component/FooterTemplate';
import HeaderForm from 'src/component/HeaderForm';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { getLkrUser, createLkrUser, updateLkrUser } from 'src/service/locker/master/user';

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
        let res = await getLkrUser({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };


    const save = async () => {
        let send = undefined;
        if (formData.id) send = await updateLkrUser(formData);
        else send = await createLkrUser(formData);

        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            router.back();
        }
    };

    return (
        <div className="card">
            <HeaderForm title="User" data={formData} onFinishApprove={() => getData(id)} />
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Phone Number" type="number" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Pin Number" value={formData.pin_number} onChange={(e) => setFormData({ ...formData, pin_number: e.target.value })} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Card Number" value={formData.card_number} onChange={(e) => setFormData({ ...formData, card_number: e.target.value })} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
                </div>
            </div>
            <FooterTemplate onClickSave={() => save()} onClickBack={() => router.back()} data={formData} />
        </div>
    );
};

export default Index;
