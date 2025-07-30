
import { store } from "src/utils/store/combineReducers";
import { setShowLoadingScreen, setShowModalGlobal, setShowModalQuery } from "src/utils/store/globalSlice";
import { toast } from "react-toastify";
import { getAllActiveUsers, getAllCostCenter, getAllForExportOneTimeSetup } from "src/utils/api/apiMasterPage";
import { removeBulkListData, removeBulkOrderSummaryData, removeBulkProductData, removeBulkStepFunctionRequest, removeOrderEditOrViewDataDraft, removeOrderSummaryDataDraft, removeProductionSelectionDataDraft, removeRoomSelectionDataDraft, removeStepFunctionRequestDraft, removeTenantSelectionDataDraft } from "src/utils/localStorage";
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest";
import { calculateOrderTotal } from "src/utils/api/apiTransaction";
import { decryptData, encryptData } from "src/utils/cryptojs";
import moment from "moment";

export const objectName = [
  "requestType",//0
  "status",//1
  "tenantId",//2
  "tenantName",//3
  "deliveryDateFrom",//4
  "deliveryDateTo",//5
  "eventName",//6
  "purposeOfFunction",//7
  "pageNumber",//8
  "pageSize",//9
  "sortBy",//10
  "order",//11
]

export const objectTable = [
  "ORDER_ID", //0
  "SEQUENCE", //1
  "DELIVERY_DATE", //2
  "FUNCTION_NAME", //3
  "TENANT_NAME", //4
  "REQUEST_TYPE", //5
  "STATUS", //6
  "ROOM_NAME", //7
  "ROOM_BOOK_BY", //8
  "BOOK_DATE", //9
  "BOOK_TO", //10
  "DELIVER_TYPE", //11
  "ITEMS", //12
  "TOTAL_PRICE", //13
  "TOTAL_PRICE_AFTER_DISCOUNT", //14
  "ORDER_TYPE", //15
]

export const objectRoomSelection = [
  "DELIVERY_TO", //0
  "ROOM_TEAMS_ID", //1
  "REQUEST_TYPE", //2
  "NON_BOOK_ROOM", //3
  "ROOM_NON_TEAMS_ID", //4
  "EVENT_NAME", //5
  "PURPOSE_OF_FUNCTION", //6
  "TOTAL_ATTENDANCE", //7
  "DELIVERY_DATETIME", //8
  "DELIVERY_TO_DESC", //9
  "ROOM_NON_TEAMS_NAME", //10
  "TYPE_BOOK_ROOM", //11
  "ROOM_TEAMS_NAME", //12
  "OBJ_ROOM_DATA",//13
  "PHONE_NUMBER" //14
]

export const objectTenantSelection = [
  "TENANT_ID", //0
  "TENANT_NAME", //1
  "TENANT_IMAGE", //2
]

export const objectPackageSelection = [
  "PACKAGE_ID", //0
  "PACKAGE_NAME", //1
  "PACKAGE_IMAGE", //2
  "AVAILABLE", //3
  "DETAILS_CATEGORY", //4
  "CATEGORY_PRODUCT", //5
  "CATEGORY_PRODUCT_DESC", //6
  "QUANTITY", //7
  "DETAILS_CATEGORY_PRODUCT", //8
  "PRODUCT_ID",//9
  "PRODUCT_NAME", //10
  "DETAILS_PRICE", //11
  "PACKAGE_PRICE", //12
]

export const objectProductSelection = [
  "PRODUCT_ID", //0
  "PRODUCT_NAME", //1
  "PRICE_PRODUCT", //2
  "IMAGE_PRODUCT", //3
  "AVAILABLE", //4
  "ADD_ON1_DESC", //5
  "ADD_ON2_DESC", //6
  "ADD_ON3_DESC", //7
  "ADD_ON4_DESC", //8
  "ADD_ON5_DESC", //9
  "QUANTITY", //10
]

