//here you can create shared function per page

import { toast } from "react-toastify"
import { editProductPackage, getListProduct, getListTenant, storeProductPackage } from "src/utils/api/apiMasterPage"
import { store } from "src/utils/store/combineReducers"
import { setModalImage, setShowLoadingScreen, setShowModalQuery } from "src/utils/store/globalSlice"
import { fnGetProductDetails } from "../product/productFn"
import { History } from "src/utils/router"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { removeThousandSeparator } from "src/utils/helpersFunction"

export const titleModalQueryTenant = "List All Tenant"

export const titleModalQueryProduct = "List All Product"

export const objectName = [
  "PACKAGE_ID",//0
  "PACKAGE_NAME",//1
  "TENANT_ID",//2
  "TENANT_NAME",//3
  "PACKAGE_IMAGE",//4
  "STATUS",//5
  "AVAILABLE",//6
  "PRICE_STATUS",//7
  "COMMENT", //8
  "DETAILS_CATEGORY_JSON",//9
  "DETAILS_PRICE_JSON",//10
  "PackageImageFile", //11
  "PRICE_STATUS_DESC", //12
]

export const objectDetailsCategoryName = [
  "PACKAGE_CATEGORY_ID",//0
  "PACKAGE_ID",//1
  "CATEGORY_PRODUCT", //2
  "QUANTITY", //3
  "DETAILS_CATEGORY_PRODUCT", //4
]

export const objectDetailsProductPerCategoryName = [
  "PACKAGE_PRODUCT_ID",//0
  "PACKAGE_CATEGORY_ID",//1
  "PRODUCT_ID", //2
  "PRODUCT_NAME", //3
  "TYPE_PRODUCT", //4
  "PRODUCT_IMAGE", //5
  "TYPE_PRODUCT_DESC", //6
]

export const objectDetailsPriceName = [
  "PACKAGE_PRICE_ID",//0
  "PACKAGE_ID",//1
  "PORTION_FROM", //2
  "PORTION_THRU", //3
  "PACKAGE_PRICE", //4
]

export const privilegeCampServices = [
  objectName[8], 
  objectName[10]
]

export const privilegeTenant = [
  objectName[0], 
  objectName[1], 
  objectName[2], 
  objectName[3], 
  objectName[4], 
  objectName[5],
  objectName[6], 
  objectName[8], 
  objectName[9], 
  objectName[11],
]

export const updateFormDataWithTenant = (prevFormData, selectableModalQuery, objectName) => {
  return {
    ...prevFormData,
    [objectName[2]]: selectableModalQuery?.data?.TENANT_ID,
    [objectName[3]]: selectableModalQuery?.data?.TENANT_NAME
  };
};

export const updateDetailsCategoryWithProduct = (prevDetailsCategory, selectableModalQuery, objectDetailsCategoryName, objectDetailsProductPerCategoryName) => {
  const { indexCategory, indexDetails } = selectableModalQuery?.params || {};

  // Validasi indeks kategori dan produk sebelum mengubah state
  if (indexCategory === undefined || indexDetails === undefined) return prevDetailsCategory;

  return prevDetailsCategory.map((category, catIndex) => {
    if (catIndex !== indexCategory) return category; // Hanya edit kategori yang sesuai

    return {
      ...category,
      [objectDetailsCategoryName[4]]: category[objectDetailsCategoryName[4]].map((product, prodIndex) =>
        prodIndex === indexDetails
          ? {
              ...product,
              [objectDetailsProductPerCategoryName[2]]: selectableModalQuery?.data?.PRODUCT_ID ?? product[objectDetailsProductPerCategoryName[2]],
              [objectDetailsProductPerCategoryName[3]]: selectableModalQuery?.data?.PRODUCT_NAME ?? product[objectDetailsProductPerCategoryName[3]],
              [objectDetailsProductPerCategoryName[4]]: selectableModalQuery?.data?.TYPE_PRODUCT ?? product[objectDetailsProductPerCategoryName[4]],
              [objectDetailsProductPerCategoryName[5]]: selectableModalQuery?.data?.IMAGE_PRODUCT ?? product[objectDetailsProductPerCategoryName[5]],
              [objectDetailsProductPerCategoryName[6]]: selectableModalQuery?.data?.TYPE_PRODUCT_DESC ?? product[objectDetailsProductPerCategoryName[6]]
            }
          : product
      )
    };
  });
};

