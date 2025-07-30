import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const getlistUserMitra = (param = {}) => {
  return request({
    url: 'api/user-mitra',
    method: 'GET',
    params: param,
    service: servicePath.userMitra
  });
};
export const getlisttUserMitrabyRole = (param = {}) => {
  return request({
    url: 'api/user-mitra-byrole',
    method: 'GET',
    params: param,
    service: servicePath.userMitra
  });
};
export const getlistUserMitraVerification = (param = {}) => {
  return request({
    url: 'api/user-mitra-verification',
    method: 'GET',
    params: param,
    service: servicePath.userMitra
  });
};
export const storeUserMitra = (body) => {
  return request({
    url: 'api/user-mitra',
    method: 'POST',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.userMitra
  });
};
export const storeRegister = (body) => {
  return request({
    url: 'api/user-mitra/register',
    method: 'POST',
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
    service: servicePath.userMitra
  });
};
export const uploadExcelUserMitra = (body) => {
  return request({
    url: 'api/user-mitra/upload-excel',
    method: 'POST',
    data: body,
    headers: { "Content-Type": "application/json" },
    service: servicePath.userMitra
  });
};
export const getDatabyUserId = (user_id) => {
  return request({
    url: 'api/user-mitra/getDatabyUserId/'+user_id,
    method: 'GET',
    service: servicePath.userMitra
  });
};
export const updateUserMitra = (user_id, body) => {
  return request({
    url: `api/user-mitra/update/${user_id}`,
    method: 'PUT',
    data: body,
    headers: { "Content-Type": "application/json" },
    service: servicePath.userMitra
  });
};
export const updateUserMitraStatus = (user_id, body) => {
  return request({
    url: `api/user-mitra/update-status/${user_id}`,
    method: 'PUT',
    data: body,
    headers: { "Content-Type": "application/json" },
    service: servicePath.userMitra
  });
};
export const updateStatusApprovalUserMitra = (user_id, body) => {
  return request({
    url: `api/user-mitra/update-status-approval/${user_id}`,
    method: 'PUT',
    data: body,
    headers: { "Content-Type": "application/json" },
    service: servicePath.userMitra
  });
};


