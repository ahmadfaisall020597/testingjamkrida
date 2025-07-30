import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const getListLookupValue = (param = {}) => {
  return request({
    url: 'api/lookupValue',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getLookupValueDetails = (param = {}, id) => {
  return request({
    url: 'api/lookupValue/'+id,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const storeLookupValue = (body) => {
  return request({
    url: 'api/lookupValue',
    method: 'post',
    data: body,
    service: servicePath.masterPage
  });
};

export const editLookupValue = (body, id) => {
  return request({
    url: 'api/lookupValue/'+id,
    method: 'put',
    data: body,
    service: servicePath.masterPage
  });
};

export const getListRoom = (param = {}) => {
  return request({
    url: 'api/room',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getRoomDetails = (param = {}, id) => {
  return request({
    url: 'api/room/'+id,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const storeRoom = (body) => {
  return request({
    url: 'api/room',
    method: 'post',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const editRoom = (body, id) => {
  return request({
    url: 'api/room/'+id,
    method: 'put',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const getListTenant = (param = {}) => {
  return request({
    url: 'api/tenant',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getTenantDetails = (param = {}, id) => {
  return request({
    url: 'api/tenant/'+id,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getTenantPackageDetails = (param = {}, id) => {
  return request({
    url: 'api/tenant/packagesTenant/'+id,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const storeTenant = (body) => {
  return request({
    url: 'api/tenant',
    method: 'post',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const editTenant = (body, id) => {
  return request({
    url: 'api/tenant/'+id,
    method: 'put',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const getListProduct = (param = {}) => {
  return request({
    url: 'api/products',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getProductDetails = (param = {}, id) => {
  return request({
    url: '/api/products/'+id,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const storeProducts = (body) => {
  return request({
    url: 'api/products',
    method: 'post',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const editProducts = (body, id) => {
  return request({
    url: 'api/products/'+id,
    method: 'put',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const getListOneTimeSetup = (param = {}) => {
  return request({
    url: 'api/onetimesetup',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getOneTimeSetupDetails = (param = {}, id) => {
  return request({
    url: 'api/onetimesetup/'+id,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const storeOneTimeSetup = (body) => {
  return request({
    url: 'api/onetimesetup',
    method: 'post',
    data: body,
    service: servicePath.masterPage
  });
};

export const editOneTimeSetup = (body, id) => {
  return request({
    url: 'api/onetimesetup/'+id,
    method: 'put',
    data: body,
    service: servicePath.masterPage
  });
};

export const getAllForExportOneTimeSetup = (param = {}) => {
  return request({
    url: 'api/onetimesetup/getallforexport',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getListProductPromo = (param = {}) => {
  return request({
    url: 'api/productPromo',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getProductPromoDetails = (param = {}, id) => {
  return request({
    url: `api/productPromo/${id}`,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const storeProductPromo = (body) => {
  return request({
    url: 'api/productPromo',
    method: 'post',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const editProductPromo = (body, id) => {
  return request({
    url: `api/productPromo/${id}`,
    method: 'put',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const getAllForExportProductPromo = (param = {}) => {
  return request({
    url: 'api/productPromo',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getListProductPackage = (param = {}) => {
  return request({
    url: 'api/productPackage',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getProductPackageDetails = (param = {}, id) => {
  return request({
    url: `api/productPackage/${id}`,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const storeProductPackage = (body) => {
  return request({
    url: 'api/productPackage',
    method: 'post',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const editProductPackage = (body, id) => {
  return request({
    url: `api/productPackage/${id}`,
    method: 'put',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.masterPage
  });
};

export const getAllForExportProductPackage = (param = {}) => {
  return request({
    url: 'api/productPackage/getallforexport',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getAllActiveUsers = (param = {}) => {
  return request({
    url: 'api/service/Other/getActiveUsers',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getAllCostCenter = (param = {}) => {
  return request({
    url: 'api/service/Other/getCostCenter',
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};