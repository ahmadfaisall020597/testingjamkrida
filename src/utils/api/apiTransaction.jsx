import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const getListRequestTransaction = (param = {}) => {
  return request({
    url: '/api/listFunctionRequest',
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getAllListRequestTransaction = (param = {}) => {
  return request({
    url: '/api/listFunctionRequest/getallforexport',
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getNonBookRoom = (param = {}) => {
  return request({
    url: 'api/requestFunction/getNonBookRoom',
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getBookRoom = (param = {}) => {
  return request({
    url: 'api/requestFunction/getBookRoom',
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getUnitMenu = (param = {}, idTenant) => {
  return request({
    url: `api/requestFunction/getUnitMenu/${idTenant}`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getListPackageTransaction = (param = {}, idTenant) => {
  return request({
    url: `api/requestFunction/getListPackage/${idTenant}`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getRecommendationTenantTransaction = (param = {}) => {
  return request({
    url: `api/requestFunction/recommendationTenant`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const calculateOrderTotal = (body) => {
  return request({
    url: `api/order/calculateOrderTotal`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const addFunctionRequest = (body) => {
  return request({
    url: `api/requestFunction/addFunctionRequest`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const editFunctionRequest = (id, body) => {
  return request({
    url: `api/requestFunction/editTransaction/${id}`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const getTransactionList = (param = {}) => {
  return request({
    url: `api/requestFunction/getTransactionList`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getFunctionRequestByID = (body, id) => {
  return request({
    url: `api/requestFunction/getFunctionRequestByID/${id}`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const listRequestCommentAndReview = (body) => {
  return request({
    url: `api/Inquiry/listRequestCommentAndReview`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const getCommentAndReviewByProductId = (param = {}) => {
  return request({
    url: `api/Inquiry/getCommentAndReviewByProductId`,
    method: 'GET',
    params: param,
    service: servicePath.transaction
  });
};

export const tenantListRequestCommentAndReview = (body) => {
  return request({
    url: `api/Inquiry/listRequestCommentAndReviewForTenantView`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const tenantGetCommentAndReviewByProductId = (param = {}) => {
  return request({
    url: `api/Inquiry/getCommentAndReviewByProductIdForTenant`,
    method: 'GET',
    params: param,
    service: servicePath.transaction
  });
};

export const getTransactionListTenant = (param = {}) => {
  return request({
    url: `api/requestFunction/getTransactionListTenant`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const cancelTransaction = (body) => {
  return request({
    url: `api/requestFunction/cancelTransaction`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const getStatusCountTenant = (param = {}) => {
  return request({
    url: `api/requestFunction/getStatusCountTenant`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getDetailTransactionByIdTenant = (param = {}) => {
  return request({
    url: `api/requestFunction/getDetailTransactionByIdTenant`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getHistoryStatusByOrderId = (param = {}) => {
  return request({
    url: `api/requestFunction/getHistoryStatusByOrderId`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getCourierListByTenantId = (param = {}) => {
  return request({
    url: `api/requestFunction/getCourierListByTenantId`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const sendMessage = (id, body) => {
  return request({
    url: `api/requestFunction/sendMessage/${id}`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const addCommentAndReview = (body) => {
  return request({
    url: `api/Inquiry/addCommentAndReview`,
    method: 'POST',
    data: body,
    service: servicePath.transaction,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getListHistoryOrder = (param={}) => {
  return request({
    url: `api/Inquiry/getListHistoryOrder`,
    method: 'get',
    params: param,
    service: servicePath.transaction,
  });
};

export const getStatusCountAdmin = (param={}) => {
  return request({
    url: `api/Inquiry/getStatusCountAdmin`,
    method: 'get',
    params: param,
    service: servicePath.transaction,
  });
};

export const getOrderHistoryByID = (id) => {
  return request({
    url: `api/Inquiry/getOrderHistoryByID/${id}`,
    method: 'POST',
    service: servicePath.transaction,
  });
};

export const getOrderHistorySequenceByID = (id) => {
  return request({
    url: `api/Inquiry/getOrderHistorySequenceByID/${id}`,
    method: 'POST',
    service: servicePath.transaction,
  });
};

export const updateOrderHistoryList = (id, body) => {
  return request({
    url: `api/Inquiry/updateOrderHistoryList/${id}`,
    method: 'PUT',
    service: servicePath.transaction,
    data: body,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const uploadExcelBulkRequest = (body) => {
  return request({
    url: `api/requestFunction/upload/excel`,
    method: 'POST',
    data: body,
    service: servicePath.transaction,
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const cancelOrderInquiry = (orderId) => {
  return request({
    url: `api/Inquiry/cancelOrderInquiry/${orderId}`,
    method: 'PUT',
    service: servicePath.transaction,
  });
};

export const addFunctionRequestBulk = (body) => {
  return request({
    url: `api/requestFunction/addFunctionRequestBulk`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const getOrderHistoryByIDIframe = (id) => {
  return request({
    url: `api/Iframe/getOrderHistoryByID/${id}`,
    method: 'POST',
    service: servicePath.transaction,
  });
};

export const getOrderHistorySequenceByIDIframe = (id) => {
  return request({
    url: `api/Iframe/getOrderHistorySequenceByID/${id}`,
    method: 'POST',
    service: servicePath.transaction,
  });
};

export const calculateOrderTotalIframe = (body) => {
  return request({
    url: `api/Iframe/calculateOrderTotal`,
    method: 'POST',
    data: body,
    service: servicePath.transaction
  });
};

export const getListPackageTransactionIframe = (param = {}, idTenant) => {
  return request({
    url: `api/Iframe/getListPackage/${idTenant}`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

export const getUnitMenuIframe = (param = {}, idTenant) => {
  return request({
    url: `api/Iframe/getUnitMenu/${idTenant}`,
    method: 'get',
    params: param,
    service: servicePath.transaction
  });
};

