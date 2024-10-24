import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import FileUploadDefault from '../../../src/component/FileUploadDefault';
import NumberInput from '../../../src/component/NumberInput';
import PasswordInput from '../../../src/component/PasswordInput';
import TextInput from '../../../src/component/TextInput';
import TextareaInput from '../../../src/component/TextareaInput';
import { useToast } from '../../../src/component/ToastProvider';
import { error } from '../../../src/constant/message';
import { getConfApplication, updateConfigApplication } from '../../../src/service/config/application';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const [initialLoad, setInitialLoad] = useState(true);
    const [formData, setFormData] = useState({ id: '', email: '', name: '', address: '', phone: '', password: '', re_password: '', logo: null });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    useEffect(() => {
        validation();
    }, [formData]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async (id) => {
        let res = await getConfApplication();
        if (res && res.data) setFormData({ ...res.data[0] });
    };

    const validation = (force) => {
        if (initialLoad && !force) return true;
        if (!formData.name) return false;
        else if (!formData.email) return false;
        else if (!formData.phone) return false;
        else if (formData.password && !formData.re_password) return false;
        else if (!formData.password && formData.re_password) return false;
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
        send = await updateConfigApplication(formData);

        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            router.back();
        }
    };

    return (
        <div className="card">
            <h5>Config Application</h5>
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="App Name" required error={!validation() && !formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextareaInput title="Address" onChange={(e) => setFormData({ ...formData, address: e.target.value })} value={formData.address} />
                </div>
                <div className="field col-12 md:col-6">
                    <NumberInput useGrouping={false} title="Phone" required error={!validation() && !formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.value })} value={formData.phone} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="SA Email" required error={!validation() && (!formData.email || !emailRegex.test(formData.email))} onChange={(e) => setFormData({ ...formData, email: e.target.value })} value={formData.email} />
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
                    <FileUploadDefault title="App Logo" src={formData.logo} onChange={(url) => setFormData({ ...formData, logo: url })} />
                </div>


            </div>

            <div className="flex flex-wrap gap-2">
                <Button label="Save" className="p-button p-button-success" onClick={() => save()} />
                <Button label="Cancel" className="p-button p-button-warning" onClick={() => router.back()} />
            </div>
        </div>
    );
};

export default Index;
