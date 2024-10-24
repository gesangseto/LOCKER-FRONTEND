import { MultiSelect } from 'primereact/multiselect';
import React, { useEffect, useState } from 'react';

const SelectOptionMultipleV2 = (props) => {
    const { error, required, title, float, defaultValue, options, onChange } = props;
    const [initialLoad, setInitialLoad] = useState(true);
    const [selectedData, setSelectedData] = useState([]);
    useEffect(() => {
        if (Array.isArray(options) && Array.isArray(defaultValue) && defaultValue.length > 0 && options.length > 0 && initialLoad) {
            setInitialLoad(false);
            setSelectedData(convertToOption(defaultValue));
        }
    }, [options, defaultValue]);

    const convertToOption = (selectedValues) => {
        return selectedValues.map((value) => {
            if (typeof value === 'string' || typeof value === 'number') {
                const option = options.find((item) => item.id.toString() == value.toString());
                return option ? option : null;
            }
            return value;
        });
    };

    const itemTemplate = (option) => {
        return (
            <div className="flex align-items-center">
                <span>{option.label ? option.label : option.name}</span>
            </div>
        );
    };

    useEffect(() => {
        if (onChange) {
            onChange(selectedData.map((it) => it.id));
        }
    }, [selectedData]);

    return (
        <span className={float ? 'p-float-label' : ''}>
            {!float ? (
                <label htmlFor={title}>
                    {title || 'No Title'} <small className="p-error">{required ? '*' : ''}</small>
                </label>
            ) : null}
            <MultiSelect key={'id'} value={selectedData} onChange={(e) => setSelectedData(e.value)} options={options} optionLabel="label" placeholder="Select data" filter display="chip" itemTemplate={itemTemplate} />

            {/* <Dropdown
                {...props}
                value={value ? value.toString() : null}
                id={title}
                optionLabel={optionLabel || 'name'}
                placeholder="Select One"
                options={list}
                className={error ? 'p-inputtext-sm p-invalid' : 'p-inputtext-sm p-valid'}
                error={error || undefined}
            ></Dropdown> */}
            {float ? (
                <label htmlFor={title}>
                    {title || 'No Title'} <span className="p-button-danger">{required ? '*' : ''}</span>
                </label>
            ) : null}
        </span>
    );
};

export default SelectOptionMultipleV2;
