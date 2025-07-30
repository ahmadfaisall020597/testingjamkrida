import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const generateExcelCostControl = (body) => {
  return request({
    url: `api/costControl/generateExcel`,
    method: 'POST',
    service: servicePath.report,
    data: body,
  });
};

export const generateExcelListProduct = (body) => {
  return request({
    url: `api/listProduct/generateExcel`,
    method: 'POST',
    service: servicePath.report,
    data: body,
  });
};

export const generateExcelListPackage = (body) => {
  return request({
    url: `api/listPackage/generateExcel`,
    method: 'POST',
    service: servicePath.report,
    data: body,
  });
};

export const generateExcelCampServices = (body) => {
  return request({
    url: `api/campServices/generateExcel`,
    method: 'POST',
    service: servicePath.report,
    data: body,
  });
};