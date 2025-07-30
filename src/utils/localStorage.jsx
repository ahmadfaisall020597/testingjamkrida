import { getFromLocalStorage, removeFromLocalStorage, saveToLocalStorage } from "./cryptojs";
import { BULK_LIST_DATA, BULK_ORDER_SUMMARY_DATA, BULK_PRODUCT_SELECTION_DATA, BULK_STEP_FUNCTION_REQUEST, INIT_SSO, ORDER_EDIT_OR_VIEW_DATA, ORDER_SUMMARY_DATA, PRODUCT_SELECTION_DATA, REFRESH_TOKEN_KEY, ROOM_SELECTION_DATA, STEP_FUNCTION_REQUEST, TENANT_SELECTION_DATA, TOKEN_KEY } from "./variableGlobal/varLocalStorage";

// checkinit
export const saveInitSSO = (value) => {
  saveToLocalStorage(INIT_SSO, value);
};

export const getInitSSO = () => {
  return getFromLocalStorage(INIT_SSO);
};

// Fungsi untuk menyimpan token otentikasi
export const saveAuthToken = (token) => {
  saveToLocalStorage(TOKEN_KEY, token);
};

// Fungsi untuk mengambil token otentikasi
export const getAuthToken = () => {
  return getFromLocalStorage(TOKEN_KEY);
};

// Fungsi untuk menghapus token otentikasi
export const removeAuthToken = () => {
  removeFromLocalStorage(TOKEN_KEY);
};

// Fungsi untuk menyimpan token REFRESH
export const saveRefreshToken = (token) => {
  saveToLocalStorage(REFRESH_TOKEN_KEY, token);
};

// Fungsi untuk mengambil token REFRESH
export const getRefreshToken = () => {
  return getFromLocalStorage(REFRESH_TOKEN_KEY);
};

// Fungsi untuk menghapus token REFRESH
export const removeRefreshToken = () => {
  removeFromLocalStorage(REFRESH_TOKEN_KEY);
};

export const saveStepFunctionRequestDraft = (val) =>{
  saveToLocalStorage(STEP_FUNCTION_REQUEST, val)
}

export const getStepFunctionRequestDraft = () =>{
  return getFromLocalStorage(STEP_FUNCTION_REQUEST)
}
export const removeStepFunctionRequestDraft = () => {
  removeFromLocalStorage(STEP_FUNCTION_REQUEST);
};

export const saveRoomSelectionDataDraft = (val) =>{
  saveToLocalStorage(ROOM_SELECTION_DATA, val)
}

export const getRoomSelectionDataDraft = () =>{
  return getFromLocalStorage(ROOM_SELECTION_DATA)
}
export const removeRoomSelectionDataDraft = () => {
  removeFromLocalStorage(ROOM_SELECTION_DATA);
};

export const saveTenantSelectionDataDraft = (val) =>{
  saveToLocalStorage(TENANT_SELECTION_DATA, val)
}

export const getTenantSelectionDataDraft = () =>{
  return getFromLocalStorage(TENANT_SELECTION_DATA)
}
export const removeTenantSelectionDataDraft = () => {
  removeFromLocalStorage(TENANT_SELECTION_DATA);
};

export const saveProductionSelectionDataDraft = (val) =>{
  saveToLocalStorage(PRODUCT_SELECTION_DATA, val)
}
export const getProductionSelectionDataDraft = () =>{
  return getFromLocalStorage(PRODUCT_SELECTION_DATA)
}
export const removeProductionSelectionDataDraft = () => {
  removeFromLocalStorage(PRODUCT_SELECTION_DATA);
};

export const saveOrderSummaryDataDraft = (val) =>{
  saveToLocalStorage(ORDER_SUMMARY_DATA, val)
}
export const getOrderSummaryDataDraft = () =>{
  return getFromLocalStorage(ORDER_SUMMARY_DATA)
}
export const removeOrderSummaryDataDraft = () => {
  removeFromLocalStorage(ORDER_SUMMARY_DATA);
};

export const saveOrderEditOrViewDataDraft = (val) =>{
  saveToLocalStorage(ORDER_EDIT_OR_VIEW_DATA, val)
}
export const getOrderEditOrViewDataDraft = () =>{
  return getFromLocalStorage(ORDER_EDIT_OR_VIEW_DATA)
}
export const removeOrderEditOrViewDataDraft = () => {
  removeFromLocalStorage(ORDER_EDIT_OR_VIEW_DATA);
};

export const saveBulkStepFunctionRequest = (val) =>{
  saveToLocalStorage(BULK_STEP_FUNCTION_REQUEST, val)
}
export const getBulkStepFunctionRequest = () =>{
  return getFromLocalStorage(BULK_STEP_FUNCTION_REQUEST)
}
export const removeBulkStepFunctionRequest = () => {
  removeFromLocalStorage(BULK_STEP_FUNCTION_REQUEST);
};

export const saveBulkListData = (val) =>{
  saveToLocalStorage(BULK_LIST_DATA, val)
}
export const getBulkListData = () =>{
  return getFromLocalStorage(BULK_LIST_DATA)
}
export const removeBulkListData = () => {
  removeFromLocalStorage(BULK_LIST_DATA);
};

export const saveBulkProductData = (val) =>{
  saveToLocalStorage(BULK_PRODUCT_SELECTION_DATA, val)
}
export const getBulkProductData = () =>{
  return getFromLocalStorage(BULK_PRODUCT_SELECTION_DATA)
}
export const removeBulkProductData = () => {
  removeFromLocalStorage(BULK_PRODUCT_SELECTION_DATA);
};

export const saveBulkOrderSummaryData= (val) =>{
  saveToLocalStorage(BULK_ORDER_SUMMARY_DATA, val)
}
export const getBulkOrderSummaryData = () =>{
  return getFromLocalStorage(BULK_ORDER_SUMMARY_DATA)
}
export const removeBulkOrderSummaryData = () => {
  removeFromLocalStorage(BULK_ORDER_SUMMARY_DATA);
};