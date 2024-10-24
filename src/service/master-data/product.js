import $axios from '../api';
let url = '/api/v1/master-data/product';

export const getProduct = async (property) => {
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

export const createProduct = async (Params) => {
    return new Promise((resolve) => {
        $axios
            .put(url, Params)
            .then((result) => {
                let _data = result.data;
                return resolve(_data);
            })
            .catch((e) => {
                return resolve(false);
            });
    });
};
export const updateProduct = async (Params) => {
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
export const deleteProduct = async (Params) => {
    let data = { data: { id: Params.id } };

    return new Promise((resolve) => {
        $axios
            .delete(url, data)
            .then((result) => {
                let _data = result.data;
                return resolve(_data);
            })
            .catch((e) => {
                return resolve(false);
            });
    });
};
