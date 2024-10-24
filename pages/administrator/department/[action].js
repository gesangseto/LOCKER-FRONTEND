import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import HeaderForm from 'src/component/HeaderForm';
import SwitchInput from 'src/component/SwitchInput';
import TextInput from 'src/component/TextInput';
import TextareaInput from 'src/component/TextareaInput';
import { useToast } from 'src/component/ToastProvider';
import { error } from 'src/constant/message';
import { createDepartment, getDepartment, updateDepartment } from 'src/service/administrator/department';
import FooterTemplate from '../../../src/component/FooterTemplate';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const { action, id } = router.query;
    const [initialLoad, setInitialLoad] = useState(true);
    const [formData, setFormData] = useState({ id: '', code: '', name: '', description: '', status: 1 });

    useEffect(() => {
        validation();
    }, [formData]);

    useEffect(() => {
        if (id) getData(id);
    }, [action, id]);

    const getData = async (id) => {
        let res = await getDepartment({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };

    const validation = (force) => {
        if (initialLoad && !force) return true;
        if (!formData.code) return false;
        else if (!formData.name) return false;
        return true;
    };

    const save = async () => {
        setInitialLoad(false);
        if (!validation(true)) {
            return showToast(error.required);
        }
        let send = undefined;
        if (formData.id) send = await updateDepartment(formData);
        else send = await createDepartment(formData);

        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            router.back();
        }
    };

    return (
        <div className="card">
            <HeaderForm title="Deparment" data={formData} onFinishApprove={() => getData(id)} />
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Code" required error={!validation() && !formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} value={formData.code} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Name" required error={!validation() && !formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextareaInput title="Description" required error={!validation() && !formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
                </div>
                <div className="field col-12 md:col-6">
                    <p>Status</p>
                    <SwitchInput onChange={(val) => setFormData({ ...formData, status: val })} value={formData.status} />
                </div>
            </div>
            <FooterTemplate checkMetadata={'adm_department'} onClickSave={() => save()} onClickBack={() => router.back()} data={formData} onChangeMetadata={(item) => setFormData({ ...formData, metadata: item })} />
        </div>
    );
};

export default Index;
