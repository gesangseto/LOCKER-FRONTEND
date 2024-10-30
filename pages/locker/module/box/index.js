import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import SelectOption from 'src/component/SelectOption';
import Table from 'src/component/Table';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { createLkrBox, deleteLkrBox, getLkrBox, updateLkrBox } from 'src/service/locker/master/box';
import { getLkrSize } from 'src/service/locker/master/size';
import ButtonLink from '../../../../src/component/ButtonLink';


const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });
    const [formData, setFormData] = useState({});
    const [showDialog, setShowDialog] = useState(false);
    const [listSize, setListSize] = useState([]);
    const [lastModule, setlastModule] = useState(1);

    const getData = async () => {
        let res = await getLkrBox(filter);
        if (res && !res.error) {
            let data = res.data
            setResApi(res);
            const find = data.reduce((max, obj) => (obj.module > max.module ? obj : max), data[0]);
            setFormData({ ...formData, module: find ? find.module + 1 : 1 })
        }
    };
    const getSize = async () => {
        let res = await getLkrSize();
        if (res && res.data) {
            let list = []
            for (const it of res.data) {
                list.push({ id: it.size, value: it.size, name: it.size })
            }
            setListSize(prev => [...list])
        }
    };

    const fieldTable = [
        { key: 'module', label: 'Module Number' },
        { key: 'cabinet', label: 'Total Cabinet' },
        { key: 'size', label: 'Size' },
    ];

    useEffect(() => {
        getData();
        getSize();
    }, [filter]);

    const handleClickCreate = async () => {
        const find = resApi.data.reduce((max, obj) => (obj.module > max.module ? obj : max), resApi.data[0]);
        setFormData({ module: find ? find.module + 1 : 1 })
        setShowDialog(true)
    };

    const handleClickUpdate = async (item) => {
        setFormData({ ...item, update: true })
        setShowDialog(true)
    };

    const handleClickSave = async () => {
        let send = undefined;
        if (formData.update) send = await updateLkrBox(formData);
        else send = await createLkrBox(formData);

        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            getData()
            showToast({ type: 'success', message: 'Data saved' });
        }
        setFormData({})
        setShowDialog(false)

    };

    const handleClickDelete = async (id) => {
        let send = await deleteLkrBox({ id: id });
        if (send.error) {
            showToast({ type: 'error', message: send.message });
        } else {
            showToast({ type: 'success', message: 'Data saved' });
            getData();
        }
    };

    return (
        <div className="card">
            {/* DIALOG */}
            <Dialog header="Management Box" visible={showDialog} modal style={{ width: '30vw' }} onHide={() => setShowDialog(false)}>
                <div className="grid p-fluid mt-5">
                    <div className="field col-12 md:col-12">
                        <TextInput disabled type="number" title="Module Number" value={formData.module} />
                    </div>
                    <div className="field col-12 md:col-12">
                        <TextInput type="number" title="Total Cabinet" value={formData.cabinet} onChange={(e) => setFormData({ ...formData, cabinet: e.target.value })} />
                    </div>
                    <div className="field col-12 md:col-12">
                        <SelectOption options={listSize} value={formData.size} title="Size" required onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button label="Save" className="p-button p-button-success" onClick={() => handleClickSave()} />
                    <Button label="Cancel" className="p-button p-button-warning" onClick={() => { setShowDialog(false) }}
                    />
                </div>
            </Dialog>
            {/* HEADER */}
            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                    <h5> Box </h5>
                </div>
                <div className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                    <ButtonLink type="create" onClick={() => handleClickCreate()} />
                </div>
            </div>
            {/* TABLE */}
            <Table keyId={'module'} data={resApi} disableDelete={true} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickUpdate={(data) => handleClickUpdate(data)} />
            {/* Tombol delete */}
            <div className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                <ButtonLink type="delete" onClick={() => handleClickDelete()} />
            </div>
        </div>
    );
};

export default Index;
