import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';

const SelectOption = (props) => {
    const { error, required, disabled, title, float, value, options, optionLabel, onChange, ...rest } = props;
    const [list, setList] = useState([]);

    useEffect(() => {
        if (Array.isArray(props.options)) {
            let temp = [];
            for (const it of props.options) {
                let pcs = { ...it };
                pcs.name = it.name;
                pcs.value = it.id;
                if (optionLabel) {
                    pcs[optionLabel] = it[optionLabel];
                }
                temp.push(pcs);
            }
            setList(temp);
        }
    }, [props.options]);

    const handleOnChange = (e) => {
        let item = list.find((it) => it.value == e.value);
        if (onChange) {
            onChange(e, item);
        }
    };
    return (
        <span className={float ? 'p-float-label' : ''}>
            {!float ? (
                <label htmlFor={title}>
                    {title || 'No Title'} <small className="p-error">{required ? '*' : ''}</small>
                </label>
            ) : null}
            <Dropdown
                onChange={(e) => handleOnChange(e)}
                placeholder="Select One"
                value={value || null}
                id={title}
                optionLabel={optionLabel || 'name'}
                options={list}
                className={error ? 'p-inputtext-sm p-invalid' : 'p-inputtext-sm p-valid'}
                error={error ? error.toString() : null}
                required={required ? true : null}
                disabled={disabled ? true : null}
                {...rest}
            ></Dropdown>
            {float ? (
                <label htmlFor={title}>
                    {title || 'No Title'} <span className="p-button-danger">{required ? '*' : ''}</span>
                </label>
            ) : null}
        </span>
    );
};

export default SelectOption;
