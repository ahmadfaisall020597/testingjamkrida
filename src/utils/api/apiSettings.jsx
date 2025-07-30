import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const getlistmitra = (param = {}) => {
  return request({
    url: 'api/bank-values',
    method: 'get',
    params: param,
    service: servicePath.settings
  });
};

export const getlistproduct  = (param = {}) => {
  return request({
    url: 'api/mapping/jns_prod',
    method: 'get',
    params: param,
    service: servicePath.settings
  });
};

export const getlistlampiran  = (param = {}) => {
  return request({
    url: 'api/mapping/lampiran',
    method: 'get',
    params: param,
    service: servicePath.settings
  });
};

export const getSettingGeneral  = (param = {}) => {
  return request({
    url: 'api/settings-general',
    method: 'get',
    params: param,
    service: servicePath.settings
  });
};

export const getlistreasonclaim  = (param = {}) => {
  return request({
    url: 'api/mapping/reason_claim',
    method: 'get',
    params: param,
    service: servicePath.settings
  });
};


export const getSettingPerykeyAndMitra = (moduleKey, mitra, productId) => {
  return request({
    // url: 'api/settings/?' + 'mitra_id=' + mitra + '&module=' + moduleKey +'&product_id='+ productId,
    url: 'api/settings',
    method: 'get',
    params: {
      mitra_id: mitra,
      module: moduleKey,
      product_id: productId
    },
    service: servicePath.settings
  });
};

export const storeSettingsUpdate = (body) => {
  return request({
    url: 'api/update-settings',
    method: 'post',
    data: body,
    service: servicePath.settings
  });
};

// export const editLookupValue = (body, id) => {
//   return request({
//     url: 'api/lookupValue/'+id,
//     method: 'put',
//     data: body,
//     service: servicePath.settings
//   });
// };

export const getLampiranMappingApi = (param = {}) => {
  return request({
    url: `api/mapping-lampiran`,
    method: 'get',
    params: param,
    service: servicePath.penjaminan
  })
}
