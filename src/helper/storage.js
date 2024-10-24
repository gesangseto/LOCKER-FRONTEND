import { decryptData, encryptData } from './utils';

export const setProfile = (data) => {
    let item = encryptData(data);
    localStorage.setItem('profile', item);
    return true;
};

export const getProfile = () => {
    let item = localStorage.getItem('profile');
    if (!item) return {};
    return decryptData(item);
};

export const getRoleMenu = () => {
    let profile = getProfile();
    if (typeof profile === 'object' && Object.keys(profile).length > 0) return profile.access_menu;
    else return [];
};

export const updateProfile = (data) => {
    localStorage.removeItem('profile');
    setProfile(data);
};

export const getConfigLayout = () => {
    let profile = getProfile();
    return profile.layout_config || {};
};

export const destroyLoginSession = () => {
    localStorage.removeItem('profile');
};

export const getUserToken = () => {
    let user = getProfile() || {};
    if (user.hasOwnProperty('token')) return user.token;
    else return null;
};

export const setSessionError = (message) => {
    localStorage.setItem('session_error', message);
};

export const getSessionError = () => {
    let res = localStorage.getItem('session_error');
    localStorage.removeItem('session_error');
    return res;
};

export const setConfigApp = (data) => {
    localStorage.setItem('config_application', JSON.stringify(data));
};
export const getConfigApp = () => {
    try {
        let res = localStorage.getItem('config_application');
        return JSON.parse(res)
    } catch (error) {
        return null
    }
};
