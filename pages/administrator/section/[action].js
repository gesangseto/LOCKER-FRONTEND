import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import SwitchInput from 'src/component/SwitchInput';
import TextInput from 'src/component/TextInput';
import TextareaInput from 'src/component/TextareaInput';
import { useToast } from 'src/component/ToastProvider';
import { error } from 'src/constant/message';
import { capitalize } from 'src/helper/utils';
import { createSection, getSection, updateSection } from 'src/service/administrator/section';
import SelectOption from 'src/component/SelectOption';
import { getDepartment } from 'src/service/administrator/department';
import HeaderForm from 'src/component/HeaderForm';
import FooterTemplate from '../../../src/component/FooterTemplate';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const { action, id } = router.query;
    const [initialLoad, setInitialLoad] = useState(true);
    const [formData, setFormData] = useState({ id: '', code: '', name: '', description: '', status: 1, department_id: null });
    const [listDepart, setListDepart] = useState([]);

    useEffect(() => {
        validation();
    }, [formData]);

    useEffect(() => {
        loadDepartment();
        if (id) getData(id);
    }, [action, id]);

    const getData = async (id) => {
        let res = await getSection({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };
    const loadDepartment = async (id) => {
        let res = await getDepartment({ status: '1' });
        if (res && res.data) setListDepart([...res.data]);
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
        if (formData.id) send = await updateSection(formData);
        else send = await createSection(formData);

        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            router.back();
        }
    };

    return (
        <div className="card">
            <HeaderForm title="Section" data={formData} onFinishApprove={() => getData(id)} />
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Code" required error={!validation() && !formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} value={formData.code} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Name" required error={!validation() && !formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                </div>
                <div className="field col-12 md:col-6">
                    <SelectOption options={listDepart} value={formData.department_id} title="Department" required error={!validation() && !formData.department_id} onChange={(e) => setFormData({ ...formData, department_id: e.target.value })} />
                </div>
                <div className="field col-12 md:col-6"></div>
                <div className="field col-12 md:col-6">
                    <TextareaInput title="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
                </div>
                <div className="field col-12 md:col-6">
                    <p>Status</p>
                    <SwitchInput onChange={(val) => setFormData({ ...formData, status: val })} value={formData.status} />
                </div>
            </div>
            <FooterTemplate onClickSave={() => save()} onClickBack={() => router.back()} data={formData} onChangeMetadata={(item) => setFormData({ ...formData, metadata: item })} />
        </div>
    );
};

export default Index;