export const validateRow = (row, prevRow) => {

  let prevRowPortionTo = prevRow?.[objectDetailsPriceName[3]]
  if(typeof prevRowPortionTo === "string"){
    prevRowPortionTo = prevRowPortionTo.replace(".","")
  }

  if(!row[objectDetailsPriceName[2]] && !row[objectDetailsPriceName[3]]){
    return "You must fill Portion From or Portion To";
  }
  if (!row[objectDetailsPriceName[4]]) {
    return "You must fill Price per Portion";
  }
  if (row[objectDetailsPriceName[3]] && Number(row[objectDetailsPriceName[2]]?.replace(".","")) > Number(row[objectDetailsPriceName[3]]?.replace(".",""))) {
    return "Portion From value cannot greater than Portion To value.";
  }
  if (prevRow && prevRow[objectDetailsPriceName[3]] && Number(row[objectDetailsPriceName[2]]?.replace(".","")) < Number(prevRowPortionTo)) {
    return "Portion From value cannot smaller than Portion To value from the previous row.";
  }
  if (prevRow && prevRow[objectDetailsPriceName[3]] && Number(row[objectDetailsPriceName[2]]?.replace(".","")) == Number(prevRowPortionTo)) {
    return "Portion From value cannot be the same as Portion To value from the previous row.";
  }
  if(prevRow && row[objectDetailsPriceName[2]] && prevRow[objectDetailsPriceName[3]] && Number(row[objectDetailsPriceName[2]]?.replace(".","")) != (Number(prevRowPortionTo) + 1)){
    return "Portion From value must be + 1 than Portion To value from the previous row.";
  }
  return "";
};

export const handleModalOpenQueryProductPerCategory = (tenantId, categoryProduct, paramsReturn) => {
  const data = getListProduct;

  const columnConfig = [
    {
      name: "Product ID",
      selector: row=> row.PRODUCT_ID,
      sortable: true,
      sortField: "PRODUCT_ID",
      width: "120px"
    },
    {
      name: "Name",
      selector: row=> row.PRODUCT_NAME,
      sortable: true,
      sortField: "PRODUCT_NAME",
    },
    {
      name: "Status",
      cell: row =>(
        <div className={`fw-bold text-${row.STATUS_PRODUCT? 'success': 'danger'}`}>{row.STATUS_PRODUCT? 'Active': 'Inactive'}</div>
      ),
      sortable: true,
      sortField: "STATUS_PRODUCT",
      width: "150px"
    },
  ]
  store.dispatch(setShowModalQuery({show:true,
    content:{
      title: titleModalQueryProduct,
      data: data,
      columnConfig: columnConfig,
      searchKey: "productName",
      searchLabel: "Product Name",
      usingPaginationServer: true,
      params:{
        categoryProduct: categoryProduct,
        typeProduct: "",
        priceStatus: "",
        available: true,
        tenantId: tenantId
      },
      paramsReturn:{
        ...paramsReturn
      }
    }
  }))
}

export const handleModalOpenQueryTenant = () => {
  const data = getListTenant;

  const columnConfig = [
    {
      name: "Tenant ID",
      selector: row=> row.TENANT_ID,
      sortable: true,
      sortField: "TENANT_ID",
      width: "120px"
    },
    {
      name: "Name",
      selector: row=> row.TENANT_NAME,
      sortable: true,
      sortField: "TENANT_NAME",
    },
    {
      name: "Status",
      cell: row =>(
        <div className={`fw-bold text-${row.STATUS? 'success': 'danger'}`}>{row.STATUS? 'Active': 'Inactive'}</div>
      ),
      sortable: true,
      sortField: "STATUS",
      width: "150px"
    },
  ]
  store.dispatch(setShowModalQuery({show:true,
    content:{
      title: titleModalQueryTenant,
      data: data,
      columnConfig: columnConfig,
      searchKey: "tenantName",
      searchLabel: "Tenant Name",
      usingPaginationServer: true
    }
  }))
}

