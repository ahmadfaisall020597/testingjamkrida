import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const getDataClaim = (param = {}) => {
	return request({
		url: `api/claim`,
		method: "get",
		params: param,
		service: servicePath.claim
	});
};

export const storeClaim = (data = {}) => {
	return request({
		url: `api/claim/store`,
		method: "post",
		data: data,
		service: servicePath.claim
	});
};

export const getDetailClaim = claim_no => {
	return request({
		url: `api/claim/show/${claim_no}`,
		method: "get",
		// params: param,
		service: servicePath.claim
	});
};

export const updateStatusClaim = (claim_no, body) => {
	return request({
		url: `api/claim/${claim_no}/reject`,
		method: 'PUT',
		data: body,
		headers: { "Content-Type": "application/json" },
		service: servicePath.userMitra
	});
};

export const getRejectedLampiranClaimApi = (claim_no) => {
	return request({
		url: `api/claim/rejected-lampiran/${claim_no}`,
		method: "get",
		params: {},
		service: servicePath.claim
	});
};

export const storeBulk = (data = {}) => {
    return request({
        url: `api/claim/storeBulk`,
        method: 'post',
        data: data,
        service: servicePath.claim
    });
};

export const uploadRevisiLampiranClaimApi = (body) => {
	return request({
		url: `api/claim/revisi-lampiran`,
		method: "post",
		data: body,
		service: servicePath.claim
	});
}
