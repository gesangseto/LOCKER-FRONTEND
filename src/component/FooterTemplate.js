import { useRouter } from 'next/router';
import { Button } from 'primereact/button';
import React, { useEffect, useState } from 'react';
import { error } from '../constant/message';
import { getMetadata } from '../service/config/metadata';
import TextInput from './TextInput';
import { useToast } from './ToastProvider';

const FooterTemplate = (props) => {
    const showToast = useToast();
    const router = useRouter();
    const { action, id } = router.query;
    const { onClickSave, onClickBack, onChangeMetadata, data, disableSave = false, checkMetadata = false, useMetadata = true, ...rest } = props;
    const [formMetadata, setFormMetadata] = useState({});
    const [metadatas, setMetadatas] = useState([]);
    useEffect(() => {
        if (data && formMetadata && Object.keys(formMetadata).length === 0 && data.hasOwnProperty('metadata')) {
            setFormMetadata(data.metadata);
        }
    }, [data]);

    useEffect(() => {
        if (onChangeMetadata) {
            onChangeMetadata(formMetadata);
        }
    }, [formMetadata]);

    useEffect(() => {
        // if (checkMetadata) {
        //     loadMetadata();
        // }
    }, []);
    const loadMetadata = async () => {
        let param = { status: 1, model: checkMetadata };
        let metadata = await getMetadata(param);
        if (metadata && metadata.total > 0) setMetadatas(metadata.data[0].metadata || []);
    };

    const testMatch = (regex, value) => {
        if (!value) value = '';
        if (!regex) return true;
        const pattern = new RegExp(regex, 'g');
        const isMatch = pattern.test(value);
        return isMatch;
    };

    const handleClickSave = () => {
        let haveError = false;
        for (const it of metadatas) {
            haveError = isError(it.pattern, formMetadata[it.name], it.mandatory);
            if (haveError) break;
        }
        if (haveError) {
            return showToast(error.required);
        } else if (onClickSave) {
            onClickSave();
        }
    };
    const isError = (patern, value, mandatory) => {
        value = value || '';
        let errorResult = null;

        let isMatch = testMatch(patern, value);
        if (mandatory) {
            errorResult = !isMatch;
        } else {
            errorResult = value ? !isMatch : null;
        }
        return errorResult;
    };

    return (
        <>
            {metadatas.length > 0 && useMetadata && (
                <div className="card">
                    <h5>Metadata</h5>
                    {metadatas.map((item, idx) => {
                        let value = '';
                        let key = item.name;
                        if (formMetadata && formMetadata.hasOwnProperty(key)) value = formMetadata[key];
                        let errorResult = isError(item.pattern, value, item.mandatory);
                        return (
                            <div className="grid p-fluid mt-5" key={idx}>
                                <div className="field col-8 md:col-8">
                                    <TextInput
                                        title={key}
                                        value={value}
                                        // dsa
                                        required={item.mandatory}
                                        pattern={item.pattern}
                                        onChange={(e) => setFormMetadata({ ...formMetadata, [item.name]: e.target.value })}
                                        error={errorResult}
                                        errorMessage={errorResult ? item.pattern_description : null}
                                    />
                                </div>
                                <div key={idx} className="field col-4 md:col-4">
                                    <TextInput title={'Validation'} disabled={'true'} value={item.pattern_name} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
            <div className="flex flex-wrap gap-2">
                {onClickSave && <Button disabled={(action !== 'update' && action !== 'create') || disableSave} label="Save" className="p-button p-button-success" onClick={() => handleClickSave()} />}
                <Button
                    label="Cancel"
                    className="p-button p-button-warning"
                    onClick={() => {
                        if (onClickBack) onClickBack();
                    }}
                />
            </div>
        </>
    );
};

export default FooterTemplate;
