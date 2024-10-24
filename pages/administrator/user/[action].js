import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FooterTemplate from 'src/component/FooterTemplate';
import HeaderForm from 'src/component/HeaderForm';
import NumberInput from 'src/component/NumberInput';
import PasswordInput from 'src/component/PasswordInput';
import SelectOption from 'src/component/SelectOption';
import SwitchInput from 'src/component/SwitchInput';
import TextInput from 'src/component/TextInput';
import TextareaInput from 'src/component/TextareaInput';
import { useToast } from 'src/component/ToastProvider';
import { error } from 'src/constant/message';
import { getDepartment } from 'src/service/administrator/department';
import { getSection } from 'src/service/administrator/section';
import { createUser, getUser, updateUser } from 'src/service/administrator/user';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const { action, id } = router.query;
    const [initialLoad, setInitialLoad] = useState(true);
    const [formData, setFormData] = useState({ id: '', email: '', name: '', address: '', phone: '', password: '', re_password: '', status: 1, department_id: null, section_id: null });
    const [listDepart, setListDepart] = useState([]);
    const [listSection, setListSection] = useState([]);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        validation();
    }, [formData]);

    useEffect(() => {
        if (id) getData(id);
        loadDepartment();
    }, [action, id]);

    useEffect(() => {
        setListSection([]);
        loadSection(formData.department_id);
    }, [formData.department_id]);

    const getData = async (id) => {
        let res = await getUser({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };
    const loadDepartment = async () => {
        let res = await getDepartment({ status: '1' });
        if (res && res.data) setListDepart([...res.data]);
    };

    const loadSection = async (id) => {
        let res = await getSection({ department_id: id, status: '1' });
        console.log(res.data);

        if (res && res.data) setListSection(res.data);
    };

    const validation = (force) => {
        if (initialLoad && !force) return true;
        if (!formData.name) return false;
        else if (!formData.email) return false;
        else if (!formData.phone) return false;
        else if (!formData.department_id) return false;
        else if (!formData.section_id) return false;
        else if (!formData.id && !formData.password && !formData.id) return false;
        else if (!formData.id && !formData.re_password && !formData.id) return false;
        else if (formData.email && !emailRegex.test(formData.email)) return false;

        if (formData.password !== formData.re_password) return false;
        return true;
    };

    const save = async () => {
        setInitialLoad(false);
        if (!validation(true)) {
            return showToast(error.required);
        }
        let send = undefined;
        if (formData.id) send = await updateUser(formData);
        else send = await createUser(formData);

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
                    <TextInput title="Name" required error={!validation() && !formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Email" required error={!validation() && (!formData.email || !emailRegex.test(formData.email))} onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} />
                    {!validation() && (!formData.email || !emailRegex.test(formData.email)) ? <small className="p-error">Email not valid.</small> : null}
                </div>
                <div className="field col-12 md:col-6">
                    <PasswordInput title="Password" required error={!validation() && !formData.password && !formData.id} onChange={(e) => setFormData({ ...formData, password: e.target.value })} value={formData.password} toggleMask />
                </div>
                <div className="field col-12 md:col-6">
                    <PasswordInput
                        title="Re-Password"
                        required
                        error={!validation() && (!formData.re_password || formData.password !== formData.re_password) && !formData.id}
                        onChange={(e) => setFormData({ ...formData, re_password: e.target.value })}
                        value={formData.re_password}
                        feedback={false}
                        toggleMask
                    />
                    {!validation() && (!formData.re_password || formData.password !== formData.re_password) && !formData.id ? <small className="p-error">Password did not match.</small> : null}
                </div>
                <div className="field col-12 md:col-6">
                    <NumberInput useGrouping={false} title="Phone" required error={!validation() && !formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.value })} value={formData.phone} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextareaInput title="Address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} value={formData.address} />
                </div>
                <div className="field col-12 md:col-6">
                    <SelectOption options={listDepart} value={formData.department_id} title="Department" required error={!validation() && !formData.department_id} onChange={(e) => setFormData({ ...formData, department_id: e.target.value })} />
                </div>
                <div className="field col-12 md:col-6">
                    <SelectOption options={listSection} value={formData.section_id} title="Section" required error={!validation() && !formData.section_id} onChange={(e) => setFormData({ ...formData, section_id: e.target.value })} />
                </div>
                <div className="field col-12 md:col-6"></div>
                <div className="field col-12 md:col-6">
                    <p>Status</p>
                    <SwitchInput onChange={(val) => setFormData({ ...formData, status: val })} value={formData.status} />
                </div>
            </div>
            <FooterTemplate checkMetadata={'adm_user'} onClickSave={() => save()} onClickBack={() => router.back()} data={formData} onChangeMetadata={(item) => setFormData({ ...formData, metadata: item })} />
        </div>
    );
};

export default Index;
