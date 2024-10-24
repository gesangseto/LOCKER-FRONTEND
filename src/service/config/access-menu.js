import $axios from '../api';
let url = '/api/v1/config/access-menu';

export const getConfAccessMenu = async (property) => {
    var defaultParam = { ...property };
    var query_string = new URLSearchParams(defaultParam).toString();
    return new Promise((resolve) => {
        $axios
            .get(`${url}?${query_string}`)
            .then((result) => {
                let _data = result.data;
                return resolve(_data);
            })
            .catch((e) => {
                return resolve(false);
            });
    });
};

export const updateConfAccessMenu = async (Params) => {
    return new Promise((resolve) => {
        $axios
            .post(url, Params)
            .then((result) => {
                let _data = result.data;
                return resolve(_data);
            })
            .catch((e) => {
                return resolve(false);
            });
    });
};
