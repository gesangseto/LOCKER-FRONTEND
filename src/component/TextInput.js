import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import React from 'react';

const TextInput = (props) => {
    const { error, errormessage, required, disabled, title, float, value, ...rest } = props;

    return (
        <span className={float ? 'p-float-label' : ''}>
            {!float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <small className="p-error">{required ? '*' : ''}</small>
                </label>
            )}
            <InputText type="text" id={title} className={error ? 'p-inputtext-sm p-invalid' : ' p-inputtext-sm p-valid'} value={value || ''} error={error ? 'error' : null} disabled={disabled ? true : null} {...rest} />
            <small className="p-error">{errormessage ? errormessage : null}</small>

            {float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <span className="p-button-danger">{required ? '*' : ''}</span>
                </label>
            )}
        </span>
    );
};

export default TextInput;