export const objectPackageProductSelection = [
  "cartProduct", //0
  "cartPackage", //1
  objectTenantSelection[0], //2
]

export const objectOrderSummaryData = [
  "deliveryType", //0
  "request", //1
  "notes", //2
  "logsNotes", //3
  "costCenterId", //4
  "costCenterName", //5
]

export const objectOrderEditOrViewData = [
  "orderId", //15
  "canEdit", //16
  "LOGS", //8
]

export const fieldLabels = {
  [objectRoomSelection[0]]: "Delivery To",
  [objectRoomSelection[1]]: "Room (Teams)",
  [objectRoomSelection[4]]: "Room (Non-Teams)",
  [objectRoomSelection[5]]: "Event Name",
  [objectRoomSelection[6]]: "Purpose of Function",
  [objectRoomSelection[7]]: "Total Attendance",
  [objectRoomSelection[8]]: "Delivery Date & Time",
  [objectTenantSelection[0]]: "Tenant",
  [objectRoomSelection[14]]: "Phone Number",
};

export const titleModalQueryCostCenter = "List All Cost Center"

export const titleModalQueryDeliveryTo = "List All Users"

export const updateFormSearchWithTenant = (prevFormData, selectableModalQuery, objectName) => {
  return {
    ...prevFormData,
    [objectName[2]]: selectableModalQuery?.data?.TENANT_ID,
    [objectName[3]]: selectableModalQuery?.data?.TENANT_NAME
  };
};

export const handleModalOpenQueryDeliveryTo = () => {
  const data = getAllActiveUsers;

  const columnConfig = [
    {
      name: "Email Address",
      selector: (row) => row.email,
      sortable: true,
      sortField: "email"
    },
    {
      name: "Name",
      selector: (row) => row.fullname,
      sortable: true,
      sortField: "fullname"
    },
    {
      name: "Badge ID",
      selector: (row) => row.id,
      sortable: true,
      sortField: "id"
    },
  ]
  store.dispatch(setShowModalQuery({show:true,
    content:{
      title: titleModalQueryDeliveryTo,
      data: data,
      columnConfig: columnConfig,
      searchKey: "fullName",
      searchLabel: "User Name",
      usingPaginationServer: true
    }
  }))
}

export const validateRequestDataRoomSelection = (data, isBulk=false, sequence=null) => {
  // Helper function untuk cek apakah value kosong
  const isEmpty = (value) => value === undefined || value === null || value === "";

  const currentSequence = isBulk? ` in page ${sequence}`:"";

  // Helper function untuk validasi angka positif
  const isPositiveNumber = (value) => /^\d+$/.test(value) && Number(value) > 0;

  // Helper function untuk validasi tanggal tidak boleh backdate
  const isFutureDate = (dateTime) => {
      const inputDate = new Date(dateTime);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset jam agar hanya cek tanggal saja
      return inputDate >= today;
  };

  // **1. Validasi Field Wajib**
  const requiredFields = [
      objectRoomSelection[0],  // DELIVERY_TO
      objectRoomSelection[5],  // EVENT_NAME
      objectRoomSelection[6],  // PURPOSE_OF_FUNCTION
      objectRoomSelection[8],  // DELIVERY_DATETIME
      objectRoomSelection[14],  // PHONE_NUMBER
  ];

  for (const field of requiredFields) {
      if (isEmpty(data[field])) {
          toast.error(`${fieldLabels[field]} is required${currentSequence}.`);
          return false;
      }
  }

  // **2. Validasi ROOM (Tidak boleh isi keduanya, harus salah satu)**
  const isTeamsRoomFilled = !isEmpty(data[objectRoomSelection[1]]);
  const isNonTeamsRoomFilled = !isEmpty(data[objectRoomSelection[4]]);

  if (isTeamsRoomFilled && isNonTeamsRoomFilled) {
      toast.error(`You cannot select both Teams Room and Non-Teams Room. Please choose only one${currentSequence}.`);
      return false;
  }

  if (!isTeamsRoomFilled && !isNonTeamsRoomFilled) {
      toast.error(`You must select a room${currentSequence}.`);
      return false;
  }

  // **3. Validasi Kapasitas ROOM (Tidak boleh lebih kecil dari TOTAL_ATTENDANCE)**
  const totalAttendance = Number(data[objectRoomSelection[7]]);
  
  if (!isPositiveNumber(totalAttendance)) {
      toast.error(`${fieldLabels[objectRoomSelection[7]]} must be a positive number${currentSequence}.`);
      return false;
  }

  // let selectedRoomCapacity = 0;
  
  // if (isNonTeamsRoomFilled && data[objectRoomSelection[13]]) {
  //     selectedRoomCapacity = Number(data[objectRoomSelection[13]].CAPACITY);
  // }

  // if (isTeamsRoomFilled) {
  //   selectedRoomCapacity = Number(data[objectRoomSelection[13]].CAPACITY)
  // }

  // if(selectedRoomCapacity !== 0){
  //   if (selectedRoomCapacity < totalAttendance) {
  //     toast.error(`The selected room's capacity (${selectedRoomCapacity}) must be greater than the total attendance (${totalAttendance})${currentSequence}.`);
  //     return false;
  //   }
  // }

  // **4. Validasi DELIVERY_DATETIME Tidak Boleh Back Date**
  if (!isFutureDate(data[objectRoomSelection[8]])) {
      toast.error(`${fieldLabels[objectRoomSelection[8]]} cannot be in the past${currentSequence}.`);
      return false;
  }

  return true; // Lolos validasi
};

