import { InputSwitch } from 'primereact/inputswitch';
import React, { useEffect, useState } from 'react';

const SwitchInput = (props) => {
    const { value, onChange, useBoolean, disabled, useInfo = true, ...rest } = props;
    const [isOn, setIsOn] = useState(true);

    useEffect(() => {
        setIsOn(value == 1 ? true : false);
    }, [value]);

    const handleChange = (e) => {
        let val = e.target.value;
        if (disabled) return;
        setIsOn(e);
        if (onChange) {
            onChange(val ? (useBoolean ? true : 1) : useBoolean ? false : 0);
        }
    };
    return (
        <>
            <InputSwitch checked={isOn} onChange={(e) => handleChange(e)} {...rest} />
            <br />
            {useInfo ? (value ? (useBoolean ? 'True' : 'Active') : useBoolean ? 'False' : 'Inactive') : null}
        </>
    );
};

export default SwitchInput;
