import { Calendar } from 'primereact/calendar';
import React from 'react';
import moment from 'moment';

const CalendarInput = (props) => {
    const { error, disabled, required, title, float, value, onChange, ...rest } = props;

    return (
        <span className={float ? 'p-float-label' : ''}>
            {!float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <small className="p-error">{required ? '*' : ''}</small>
                </label>
            )}
            <Calendar
                id={title}
                dateFormat="yy-mm-dd"
                value={value ? new Date(value) : undefined}
                onChange={(e) => (onChange ? onChange(moment(e.value).format('YYYY-MM-DD')) : null)}
                className={error ? 'p-inputtext-sm p-invalid' : ' p-inputtext-sm p-valid'}
                error={error.toString() || null}
                disabled={disabled ? 'true' : null}
                {...rest}
            ></Calendar>
            {float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <span className="p-button-danger">{required ? '*' : ''}</span>
                </label>
            )}
        </span>
    );
};

export default CalendarInput;