export const validateRequestDataTenantSelection = (data, isBulk=false, sequence=null) =>{
  const currentSequence = isBulk? ` in page ${sequence}`:"";
  // Pastikan user sudah memilih tenant
  if (!data[objectTenantSelection[0]]) {
    toast.error(`Please select a tenant before proceeding${currentSequence}.`);
    return false; // Validasi gagal
  }

  return true; // Validasi sukses
}

export const validateCartPackageMaxQuantity = (cartPackage, listDataPackage, excludedProducts = []) => {
  let failedProducts = [];

  const validationResults = cartPackage.map(packageItem => {
    const packageInfo = listDataPackage.find(p => p.PACKAGE_ID === packageItem.PACKAGE_ID);
    if (!packageInfo) return null;

    return packageInfo.DETAILS_CATEGORY.map(category => {
      const categoryItem = packageItem.DETAILS_CATEGORY.find(c => c.PRODUCT_ID === category.CATEGORY_PRODUCT);
      if (!categoryItem) return null;

      // Filter selected products agar tidak mengecek yang ada di excludedProducts
      const filteredSelectedProducts = categoryItem.listProduct.filter(productId => !excludedProducts.includes(productId));

      if (filteredSelectedProducts.length < category.QUANTITY) {
        failedProducts.push(...categoryItem.listProduct);
        return store.dispatch(setShowModalGlobal({
          show: true,
          content: {
            captionText: `Your required has not reached the maximum order`,
            questionText: "Do you want to add some items for your option?",
            buttonLeftText: "Okay",
            buttonRightText: "No, Thanks",
            buttonLeftFn: null,
            buttonRightFn: () => {
              validateCartPackageMaxQuantity(cartPackage, listDataPackage, failedProducts);
            }
          }
        }));
      }
      return null;
    });
  });

  return validationResults.flat().some(result => result !== null) ? "" : null;
};

export const validateCartProduct = (cartProduct, listDataProduct) => {
  let errorMessage = null;

  cartProduct.forEach(item => {
    if (item[objectProductSelection[10]] < 0) {
      errorMessage = `Product ${item[objectProductSelection[0]]} has a negative quantity.`;
      return;
    }

    const product = listDataProduct.find(p => p[objectProductSelection[0]] === item[objectProductSelection[0]]);
    if (product && !product?.[objectProductSelection[4]]) {
      errorMessage = `Product ${product[objectProductSelection[1]]} is not available.`;
      return;
    }
  });

  return errorMessage;
};

