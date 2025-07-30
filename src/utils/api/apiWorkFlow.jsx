import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const updateStatus = (body) => {
  return request({
    url: `api/approval/submitFunctionRequestApproval`,
    method: 'POST',
    data: body,
    service: servicePath.workflow
  });
};