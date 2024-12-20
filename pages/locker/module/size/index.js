import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import Table from 'src/component/Table';
import TextInput from 'src/component/TextInput';
import { useToast } from 'src/component/ToastProvider';
import { getLkrSize, updateLkrSize, deleteLkrSize, createLkrSize } from 'src/service/locker/master/size';
import ButtonLink from '../../../../src/component/ButtonLink';


const Index = () => {
    const showToast = useToast();
    const router = useRouter();
    const [resApi, setResApi] = useState({});
    const [filter, setFilter] = useState({ page: 1, limit: 10 });
    const [formData, setFormData] = useState({});
    const [showDialog, setShowDialog] = useState(false);

    const getData = async () => {
        let res = await getLkrSize(filter);
        if (res && !res.error) {
            let data = res.data
            setResApi(res);
        }
    };

    const fieldTable = [
        { key: 'id', label: 'ID' },
        { key: 'size', label: 'Size' },
        { key: 'price', label: 'Price' },
    ];

    useEffect(() => {
        getData();
    }, [filter]);

    const handleClickCreate = async () => {
        setFormData({})
        setShowDialog(true)
    };

    const handleClickRead = async (item) => {
        setFormData({ ...item, read: true })
        setShowDialog(true)
    };

    const handleClickUpdate = async (item) => {
        setFormData({ ...item, update: true })
        setShowDialog(true)
    };

    const handleClickSave = async () => {
        let send = undefined;
        if (formData.update) send = await updateLkrSize(formData);
        else send = await createLkrSize(formData);

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
        let send = await deleteLkrSize({ id: id });
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
            <Dialog header="Management Size" visible={showDialog} modal style={{ width: '30vw' }} onHide={() => setShowDialog(false)}>
                <div className="grid p-fluid ">
                    <div className="field col-12 md:col-12">
                        <TextInput title="Size" value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} />
                    </div>
                    <div className="field col-12 md:col-12">
                        <TextInput type="number" title="Price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
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
                    <h5> Size </h5>
                </div>
                <div className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                    <ButtonLink type="create" onClick={() => handleClickCreate()} />
                </div>
            </div>
            {/* TABLE */}
            <Table keyId={'size'} data={resApi} filtering={filter} field={fieldTable} onChangeFilter={(item) => setFilter(item)} onClickUpdate={(data) => handleClickUpdate(data)} onClickRead={(data) => handleClickRead(data)} onClickDelete={(data) => handleClickDelete(data)} />

        </div>
    );
};

export default Index;