export const validateCategory = (categoryList, newCategory) => {
  // Cek apakah kategori yang akan ditambahkan memiliki CATEGORY_PRODUCT yang sama
  const isDuplicate = categoryList.some(
    (category) =>
      category[objectDetailsCategoryName[2]] === newCategory[objectDetailsCategoryName[2]] &&
      category.done === true // Pastikan hanya mengecek kategori yang sudah selesai
  );

  if (isDuplicate) {
    return "Category already exists. Please choose a different one.";
  }

  // Cek apakah QUANTITY diisi dan lebih dari 0
  if (!newCategory[objectDetailsCategoryName[3]] || parseInt(newCategory[objectDetailsCategoryName[3]]) <= 0) {
    return "Quantity must be at least 1.";
  }

  return null;
};

export const validateCategoryProduct = (categoryProducts, newProduct) => {
  // Cek apakah produk sudah ada dalam kategori ini (hanya yang `done: true`)
  const isDuplicate = categoryProducts.some(
    (product) =>
      product[objectDetailsProductPerCategoryName[2]] === newProduct[objectDetailsProductPerCategoryName[2]] &&
      product.done === true
  );

  if (isDuplicate) {
    return "Product already exists in this category. Please choose a different one.";
  }

  return null;
};

// ✅ Tambah Harga (Price)
export const addPrice = (priceList, priceKeys) => {
  const lastRow = priceList[priceList.length - 1];
  const prevRow = priceList.length > 1 ? priceList[priceList.length - 2] : null;

  const validationError = validateRow(lastRow, prevRow);
  if (validationError) {
    toast.error(validationError);
    return priceList;
  }

  return [
    ...priceList.map((row) => ({ ...row, done: true })), // Tandai semua sebagai selesai
    priceKeys.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false }) // Tambahkan baris baru
  ];
};

// ✅ Hapus Harga (Price)
export const deletePrice = (priceList, index) => priceList.filter((_, i) => i !== index);

/**
 * Menambahkan kategori baru ke dalam daftar kategori.
 * @param {Array} categoryList - List kategori yang sudah ada.
 * @param {Array} filteredObjectDetailsCategoryName - Array yang berisi nama object kategori tanpa ID.
 * @param {Array} filteredObjectDetailsProductPerCategoryName - Array yang berisi nama object produk tanpa ID.
 * @returns {Array} - Daftar kategori yang diperbarui.
 */
export const addCategory = (categoryList, filteredObjectDetailsCategoryName, filteredObjectDetailsProductPerCategoryName) => {
  const lastCategory = categoryList[categoryList.length - 1];

  // Pastikan hanya mengecek kategori yang sudah selesai (`done: true`)
  const validationError = validateCategory(categoryList.filter(c => c.done === true), lastCategory);
  if (validationError) {
    toast.error(validationError);
    return categoryList;
  }

  return [
    ...categoryList.map((row) => ({ ...row, done: true })),
    filteredObjectDetailsCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), {
      done: false,
      [objectDetailsCategoryName[4]]: [
        filteredObjectDetailsProductPerCategoryName.reduce((acc, key) => ({ ...acc, [key]: "" }), { done: false })
      ]
    })
  ];
};

// ✅ Hapus Kategori (Category)
export const deleteCategory = (categoryList, index) => categoryList.filter((_, i) => i !== index);

/**
 * Menambahkan produk baru ke dalam kategori tertentu.
 * @param {Array} categoryList - List kategori yang sudah ada.
 * @param {Number} indexCategory - Index kategori yang akan ditambahkan produk.
 * @param {Array} filteredObjectDetailsProductPerCategoryName - Array yang berisi nama object produk tanpa ID.
 * @returns {Array} - Daftar kategori yang diperbarui.
 */
