import $axios from '../api';
let url = '/api/v1/master-data/packaging';

export const getPackaging = async (property) => {
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

export const createPackaging = async (Params) => {
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
export const updatePackaging = async (Params) => {
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
export const deletePackaging = async (Params) => {
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
