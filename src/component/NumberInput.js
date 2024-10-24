import { InputNumber } from 'primereact/inputnumber';
import React from 'react';

const NumberInput = (props) => {
    const { error, required, title, float, value } = props;

    return (
        <span className={float ? 'p-float-label' : ''}>
            {!float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <small className="p-error">{required ? '*' : ''}</small>
                </label>
            )}
            <InputNumber {...props} className={error ? 'p-invalid' : 'p-valid'} error={error || undefined}></InputNumber>
            {float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <span className="p-button-danger">{required ? '*' : ''}</span>
                </label>
            )}
        </span>
    );
};

export default NumberInput;
