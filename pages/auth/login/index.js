import getConfig, { setConfig } from 'next/config';
import { useRouter } from 'next/router';
import { InputText } from 'primereact/inputtext';
import { Message } from 'primereact/message';
import { Password } from 'primereact/password';
import { classNames } from 'primereact/utils';
import React, { useContext, useEffect, useState } from 'react';
import { useToast } from 'src/component/ToastProvider';
import { error } from 'src/constant/message';
import { setProfile, getRoleMenu } from 'src/helper/storage';
import { login } from 'src/service/auth/application';
import { LayoutContext } from '../../../layout/context/layoutcontext';
import { getSessionError, setConfigApp, getConfigApp } from '../../../src/helper/storage';
import { getConfApplication } from '../../../src/service/config/application';

const LoginPage = () => {
    const router = useRouter();
    const showToast = useToast();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [conf, setConf] = useState({ logo: null });
    const [errorMessage, setErrorMessage] = useState();
    const [initialLoad, setInitialLoad] = useState(true);
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    useEffect(() => {
        setErrorMessage(getSessionError());
        if (getConfigApp()) { setConf(getConfigApp()) }
        loadConfigApplication(getSessionError());
    }, []);

    const loadConfigApplication = async (id) => {
        let res = await getConfApplication();
        if (res && res.data) { setConfigApp(res.data[0]) }
    };

    const handleClickLogin = async () => {
        setInitialLoad(false);
        if (!validation(true)) {
            return showToast(error.required);
        }
        let send = await login(formData);
        if (send && !send.error) {
            setProfile(send.data[0]);
            showToast({ type: 'success', message: send.message });
            let menu = getRoleMenu()

            let findAccessReport = menu.find(it => it.url == '/locker/transaction/report')
            if (findAccessReport) { router.replace('/locker/transaction/report'); }
            else { router.push('/'); }
            return;
        } else if (send && send.error) {
            return showToast({ type: 'error', message: send.message });
        }
        return showToast({ type: 'error', message: 'Oops Something wrong' });
    };
    const validation = (force) => {
        if (initialLoad && !force) return true;
        if (!formData.email) return false;
        else if (formData.email && !emailRegex.test(formData.email)) return false;
        else if (!formData.password) return false;
        return true;
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div style={{ borderRadius: '56px', padding: '0.3rem', background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)' }}>
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={conf.logo} alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Sign in to continue</div>
                            {errorMessage && <Message severity="error" text={errorMessage} />}
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>

                            <InputText
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                value={formData.email}
                                inputid="email1"
                                type="text"
                                placeholder="Email address"
                                className={!validation() && (!formData.email || !emailRegex.test(formData.email)) ? `w-full md:w-30rem p-invalid` : `w-full md:w-30rem `}
                                style={{ padding: '1rem' }}
                            />
                            <br />
                            {!validation() && (!formData.email || !emailRegex.test(formData.email)) ? <small className="p-error">Email not valid.</small> : null}

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2 mt-4">
                                Password
                            </label>
                            <Password
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                value={formData.password}
                                inputid="password1"
                                placeholder="Password"
                                feedback={false}
                                toggleMask
                                className={!validation() && !formData.password ? 'w-full mb-5 p-invalid' : 'w-full mb-5'}
                                inputClassName="w-full p-3 md:w-30rem"
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter') {
                                        handleClickLogin();
                                    }
                                }}
                            ></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                {/* <div className="flex align-items-center">
                                    <Checkbox inputid="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a> */}
                            </div>
                            {/* <Button label="Sign In" className="w-full p-3 text-xl" onClick={() => handleClickLogin()}></Button> */}
                            <button onClick={() => handleClickLogin()} className="w-full p-3 text-xl" style={{ borderRadius: 10, backgroundColor: 'blue', color: 'white', borderColor: 'blue' }}>
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

LoginPage.getLayout = function getLayout(page) {
    return <React.Fragment>{page}</React.Fragment>;
};
export default LoginPage;
