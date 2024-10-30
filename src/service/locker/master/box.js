import $axios from '../../api';
let url = '/api/v1/locker/box';

export const getLkrBox = async (property) => {
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

export const createLkrBox = async (Params) => {
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
export const updateLkrBox = async (Params) => {
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
export const deleteLkrBox = async (Params) => {
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
let url_boxnumber = '/api/v1/locker/box-number';

export const getLkrBoxNumber = async (property) => {
    var defaultParam = { ...property };
    var query_string = new URLSearchParams(defaultParam).toString();
    return new Promise((resolve) => {
        $axios
            .get(`${url_boxnumber}?${query_string}`)
            .then((result) => {
                let _data = result.data;
                return resolve(_data);
            })
            .catch((e) => {
                return resolve(false);
            });
    });
};
export const updateLkrBoxNumber = async (Params) => {
    return new Promise((resolve) => {
        $axios
            .post(url_boxnumber, Params)
            .then((result) => {
                let _data = result.data;
                return resolve(_data);
            })
            .catch((e) => {
                return resolve(false);
            });
    });
};