export const addCategoryProduct = (categoryList, indexCategory, filteredObjectDetailsProductPerCategoryName) => {
  return categoryList.map((category, catIndex) => {
    if (catIndex !== indexCategory) return category; // Hanya ubah kategori yang dipilih

    const lastProduct = category[objectDetailsCategoryName[4]][category[objectDetailsCategoryName[4]].length - 1];
    // Gunakan validasi global untuk memastikan produk valid
    const validationError = validateCategoryProduct(category[objectDetailsCategoryName[4]].filter(p => p.done === true), lastProduct);
    if (validationError) {
      toast.error(validationError);
      return category;
    }

    return {
      ...category,
      [objectDetailsCategoryName[4]]: [
        ...category[objectDetailsCategoryName[4]].map((row) => ({ ...row, done: true })), // Tetap simpan produk lama
        filteredObjectDetailsProductPerCategoryName.reduce((acc, key) => {
          acc[key] = ""; // Set default value kosong
          return acc;
        }, { done: false }) // Pastikan produk baru dalam keadaan `done: false`
      ]
    };
  });
};

// ✅ Hapus Produk dari Kategori
export const deleteCategoryProduct = (categoryList, indexDetails, indexCategory) => {
  return categoryList.map((category, catIndex) => {
    if (catIndex !== indexCategory) return category;

    return {
      ...category,
      DETAILS_CATEGORY_PRODUCT: category.DETAILS_CATEGORY_PRODUCT.filter(
        (_, prodIndex) => prodIndex !== indexDetails
      )
    };
  });
};

export const handleViewImage = (productId)=>{
  // call api product get by id
  // ambil IMAGE_PRODUCT
  // open modal
  // isi src imagenya pake IMAGE_PRODUCT
  fnGetProductDetails({}, productId).then((res)=>{
    if(res){
      const image = res.IMAGE_PRODUCT
      store.dispatch(setModalImage({show:true, content:image}))
    }
  })
}

export const validateFormData = (formData, detailsPrice, detailsCategory) => {
  if (!formData[objectName[1]]) {
    toast.error("Package name is required");
    return false;
  }
  if (!formData[objectName[2]]) {
    toast.error("Tenant ID is required");
    return false;
  }

  // 🚀 Validasi DETAILS_PRICE
  if (!validateDetailsPrice(formData, detailsPrice)) return false;

  // 🚀 Validasi DETAILS_CATEGORY
  if (!validateDetailsCategory(detailsCategory)) return false;

  return true;
};

// ✅ Validasi `DETAILS_PRICE`
export const validateDetailsPrice = (formData,detailsPrice) => {
  const isEdit = !!formData[objectName[0]];
  if(isEdit){
    const validDetails = detailsPrice.filter((item) => item.done);
  
    if (validDetails.length === 0) {
      toast.error("At least one valid price detail is required");
      return false;
    }
  }
  return true;
};

// ✅ Validasi `DETAILS_CATEGORY`
export const validateDetailsCategory = (detailsCategory) => {
  let valid = true
  const validCategories = detailsCategory
    .filter(
      (category) =>
        category.done && // Hanya kategori yang selesai
        category[objectDetailsCategoryName[2]] && // Harus ada kategori yang dipilih
        category[objectDetailsCategoryName[3]] // Harus ada jumlah yang valid
    )
    .map((category) => ({
      ...category,
      [objectDetailsCategoryName[4]]: category[objectDetailsCategoryName[4]].filter(
        (product) => product.done && product[objectDetailsProductPerCategoryName[2]] // Harus ada `PRODUCT_ID`
      ),
    }))
    .filter((category) => category[objectDetailsCategoryName[4]].length > 0); // Pastikan ada produk yang valid

  if (validCategories.length === 0) {
    toast.error("At least one category with valid products is required");
    valid = false
    return false;
  }

  // Validasi jumlah produk di setiap kategori
  validCategories.some((category) => {
    const categoryQuantity = category[objectDetailsCategoryName[3]]; // QUANTITY
    const productCount = category[objectDetailsCategoryName[4]].length; // Jumlah produk yang valid

    if (productCount < categoryQuantity) {
      toast.error(`Each category must have at least the required number of products.`);
      valid = false
      return true;
    }
  });

  // Validate no duplicate CATEGORY_PRODUCT using some
  const duplicateCategory = validCategories.some((category, index, array) =>
    array.slice(index + 1).some((otherCategory) => otherCategory.CATEGORY_PRODUCT === category.CATEGORY_PRODUCT)
  );

  if (duplicateCategory) {
    toast.error("Category products must be unique. Please check the categories you selected.");
    valid = false;
  }

  return valid;
};


