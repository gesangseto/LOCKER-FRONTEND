import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import HeaderForm from 'src/component/HeaderForm';
import SwitchInput from 'src/component/SwitchInput';
import TextInput from 'src/component/TextInput';
import TextareaInput from 'src/component/TextareaInput';
import { useToast } from 'src/component/ToastProvider';
import { error } from 'src/constant/message';
import FooterTemplate from '../../../src/component/FooterTemplate';
// import { isRegExp } from 'util/types';
import { createStatusInformation, getStatusInformation, updateStatusInformation } from '../../../src/service/config/status-information';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const { action, id } = router.query;
    const [initialLoad, setInitialLoad] = useState(true);
    const [formData, setFormData] = useState({ id: '', code: '', name: '', description: '', uri: '', sys: null, is_final: null, is_lock_data: null });

    useEffect(() => {
        validation();
    }, [formData]);

    useEffect(() => {
        if (id) getData(id);
    }, [action, id]);

    const getData = async (id) => {
        let res = await getStatusInformation({ id: id });
        if (res && res.data) setFormData({ ...formData, ...res.data[0] });
    };

    const validation = (force) => {
        if (initialLoad && !force) return true;
        else if (!formData.code) return false;
        else if (!formData.name) return false;
        else if (!formData.uri) return false;
        return true;
    };

    const save = async () => {
        setInitialLoad(false);
        if (!validation(true)) {
            return showToast(error.required);
        }
        let send = undefined;
        if (formData.id) send = await updateStatusInformation(formData);
        else send = await createStatusInformation(formData);

        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            router.back();
        }
    };
    return (
        <div className="card">
            <HeaderForm title="Status Information" data={formData} onFinishApprove={() => getData(id)} />
            <div className="grid p-fluid mt-5 mb-5">
                <div className="field col-12 md:col-3">
                    <TextInput title="Status ID" disabled={formData.sys || action != 'create' ? true : null} required error={!validation() && !formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} value={formData.id} />
                </div>
                <div className="field col-12 md:col-3">
                    <TextInput title="Code" disabled={formData.sys ? true : null} required error={!validation() && !formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} value={formData.code} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Name" disabled={formData.sys ? true : null} required error={!validation() && !formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="URI" disabled={formData.sys ? true : null} required error={!validation() && !formData.uri} onChange={(e) => setFormData({ ...formData, uri: e.target.value })} value={formData.uri} />
                </div>
                <div className="field col-12 md:col-6">
                    <TextareaInput title="Description" disabled={formData.sys ? true : null} onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} />
                </div>
                <div className="field col-4 md:col-2">
                    <p>is Lock Data</p>
                    <SwitchInput useBoolean disabled={formData.sys ? true : null} onChange={(val) => setFormData({ ...formData, is_lock_data: val })} value={formData.is_lock_data} />
                </div>
                <div className="field col-4 md:col-2">
                    <p>is Final</p>
                    <SwitchInput useBoolean disabled={formData.sys ? true : null} onChange={(val) => setFormData({ ...formData, is_final: val })} value={formData.is_final} />
                </div>
                <div className="field col-4 md:col-2">
                    <p>System</p>
                    <SwitchInput disabled={formData.sys ? true : null} useBoolean value={formData.sys} />
                </div>
            </div>
            <FooterTemplate
                disableSave={formData.sys ? true : null}
                checkMetadata={'adm_department'}
                onClickSave={() => save()}
                onClickBack={() => router.back()}
                data={formData}
                onChangeMetadata={(item) => setFormData({ ...formData, metadata: item })}
            />
        </div>
    );
};

export default Index;
