import { method } from "lodash";
import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const getProfileData = (param = {}) => {
  return request({
    url: `api/utilities/getProfile`,
    method: 'get',
    params: param,
    service: servicePath.masterPage
  });
};

export const getListMenu = (param = {}) => {
  return request({
    url: 'c/a0e3-eca4-41d2-a64d',
    method: 'get',
    params: param,
  });
};

export const getTokenGraphApi = () => {
  // still error, dont use this
  const subscriptionKey = import.meta.env.VITE_SUBSCRIPTION_KEY
  return request({
    url: '/api/GraphAPI/request-token?subscription-key=' + subscriptionKey,
    method: 'GET',
    service: servicePath.getToken
  });
};

export const downloadTemplateBulk = () => {
  return request({
    url: 'api/requestFunction/downloadTemplateBulk',
    method: 'GET',
    service: servicePath.transaction
  });
};

export const getLanguage = (lang) => {
  return request({
    url: `api/lang/${lang}`,
    method: 'GET',
    service: servicePath.global
  });
};

export const exportLanguageFile = (lang) => {
  return request({
    url: `api/language/export/${lang}`,
    method: 'GET',
    service: servicePath.global
  });
};

export const uploadLanguageFile = (formData) => {
  return request({
    url: `api/language/upload`,
    method: 'POST',
    data: formData,
    service: servicePath.global,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

