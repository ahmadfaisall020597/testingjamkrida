import { servicePath } from "../variableGlobal/varApi";
import { request } from "./api";

export const resetPasswordUserMitra = (body) => {
  return request({
    url: `api/reset-password`,
    method: 'POST',
    data: body,
    headers: { "Content-Type": "application/json" },
    service: servicePath.userMitra
  });
};
export const resendEmailforResetPassword = (body) => {
  return request({
    url: 'api/resend-email-mitra',
    method: 'POST',
    data: body,
    headers: { "Content-Type": "application/json" },
    service: servicePath.userMitra
  })
}