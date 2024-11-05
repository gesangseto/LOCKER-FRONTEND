import getConfig from 'next/config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { destroyLoginSession, getConfigApp, getProfile, updateProfile } from '../src/helper/storage';
import { updateUser } from '../src/service/administrator/user';
import ConfigTheme from './ConfigTheme';
import { LayoutContext } from './context/layoutcontext';
const templateAvatar = (props) => {
    const { name, email } = props;
    return (item, options) => {
        return (
            <div className={classNames(options.className, 'w-full p-link flex align-items-center')}>
                <div className="flex flex-column align">
                    <span className="font-bold">{name || 'No Name'}</span>
                    <span className="text-sm">{email || 'No Email'}</span>
                </div>
            </div>
        );
    };
};

const AppTopbar = forwardRef((props, ref) => {
    const router = useRouter();
    const { action, id } = router.query;
    const menu = useRef(null);
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [profile, setProfile] = useState({});
    const [menuProfile, setMenuProfile] = useState();
    const [showConfig, setShowConfig] = useState(false);
    const [appConf, setAppConf] = useState({ logo: null, name: '' });

    useEffect(() => {
        if (getConfigApp()) { setAppConf(getConfigApp()) }
    }, []);

    useEffect(() => {
        let user = getProfile() || {};
        if (!user.hasOwnProperty('id') || !user.hasOwnProperty('section_id')) {
            setProfile({});
            destroyLoginSession();
            router.replace('/auth/login');
        }
        if (Object.keys(profile).length === 0) {
            setProfile(user);
        }
        // let menu = getRoleMenu();
        // menu = menu.find((it) => router.asPath.includes(it.url));
        // if (!menu) {
        //     router.push('/auth/notfound');
        // } else if (menu && action && !menu[action]) {
        //     router.push('/auth/notfound');
        // }
    }, [router]);

    useEffect(() => {
        if (profile) {
            setMenuProfile([
                {
                    template: templateAvatar({ name: profile.name, email: profile.email })
                },
                { separator: true },
                {
                    label: 'Settings Layout',
                    icon: 'pi pi-fw pi-palette',
                    command: () => {
                        setShowConfig(true);
                    }
                },
                {
                    label: 'Sign Out',
                    icon: 'pi pi-fw pi-sign-out',
                    command: () => {
                        handleClickSignout();
                    }
                }
            ]);
        }
    }, [profile]);

    const handleClickSignout = () => {
        destroyLoginSession();
        router.replace('/auth/login');
    };

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));
    const handleClickUser = () => {
        router.push('/administrator/user/change-password');
    }

    const handleUpdateLayoutConfig = async () => {
        let params = { layout_config: layoutConfig, id: profile.id, skip_metadata: true };
        await updateUser(params);
        setShowConfig(false);
        let thisProfile = JSON.parse(JSON.stringify(profile));
        thisProfile.layout_config = layoutConfig;
        updateProfile(thisProfile);
    };

    const customIcons = (
        <React.Fragment>
            <button className="p-sidebar-icon p-link mr-2 p-button-success" onClick={() => handleUpdateLayoutConfig()}>
                <span className="pi pi-check" />
            </button>
        </React.Fragment>
    );

    return (
        <div className="layout-topbar">
            <Link href="/">
                <a className="layout-topbar-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <>
                        <img src={appConf.logo} width="47.22px" height={'35px'} widt={'true'} alt="logo" />
                        <span>{appConf.name}</span>
                    </>
                </a>
            </Link>
            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                <i className={'p-link layout-topbar-button align-items-center'} onClick={(e) => menu.current.toggle(e)}>
                    <Avatar image={`${contextPath}/user.png`} className="mr-2" shape="circle" />
                </i>
                <Menu ref={menu} model={menuProfile} popup onClick={(e) => handleClickUser(e)} />
            </div>
            <ConfigTheme visible={showConfig} onHide={() => setShowConfig(false)} icons={customIcons} />
        </div>
    );
});

export default AppTopbar;