export const validateCartPackage = (cartPackage, listDataPackage) => {
  let errorMessage = null;

  cartPackage.forEach(packageItem => {
    if (errorMessage) return; // Hentikan loop jika sudah ada error

    const packageInfo = listDataPackage.find(p => p.PACKAGE_ID === packageItem.PACKAGE_ID);
    if (packageInfo) {
      if (packageItem.QUANTITY === 0) {
        errorMessage = `Package ${packageInfo[objectPackageSelection[1]]} has a quantity of 0.`;
        return;
      }
      if (!packageItem.DETAILS_CATEGORY || packageItem.DETAILS_CATEGORY.length === 0) {
        errorMessage = `Package ${packageInfo[objectPackageSelection[1]]} does not have a selected product category.`;
        return;
      }
      if (!packageInfo?.[objectPackageSelection[3]]) {
        errorMessage = `Package ${packageInfo[objectPackageSelection[1]]} is not available.`;
        return;
      }

      packageItem.DETAILS_CATEGORY.forEach(categoryItem => {
        if (errorMessage) return;

        const categoryInfo = packageInfo[objectPackageSelection[4]].find(c => c[objectPackageSelection[5]] === categoryItem.CATEGORY_PRODUCT);
        if (categoryInfo) {
          if (categoryItem.listProduct.length !== categoryInfo[objectPackageSelection[7]]) {
            errorMessage = `Package ${packageInfo[objectPackageSelection[1]]} category ${categoryInfo[objectPackageSelection[6]]} must have exactly ${categoryInfo[objectPackageSelection[7]]} selected products.`;
            return;
          }
          categoryItem.listProduct.forEach(productId => {
            if (errorMessage) return;

            const productInfo = categoryInfo[objectPackageSelection[8]].find(p => p[objectProductSelection[0]] === productId);
            if (productInfo && !productInfo[objectProductSelection[4]]) {
              errorMessage = `Product ${productInfo[objectProductSelection[1]]} in package ${packageInfo[objectPackageSelection[1]]} is not available.`;
            }
          });
        }
      });
    }
  });

  return errorMessage;
};

export const validatePaymentProductPackage= async (productSelectionData)=>{
  // checking
  store.dispatch(setShowLoadingScreen(true))
  try {
    const response = await calculateOrderTotal(productSelectionData)
    if(response){
      return true
    }
    return false
  } catch {
    return false
  } finally {
    store.dispatch(setShowLoadingScreen(false))
  }
}

export const isCartEmpty = (cartProduct, cartPackage) => {
  return cartProduct?.length === 0 && cartPackage?.length === 0;
};

export const validateAndNotify = (validator, cartData, referenceData, isBulk=false, sequence=null) => {
  const error = validator(cartData, referenceData);
  let currentSequence = "";
  if (error) {
    if(isBulk){
      currentSequence = ` in page ${sequence}`
    }
    toast.error(error + currentSequence);
    return false;
  }
  return true;
};

export const handleModalOpenQueryCostCenter = (index) => {
  const data = getAllCostCenter;

  const columnConfig = [
    {
      name: "Cost Center ID",
      selector: row=> row.costCenterId,
      sortable: true,
      sortField: "costCenterId",
      width: "150px"
    },
    {
      name: "Cost Center Name",
      selector: row=> row.costCenterName,
      sortable: true,
      sortField: "costCenterName",
    },
    {
      name: "Status",
      cell: row =>(
        <div className={`fw-bold text-${row.status? 'success': 'danger'}`}>{row.status? 'Active': 'Inactive'}</div>
      ),
      sortable: true,
      sortField: "status",
      width: "150px"
    },
  ]
  store.dispatch(setShowModalQuery({show:true,
    content:{
      title: titleModalQueryCostCenter,
      data: data,
      columnConfig: columnConfig,
      searchKey: "costCenterName",
      searchLabel: "Cost Center Name",
      usingPaginationServer: true,
      paramsReturn: {index: index, type: "COST_CENTER"}
    }
  }))
}

