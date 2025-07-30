import axios from 'axios';
import { servicePath } from '../variableGlobal/varApi'; 

export const loginAdmin = async (payload) => {
  return await axios.post(`${servicePath.userMitra}api/login`, payload);
};
export const loginUserMitra = async (payload) => {
  return await axios.post(`${servicePath.userMitra}api/login-mitra`, payload);
};
export const verifyOtp = async (payload) => {
  return await axios.post(`${servicePath.userMitra}api/verify-otp`, payload);
};

