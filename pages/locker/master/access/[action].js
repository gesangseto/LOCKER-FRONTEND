import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import FooterTemplate from 'src/component/FooterTemplate';
import SelectOptionMultiple from 'src/component/SelectOptionMultiple';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { capitalize } from 'src/helper/utils';
import { getLkrAccessColumn, getLkrAttribute, updateLkrAccessColumn } from 'src/service/locker/master/access';

const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const { action, id } = router.query;
    const [initialLoad, setInitialLoad] = useState(true);
    const [listAttribute, setListAttribute] = useState([]);
    const [formData, setFormData] = useState({ section_name: '', section_code: '', department_name: '', department_code: '', access_column: [], status: 1 });


    useEffect(() => {
        if (id) getData(id);
        getAttribute(id)
    }, [action, id]);

    const getData = async (id) => {
        let res = await getLkrAccessColumn({ id: id });
        if (res && res.data) {
            let data = res.data[0]
            setFormData({ ...data });
        }
    };

    const getAttribute = async (id) => {
        let res = await getLkrAttribute({ id: id });
        if (res && res.data) {
            let list = res.data.map(it => { return { id: it, value: it, label: it } })
            setListAttribute(list);
        }
    };

    const save = async () => {
        setInitialLoad(false);
        let send = await updateLkrAccessColumn(formData);
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            router.back();
        }
    };
    const changeChecked = (checked, data, type) => {
        let temp_role = [...formData.access_menu];
        let idx = temp_role.findIndex((item) => item.id === data.id);
        if (~idx) {
            if (type === 'all') {
                temp_role[idx].create = checked;
                temp_role[idx].read = checked;
                temp_role[idx].update = checked;
                temp_role[idx].delete = checked;
                temp_role[idx].print = checked;
                temp_role[idx].all = checked;
            } else {
                temp_role[idx][type] = checked;
                temp_role[idx].all = !checked ? false : temp_role[idx].all;
            }
            setFormData({ ...formData, access_menu: temp_role });
        }
    };

    return (
        <div className="card">
            <h5>{capitalize(action)} Access-Report</h5>
            <div className="grid p-fluid mt-5">
                <div className="field col-12 md:col-6">
                    <TextInput title="Department Code" value={formData.department_code} disabled />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Department Name" value={formData.department_name} disabled />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Section Code" value={formData.section_code} disabled />
                </div>
                <div className="field col-12 md:col-6">
                    <TextInput title="Section Name" value={formData.section_name} disabled />
                </div>
                <div className="field col-12 md:col-12">
                    <SelectOptionMultiple
                        title="Allow Access"
                        defaultValue={formData.access_column}
                        onChange={(e) => setFormData({ ...formData, access_column: e })}
                        options={listAttribute}
                        optionLabel="Allowing Column"
                        placeholder="Select Column"
                        filter
                        display="chip"
                    />
                </div>
            </div>
            <FooterTemplate onClickSave={() => save()} onClickBack={() => router.back()} data={formData} onChangeMetadata={(item) => setFormData({ ...formData, metadata: item })} />
        </div>
    );
};

export default Index;
