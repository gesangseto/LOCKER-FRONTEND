import { FileUpload } from 'primereact/fileupload';
import React, { useEffect, useState } from 'react';

const FileUploadDefault = (props) => {
    const { error, src, errorMessage, required, disabled, title, float, value, onChange, ...rest } = props;
    const [imgUrl, setImgUrl] = useState(null)

    useEffect(() => { if (onChange) onChange(imgUrl) }, [imgUrl])

    useEffect(() => { if (src) setImgUrl(src) }, [src])

    const handleSelect = (event) => {
        const file = event.files[0];
        if (file) {
            convertToBase64(file);
        }
    };

    const handleClear = () => {
        setImgUrl(null)
    };

    const convertToBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setImgUrl(reader.result)
        };
        reader.onerror = (error) => {
            console.error('Error converting file to base64:', error);
        };
        reader.readAsDataURL(file);
    };

    return (
        <span className={float ? 'p-float-label' : ''}  >
            {!float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <small className="p-error">{required ? '*' : ''}</small>
                </label>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileUpload
                    mode="basic"
                    accept="image/*"
                    maxFileSize={1000000}
                    onSelect={handleSelect}
                    onClear={handleClear}
                    style={{ maxWidth: '400px', width: '100%' }}
                />
                <img
                    src={imgUrl}
                    style={{ maxWidth: '50px', maxHeight: '50px', width: '100%', height: 'auto' }}
                    alt="logo"
                />
            </div>
            <small className="p-error">{errorMessage ? errorMessage : null}</small>

            {float && (
                <label htmlFor={title}>
                    {title || 'No Title'} <span className="p-button-danger">{required ? '*' : ''}</span>
                </label>
            )}
        </span>
    );
};

export default FileUploadDefault;
