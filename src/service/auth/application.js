import $axios from '../api';
let url = '/api/v1/auth/login';

export const login = async (Params = Object) => {
    let body = { ...Params, type: 'website' };
    return new Promise((resolve) => {
        $axios
            .post(url, body)
            .then((result) => {
                console.log(result);
                let _data = result.data;
                return resolve(_data);
            })
            .catch((e) => {
                return resolve(false);
            });
    });
};
