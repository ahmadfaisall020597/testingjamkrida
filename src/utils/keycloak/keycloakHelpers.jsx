import { removeAuthToken, removeOrderSummaryDataDraft, removeProductionSelectionDataDraft, removeRefreshToken, removeRoomSelectionDataDraft, removeStepFunctionRequestDraft, removeTenantSelectionDataDraft, saveAuthToken, saveRefreshToken } from '../localStorage';
import { toast } from 'react-toastify';
import { getAllLookupValue } from 'src/pages/masterPage/lookupValue/lookupValueSetupFn';
import authInstance from './keycloak';
import getProfile from '../auth/authHelpers';

export const initOptions = {
  onLoad: 'login-required',
  checkLoginIframe: false
  // flow: "implicit"
}

export const keycloakLogout = (fn) =>{
  authInstance.logout();
}

export const receiveTokens = (data)=>{
  if(data){
    // console.log(data)
    // authToken = data.token;
    // refreshToken = data.refreshToken;
    // saveAuthToken(data.token)
    // saveRefreshToken(data.refreshToken)
  }
}

export const keycloakEvents = [
  'onReady',
  'onAuthSuccess',
  'onAuthError',
  'onAuthRefreshSuccess',
  'onAuthRefreshError',
  'onAuthLogout',
  'onTokenExpired',
  'onInitError'
];

export const handleEventKeycloak = (event, errorKeycloak)=>{
  try {
    switch (event) {
      case keycloakEvents[0]:
        break;
      case keycloakEvents[1]:
        getProfile().then(()=>{
          getAllLookupValue()
        })
        if(!authInstance.token){
          window.location.reload()
        }
        break;
      case keycloakEvents[2]:
        toast.info(`event: ${keycloakEvents[2]}`)
        break;
      case keycloakEvents[3]:
        toast.info(`event: ${keycloakEvents[3]}`)
        break;
      case keycloakEvents[4]:
        toast.info(`event: ${keycloakEvents[4]}`)
        break;
      case keycloakEvents[5]:
        removeAuthToken();
        removeRefreshToken();
        removeProductionSelectionDataDraft();
        removeRoomSelectionDataDraft();
        removeStepFunctionRequestDraft();
        removeTenantSelectionDataDraft();
        removeOrderSummaryDataDraft();
        removeAuthToken();
        removeRefreshToken();
        window.location.reload()
        toast.info(`event: ${keycloakEvents[5]}`)
        break;
      case keycloakEvents[6]:
        toast.error("token expired")
        break;
      case keycloakEvents[7]: // 'onInitError'
        toast.error("Keycloak initialization error");
        console.error("Keycloak onInitError:", errorKeycloak);
        break;
      default:
        console.warn(`Unhandled event: ${event}`);
        break;
    }
  } catch {
    toast.error(errorKeycloak)
  }
}
