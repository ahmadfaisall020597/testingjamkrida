import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api"

export const verifyDukcapilApi = (param = {}) => {
    return request({
        url: `api/penjaminan-verify-dukcapil`,
        method: 'get',
        params: param,
        service: servicePath.penjaminan
    });
};

export const list = (param = {}) => {
    return request({
        url: `api/penjaminan`,
        method: 'get',
        params: param,
        service: servicePath.penjaminan
    });
};

export const show = (trx_no, param = {}) => {
    return request({
        url: `api/penjaminan/show/${trx_no}`,
        method: 'get',
        params: param,
        service: servicePath.penjaminan
    });
};

export const listProduct = () => {
    return request({
        url: `api/penjaminan/products`,
        method: 'get',
        service: servicePath.penjaminan
    });
};

export const downloadSrtPerm = () => {
    return request({
        url: `api/penjaminan/tmpl_surat_permohonan`,
        method: 'get',
        service: servicePath.penjaminan
    });
};

export const store = (data = {}) => {
    return request({
        url: `api/penjaminan`,
        method: 'post',
        data: data,
        service: servicePath.penjaminan
    });
};

export const storeBulk = (data = {}) => {
    return request({
        url: `api/penjaminan/storeBulk`,
        method: 'post',
        data: data,
        service: servicePath.penjaminan
    });
};