export const prepareFormData = (formData, detailsPrice, detailsCategory) => {
  const bodyFormData = new FormData();
  const isEdit = !!formData[objectName[0]]; // Cek apakah ini mode edit (PACKAGE_ID ada)

  // 🔥 1. Tambahkan data utama ke FormData dengan looping

  let mainFields = [
    objectName[1], objectName[2], objectName[3], objectName[5], objectName[6], objectName[7], objectName[8]
  ];

  if(isEdit){
    mainFields = [
      objectName[1], objectName[2], objectName[3], objectName[5], objectName[6], objectName[7], objectName[8], objectName[0] 
    ];
  }
  
  mainFields.forEach((key) => {
    if (key === objectName[6] || key === objectName[5]) {
      bodyFormData.append(key, formData[key]=="true" || formData[key]==true ? true : false);
    } else {
      bodyFormData.append(key, formData[key] || "");
    }
  });

  // 🔥 2. Upload Gambar: Pastikan hanya file yang dikirim
  if (formData[objectName[4]] instanceof File) {
    bodyFormData.append(objectName[11], formData[objectName[4]]);
    bodyFormData.append(objectName[4], formData[objectName[4]].name);
  } else {
    bodyFormData.append(objectName[4], formData[objectName[4]] || "");
  }

  // 🔥 3. Format `DETAILS_PRICE` → JSON
  const formattedDetailsPrice = detailsPrice
    .filter((item) => item.done)
    .map((item) =>
      objectDetailsPriceName.reduce((acc, key) => {
        // Hapus `PACKAGE_PRICE_ID` dan `PACKAGE_ID` jika mode create
        if (!isEdit && (key === objectDetailsPriceName[0] || key === objectDetailsPriceName[1])) return acc;
        acc[key] = item[key] !== undefined ? (item[key] === "" ? 0 : item[key]) : "0"; // Default 0 jika undefined
        
        if (typeof acc[key] === "string" && acc[key].includes(".")) {
          acc[key] = removeThousandSeparator(acc[key]); // Hapus titik untuk nilai string
        }

        return acc;
      }, {})
    );

  // 🔥 4. Format `DETAILS_CATEGORY` → JSON
  const formattedDetailsCategory = detailsCategory
    .filter((category) => category.done && category[objectDetailsCategoryName[2]] && category[objectDetailsCategoryName[3]])
    .map((category) => ({
      ...objectDetailsCategoryName.reduce((acc, key) => {
        // Hapus `PACKAGE_CATEGORY_ID` dan `PACKAGE_ID` jika mode create
        if (!isEdit && (key === objectDetailsCategoryName[0] || key === objectDetailsCategoryName[1])) return acc;
        acc[key] = category[key] || ""; // Default empty string jika undefined
        return acc;
      }, {}),
      [objectDetailsCategoryName[4]]: category[objectDetailsCategoryName[4]]
        .filter((product) => product.done && product[objectDetailsProductPerCategoryName[2]])
        .map((product) =>
          objectDetailsProductPerCategoryName.reduce((acc, key) => {
            // Hapus `PACKAGE_PRODUCT_ID` dan `PACKAGE_CATEGORY_ID` jika mode create
            if (!isEdit && (key === objectDetailsProductPerCategoryName[0] || key === objectDetailsProductPerCategoryName[1])) return acc;
            acc[key] = product[key] || "";
            return acc;
          }, {})
        ),
    }));

  // 🔥 5. Tambahkan ke FormData
  bodyFormData.append(objectName[10], JSON.stringify(formattedDetailsPrice));
  bodyFormData.append(objectName[9], JSON.stringify(formattedDetailsCategory));

  return bodyFormData;
};

export const fnStoreProductPackage = (body)=>{
  store.dispatch(setShowLoadingScreen(true))
  storeProductPackage(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.productPackage.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnStoreEditProductPackage = (body, valueId)=>{
  store.dispatch(setShowLoadingScreen(true))
  editProductPackage(body,valueId).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.productPackage.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const mappingCategoryProduct = (categoryProduct)=>{
  const result = categoryProduct.map((item)=>{
    let object = {...item}
    if(item.value==""){
      object.label = "Choose Category"
    }
    return object
  })
  return result
}