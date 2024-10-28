import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FooterTemplate from 'src/component/FooterTemplate';
import HeaderForm from 'src/component/HeaderForm';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { getLkrSize, createLkrSize, updateLkrSize } from 'src/service/locker/master/size';

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
        let res = await getLkrSize({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };


    const save = async () => {
        let send = undefined;
        if (formData.id) send = await updateLkrSize(formData);
        else send = await createLkrSize(formData);

        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            router.back();
        }
    };

    return (
        <div className="card">
            <HeaderForm title="Size" data={formData} onFinishApprove={() => getData(id)} />
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Size" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
                </div>
            </div>
            <FooterTemplate onClickSave={() => save()} onClickBack={() => router.back()} data={formData} />
        </div>
    );
};

export default Index;
