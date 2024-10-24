import { InputTextarea } from 'primereact/inputtextarea';
import React from 'react';

const TextareaInput = (props) => {
    const { error, required, title, float, value } = props;

    return (
        <span className={float ? 'p-float-label' : ''}>
            {!float ? (
                <label htmlFor={title}>
                    {title || 'No Title'} <small className="p-error">{required ? '*' : ''}</small>
                </label>
            ) : null}
            <InputTextarea id={title} rows="3" {...props} value={value || ''} className={error ? 'p-inputtext-sm p-invalid' : 'p-inputtext-sm p-valid'} autoResize error={error || undefined}></InputTextarea>
            {float ? (
                <label htmlFor={title}>
                    {title || 'No Title'} <span className="p-button-danger">{required ? '*' : ''}</span>
                </label>
            ) : null}
        </span>
    );
};

export default TextareaInput;
