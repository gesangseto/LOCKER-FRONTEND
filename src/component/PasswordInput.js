import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import React, { useEffect, useState } from 'react';

const PasswordInput = (props) => {
    const { error, required, title, float, value } = props;
    const [show, setShow] = useState(false);

    return (
        <span className={float ? 'p-float-label' : ''}>
            {!float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <small className="p-error">{required ? '*' : ''}</small>
                </label>
            )}

            <Password type={show ? 'text' : 'password'} id={title} {...props} className={error ? 'p-invalid ' : 'p-valid'} value={value || ''} error={error || undefined} />
            {/* <div className="p-inputgroup">
                <InputText type={show ? 'text' : 'password'} id={title} {...props} className={error ? 'p-invalid ' : 'p-valid'} value={value || ''} error={error || undefined} />
                <Button icon={show ? 'pi pi-eye-slash' : 'pi pi-eye'} onClick={() => setShow(!show)} className="p-button-plain p-button-text"></Button>
            </div> */}
            {float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <span className="p-button-danger">{required ? '*' : ''}</span>
                </label>
            )}
        </span>
    );
};

export default PasswordInput;
