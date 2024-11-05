import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import HeaderForm from 'src/component/HeaderForm';
import PasswordInput from 'src/component/PasswordInput';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { error } from 'src/constant/message';
import { changePassword, getUser } from 'src/service/administrator/user';
import { getProfile } from '../../../src/helper/storage';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const { id } = router.query;
    const [initialLoad, setInitialLoad] = useState(true);
    const [formData, setFormData] = useState({ old_password: '', password: '', re_password: '', });
    const [profile, setProfile] = useState({});

    useEffect(() => {
        let user = getProfile() || {};
        if (Object.keys(profile).length === 0) {
            setProfile(user);
        }
    }, [router]);

    useEffect(() => {
        validation();
    }, [formData]);



    const getData = async (id) => {
        let res = await getUser({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };

    const validation = (force) => {
        if (initialLoad && !force) return true;
        if (!formData.password || !formData.re_password || !formData.old_password) return false;
        if (formData.password !== formData.re_password) return false;
        return true;
    };

    const save = async () => {
        if (profile.id == 0)
            return showToast({ type: 'error', message: "Cannot change Super Admin Password here." });
        setInitialLoad(false);
        if (!validation(true)) {
            return showToast(error.required);
        }
        let send = await changePassword(formData);
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
        }
    };

    return (
        <div className="card">
            <HeaderForm title="User Info" data={formData} onFinishApprove={() => getData(id)} />
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Name" value={profile.name} />
                </div>

                <div className="field col-12 md:col-6">
                    <TextInput title="Email" value={profile.email} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Section Name" value={profile.section_name} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Section Name" value={profile.department_name} />
                </div>

                <div className="card field col-12 md:col-12">
                    <h5>Change Password</h5>
                    <div className="grid p-fluid mt-5">
                        <div className="field col-12 md:col-6">
                            <PasswordInput title="Old Password" errormessage={"Old Password is required"} required error={!validation() && !formData.old_password} onChange={(e) => setFormData({ ...formData, old_password: e.target.value })} value={formData.old_password} toggleMask />

                        </div>
                        <div className="field col-12 md:col-6">
                        </div>
                        <div className="field col-12 md:col-6">
                            <PasswordInput title="New Password" errormessage={!formData.password ? "Password is required" : "Password didn't match with Re-Password"} required error={!validation() && !formData.password != formData.re_password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} value={formData.password} toggleMask />
                        </div>
                        <div className="field col-12 md:col-6">
                            <PasswordInput title="Re Password" errormessage={!formData.password ? "Re-Password is required" : "Re-Password didn't match with Password"} required error={!validation() && formData.re_password != formData.password} onChange={(e) => setFormData({ ...formData, re_password: e.target.value })} value={formData.re_password} toggleMask />
                        </div>
                        <div className="field col-2 md:col-2">
                            <Button label="Save" className="p-button p-button-success" onClick={() => save()} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Index;
