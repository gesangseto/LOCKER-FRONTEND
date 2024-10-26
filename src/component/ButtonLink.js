import Link from 'next/link';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react';

const ButtonLink = (props) => {
    const { type, className, onClick, ...rest } = props;
    const [icon, setIcon] = useState(null);
    const [design, setDesign] = useState(null);
    useEffect(() => {
        if (type === 'create') {
            setIcon(`pi pi-plus `);
            setDesign(`p-button-success ${className}`);
        } else if (type === 'read') {
            setIcon(`pi pi-eye `);
            setDesign(`p-button-secondary p-button-text ${className}`);
        } else if (type === 'update') {
            setIcon(`pi pi-pencil `);
            setDesign(`p-button-warning p-button-text ${className}`);
        } else if (type === 'delete') {
            setIcon(`pi pi-trash `);
            setDesign(`p-button-danger p-button-text ${className}`);
        } else if (type === 'workflow') {
            setIcon(`pi pi-check-square p-button-text `);
            setDesign(`p-button-info p-button-text ${className}`);
        } else if (type === 'copy') {
            setIcon(`pi pi-copy p-button-text `);
            setDesign(`p-button-info p-button-text ${className}`);
        } else if (type === 'print') {
            setIcon(`pi pi-print p-button-text `);
            setDesign(`p-button-success  ${className}`);
        } else {
            setIcon(`pi pi-question `);
            setDesign(`p-button-secondary ${className}`);
        }
    }, []);
    return (
        <>
            {onClick ? (
                <Button size="small" icon={icon} className={`${design}`} onClick={() => onClick()} />
            ) : (
                <Link {...rest}>
                    <a>
                        <Button size="small" icon={icon} className={`${design}`} />
                    </a>
                </Link>
            )}
        </>
    );
};

export default ButtonLink;
