import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { capitalize } from '../helper/utils';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { getNextStatusWorkflow } from '../service/config/workflow';
import { getProfile } from '../helper/storage';
import { Dialog } from 'primereact/dialog';
import { updateWorkflowTransition } from 'src/service/config/workflow-transition';
import { useToast } from './ToastProvider';
import TextareaInput from 'src/component/TextareaInput';

const HeaderForm = (props) => {
    const showToast = useToast();
    const { title, data, onFinishApprove, useStatusInfo = false } = props;
    const router = useRouter();
    const { action, id } = router.query;
    const [listNewStatus, setListNewStatus] = useState([]);
    const [allNewStatus, setAllNewStatus] = useState([]);
    const [haveWorkflow, setHaveWorkflow] = useState(false);
    const [selectedTransition, setSelectedTransition] = useState({});
    const [remark, setRemark] = useState('');

    const buttonWorkflow = () => {
        return (
            <>
                {listNewStatus.map((it, i) => {
                    console.log(it);
                    return (
                        <Button key={i} className="p-button-rounded p-button-success mr-2" onClick={() => setSelectedTransition(it)}>
                            {it.name}
                        </Button>
                    );
                })}
            </>
        );
    };

    useEffect(() => {
        if (data && data.id && action === 'workflow') {
            loadStatus();
        }
    }, [data]);

    const loadStatus = async () => {
        let _res = await getNextStatusWorkflow({ id: data.id, workflow_type: 'website' });
        if (_res) {
            setAllNewStatus(_res.data);
            let profile = getProfile();
            let newData = [];
            for (const it of _res.data) {
                let idx = it.allowing_section.findIndex((o) => o.toString() === profile.section_id.toString());
                if (~idx) {
                    newData.push(it);
                    setHaveWorkflow(true);
                }
            }
            setListNewStatus(newData);
        }
    };

    const leftWorkflow = () => {
        return <>{haveWorkflow ? <p>You have a pending workflow transition</p> : <p>This transaction has a pending workflow transition </p>}</>;
    };

    const statusTemplate = () => {
        let string = '';
        if (data.status == 1) {
            string = 'qualified';
        } else if (!data.is_final) {
            string = 'negotiation';
        } else {
            string = 'unqualified';
        }
        return <span className={`customer-badge status-${string}`}>{data.status_name}</span>;
    };
    const handleSave = async () => {
        let form = { id: id, status: selectedTransition.id, remark: remark };
        let send = await updateWorkflowTransition(form);
        setSelectedTransition({});
        if (onFinishApprove) {
            onFinishApprove();
        }
        if (send && !send.error) {
            showToast({ type: 'success', message: 'Transition successfull' });
            router.back();
        } else {
            showToast({ type: 'error', message: send.message || 'Something wrong' });
        }
    };
    const basicDialogFooter = () => {
        return (
            <>
                <Button type="button" label="Save" onClick={() => handleSave()} className="p-button-success" />
            </>
        );
    };
    return (
        <>
            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                    <h5>
                        {capitalize(action)} {title || 'No Title'}
                    </h5>
                </div>
                <div className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                    {useStatusInfo && action !== 'create' ? statusTemplate() : null}
                </div>
            </div>
            {action === 'workflow' && data && data.hasOwnProperty('is_final') && !data.is_final && (
                <>
                    <Toolbar left={leftWorkflow} right={buttonWorkflow}></Toolbar>
                </>
            )}

            <Dialog visible={Object.keys(selectedTransition).length > 0} onHide={() => setSelectedTransition({})} header="Workflow Transition" style={{ width: '30vw' }} modal footer={basicDialogFooter}>
                <div className="grid p-fluid">
                    <div className="field col-12 md:col-12">
                        <p>
                            You are about to to commit the transition <b>[ {selectedTransition.name} ]</b> to this transaction. This action cannot be undone. Are you sure?
                        </p>
                    </div>
                    <div className="field col-12 md:col-12">
                        <TextareaInput title="Remark" value={remark} onChange={(e) => setRemark(e.target.value)} />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default HeaderForm;
