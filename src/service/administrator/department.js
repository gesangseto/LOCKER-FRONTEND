import $axios from '../api';
let url = '/api/v1/admin/department';

export const getDepartment = async (property) => {
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

export const createDepartment = async (Params) => {
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
export const updateDepartment = async (Params) => {
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
export const deleteDepartment = async (Params) => {
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
