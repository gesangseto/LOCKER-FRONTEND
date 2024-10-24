import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { capitalize, humanizeText } from '../helper/utils';
import ButtonLink from './ButtonLink';
import { getRoleMenu } from '../helper/storage';

const HeaderIndex = (props) => {
    const { title } = props;
    const router = useRouter();
    const { action, id } = router.query;
    const [canCreate, setCanCreate] = useState(false);

    useEffect(() => {
        for (const it of getRoleMenu() || []) {
            if (it.url && router.asPath.includes(it.url)) {
                if (it.can_create && it.create) {
                    setCanCreate(true);
                }
            }
        }
    }, []);

    return (
        <>
            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                <div className="flex align-items-center">
                    <h5>
                        {action ? capitalize(action) : ''} {humanizeText(title) || 'No Title'}
                    </h5>
                </div>
                <div className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                    {canCreate && <ButtonLink href={`${router.asPath}create`} type="create" />}
                </div>
            </div>
        </>
    );
};

export default HeaderIndex;
