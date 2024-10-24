import $axios from '../../api';
let url = '/api/v1/warehouse/transaction/inbound';

export const getWhTrxInbound = async (property) => {
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