export const validateOrderSummaryData = (orderSummaryData, roomSelectionData, isBulk=false, sequence=null) => {
  const currentSequence = isBulk? ` in page ${sequence}`:"";

  if(roomSelectionData.REQUEST_TYPE == "RQ_001"){
    if (!orderSummaryData?.costCenterId) {
      toast.error(`Cost Center must be filled${currentSequence}.`);
      return false;
    }
  }
  

  if (!orderSummaryData?.deliveryType) {
    toast.error(`Delivery Type must be selected${currentSequence}.`);
    return false;
  }

  return true; // Lolos validasi
};

export const backToFunctionRequest = (param)=>{
  removeDataFunctionRequest(param)
  window.location.href = objectRouterFunctionRequest.fnRequest.path
}

export const removeDataFunctionRequest = (param)=>{
  if(param=='bulk'){
    removeBulkStepFunctionRequest()
    removeBulkListData()
    removeBulkOrderSummaryData()
    removeBulkProductData()
  }else{
    removeStepFunctionRequestDraft()
    removeRoomSelectionDataDraft()
    removeTenantSelectionDataDraft()
    removeProductionSelectionDataDraft()
    removeOrderSummaryDataDraft()
    removeOrderEditOrViewDataDraft()
  }
}

export const encryptDataId = (id, canEdit)=>{
  const dataObject = {
    id: id,
    canEdit: canEdit,
  }
  return encodeURIComponent(encryptData(dataObject))
}

export const decryptDataId = (data)=>{
  try {
    return decryptData(decodeURIComponent(data))
  } catch {
    return null
  }
}

export const validateBulkListData = (data)=>{
  store.dispatch(setShowLoadingScreen(true))
  let valid = true
  data.some(element => {
    if (!validateRequestDataRoomSelection(element.roomSelectionData)) {
      store.dispatch(setShowLoadingScreen(false))
      valid = false
      return true;
    }
    if (!validateRequestDataTenantSelection(element.tenantSelectionData)) {
      store.dispatch(setShowLoadingScreen(false))
      valid = false
      return true;
    }
    if(!validateOrderSummaryData(element.orderSummaryData, element.roomSelectionData)){
      store.dispatch(setShowLoadingScreen(false))
      valid = false
      return true;
    }
  });
  return valid
}

export const validateDeliveryDate = async (roomSelectionData, tenantSelectionData, isBulk=false, sequence=null) => {
  store.dispatch(setShowLoadingScreen(true))
  const currentSequence = isBulk? ` in page ${sequence}`:"";
  const currentDeliveryDate = moment(roomSelectionData[objectRoomSelection[8]]).format('YYYY-MM-DD')
  let oneTimeSetupDataTenant = null
  let minimumDeliveryDate = null

  // Get tenant yang dipilih
  const tenantId = tenantSelectionData[objectTenantSelection[0]]

  try {
    // Mengambil data setup satu kali
    const response = await getAllForExportOneTimeSetup()
    if (response.status === 200) {
      const data = response?.data?.data
      if (data?.length > 0) {

        // Mencari data setup tenant yang dipilih
        oneTimeSetupDataTenant = data.find(element => element.TENANT_ID == tenantId)

        // Jika tidak ditemukan, gunakan setup default
        if (!oneTimeSetupDataTenant) {
          oneTimeSetupDataTenant = data.find(element => element.TENANT_ID == null)
        }

        // Menghitung tanggal minimum delivery berdasarkan DELIVERY_DAYS
        minimumDeliveryDate = moment().add(oneTimeSetupDataTenant.DELIVERY_DAYS, 'days').format('YYYY-MM-DD')

        // Mengecek apakah tanggal delivery lebih kecil dari minimum delivery
        if (currentDeliveryDate < minimumDeliveryDate) {

          // Menampilkan toast error dengan informasi yang lebih detail
          toast.error(`Delivery Date${currentSequence} cannot be earlier than the minimum date of ${minimumDeliveryDate} set for this tenant's setup. The tenant requires at least ${oneTimeSetupDataTenant.DELIVERY_DAYS} days for processing.`)

          store.dispatch(setShowLoadingScreen(false))
          return false
        }

        // Jika tidak ada error, lanjutkan dengan pengembalian true
      }
    } else {
      toast.error(`Failed to retrieve setup data: ${response?.data?.message || 'Unknown error'}`)
    }
    store.dispatch(setShowLoadingScreen(false))
    return true
  } catch (error) {
    toast.error(`An error occurred while validating delivery date: ${error.message || 'Unknown error'}`)
    store.dispatch(setShowLoadingScreen(false))
    return false
  }
}

