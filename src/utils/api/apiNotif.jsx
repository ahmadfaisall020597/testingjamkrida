import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api"

export const getCountNotif = (param = {}) => {
    return request({
        url: `api/notification/count`,
        method: 'get',
        params: param,
        service: ''
    });
};

export const getDataNotif = (body = {}) => {
    return request({
        url: `api/notification/getNotif`,
        method: 'post',
        data: body,
        service: ''
    });
};

export const updateDataNotif = (body = {}) => {
    return request({
        url: `api/notification/update`,
        method: 'put',
        data: body,
        service: ''
    });
};