export const validateMinimumOrderPerPortion = async (productSelectionData, tenantSelectionData,listDataPackage, listDataProduct, isBulk=false, sequence=null) => {
  store.dispatch(setShowLoadingScreen(true))
  const currentSequence = isBulk? ` in page ${sequence}`:"";
  let oneTimeSetupDataTenant = null
  let minimumOrderPerPortion = null
  let valid = true

  // Get tenant yang dipilih
  const tenantId = tenantSelectionData[objectTenantSelection[0]]

  try {
    // Mengambil data setup satu kali
    const response = await getAllForExportOneTimeSetup()
    if (response.status === 200) {
      const data = response?.data?.data
      if (data?.length > 0) {

        // Mencari data setup tenant yang dipilih
        oneTimeSetupDataTenant = data.find(element => element.TENANT_ID == tenantId)

        // Jika tidak ditemukan, gunakan setup default
        if (!oneTimeSetupDataTenant) {
          oneTimeSetupDataTenant = data.find(element => element.TENANT_ID == null)
        }
        
        // mengambil minimum order per portion di tenant
        minimumOrderPerPortion = Number(oneTimeSetupDataTenant.MIN_ORDER);
        
        // Mengecek per product dan package apakah lebih kecil dari minimum order per portion
        // cek product
        if(productSelectionData?.cartProduct?.length > 0){
          for(const product of productSelectionData.cartProduct){
            if(product?.QUANTITY < minimumOrderPerPortion){
              const productInfo = listDataProduct.find(p => p.PRODUCT_ID === product.PRODUCT_ID);
              if(productInfo){
                toast.error(`Product "${productInfo[objectProductSelection[1]]}"${currentSequence} is below the minimum order (${minimumOrderPerPortion}).`)
                valid = false
                break
              }
            }
          }
        }

        // cek package
        if(productSelectionData?.cartPackage?.length > 0){
          for(const packageData of productSelectionData.cartPackage){
            if(packageData?.QUANTITY < minimumOrderPerPortion){
              const packageInfo = listDataPackage.find(p => p.PACKAGE_ID === packageData.PACKAGE_ID);
              if(packageInfo){
                toast.error(`Package "${packageInfo[objectPackageSelection[1]]}"${currentSequence} is below the minimum order (${minimumOrderPerPortion}).`)
                valid = false
                break
              }
            }
          }
        }
        
        store.dispatch(setShowLoadingScreen(false))
        return valid
        // Jika tidak ada error, lanjutkan dengan pengembalian true
      }
    } else {
      toast.error(`Failed to retrieve setup data: ${response?.data?.message || 'Unknown error'}`)
    }
    store.dispatch(setShowLoadingScreen(false))
    return true
  } catch (error) {
    toast.error(`An error occurred while validating minimum order per portion: ${error.message || 'Unknown error'}`)
    store.dispatch(setShowLoadingScreen(false))
    return false
  }
}
