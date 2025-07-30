//here you can create shared function per page
import { toast } from "react-toastify"
import { editOneTimeSetup, getAllForExportOneTimeSetup, getOneTimeSetupDetails, storeOneTimeSetup } from "src/utils/api/apiMasterPage"
import { History } from "src/utils/router"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { store } from "src/utils/store/combineReducers"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import { setNeedReloadPage } from "./oneTimeSetupSlice"
import moment from "moment"
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const loopDropDownDeliveryDays = ()=>{
  const arr = []
  for(let i=0; i<=10; i++){
    arr.push({value:i, label:`H-${i}`})
  }
  return arr
}

export const fnUpdateValueDefaultConfig = (body, fnCallBack) =>{
  store.dispatch(setShowLoadingScreen(true))
  store.dispatch(setNeedReloadPage(true))
  editOneTimeSetup(body, body.ID).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    store.dispatch(setNeedReloadPage(false))
    fnCallBack()
    // location.href = objectRouterMasterPage.oneTimeSetup.path
  }).catch(()=>{
    store.dispatch(setNeedReloadPage(false))
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnStoreOneTimeSetup = (body, fnCallBack)=>{
  store.dispatch(setShowLoadingScreen(true))
  store.dispatch(setNeedReloadPage(true))
  storeOneTimeSetup(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    store.dispatch(setNeedReloadPage(false))
    fnCallBack()
    History.navigate(objectRouterMasterPage.oneTimeSetup.path)
  }).catch(()=>{
    store.dispatch(setNeedReloadPage(false))
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnGetOneTimeSetupDetails = async (id)=>{
  try {
    store.dispatch(setShowLoadingScreen(true))
    const response = await getOneTimeSetupDetails({},id)
    if(response){
      store.dispatch(setShowLoadingScreen(false))
      const data = response.data.data
      return data || null
    }
  } catch (error) {
    store.dispatch(setShowLoadingScreen(false))
    return null
  }
}

export const fnExportXlsx = async ()=>{
  try {
    const response = await getAllForExportOneTimeSetup()
    if(response && response.data){
      const data = response.data.data
      if (!data || data.length === 0) {
        toast.warning("Tidak ada data untuk diekspor.");
        return;
      }

      // Generate Timestamp dengan Moment.js
      const timestamp = moment().format("YYYYMMDD_HHmmss"); // Format: YYYYMMDD_HHmmss
      
      // Nama file dengan datetime
      const fileName = `One_Time_Setup_Data_${timestamp}.xlsx`;
      // disini fungsi buat file excel dari frontend

      // **1. Buat Workbook Baru**
      const workbook = XLSX.utils.book_new();
      const sheetDataMap = {}; // Menyimpan data setiap sheet agar tidak duplikat

      // **2. Fungsi Rekursif untuk Menambahkan Data ke Sheet**
      const processSheet = (sheetName, records) => {
        if (!records || records.length === 0) return;

        const upperSheetName = sheetName.toUpperCase(); // Ubah nama sheet jadi kapital

        // Ambil hanya field yang bukan array untuk Master
        if (upperSheetName === "MASTER") {
          const filteredData = records.map(row => {
            let cleanRow = {};
            Object.keys(row).forEach(key => {
              if (!Array.isArray(row[key])) cleanRow[key] = row[key];
            });
            return cleanRow;
          });

          if (!sheetDataMap[upperSheetName]) {
            sheetDataMap[upperSheetName] = [];
          }
          sheetDataMap[upperSheetName].push(...filteredData);
        }

        // Proses nested data (child array)
        records.forEach(row => {
          Object.keys(row).forEach(key => {
            if (Array.isArray(row[key]) && row[key].length > 0) {
              const childSheetName = key.toUpperCase(); // Ubah nama sheet jadi kapital
              if (!sheetDataMap[childSheetName]) {
                sheetDataMap[childSheetName] = [];
              }
              sheetDataMap[childSheetName].push(...row[key]); // Tambahkan data langsung ke sheet sesuai nama kolom array
              processSheet(childSheetName, row[key]); // Rekursi untuk level lebih dalam
            }
          });
        });
      };

      // **3. Proses Data Utama**
      processSheet("MASTER", data);

      // **4. Tambahkan Semua Sheet ke Workbook**
      Object.keys(sheetDataMap).forEach(sheetName => {
        const worksheet = XLSX.utils.json_to_sheet(sheetDataMap[sheetName]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });

      // **5. Konversi Workbook ke Buffer**
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

      // **6. Buat file Blob dan unduh**
      const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
      saveAs(blob, fileName);

      toast.success(`Export berhasil: ${fileName}`);
    }else {
      toast.error("Gagal mendapatkan data untuk ekspor.");
    }
      } catch (error) {
        toast.error('error export: ' + error);
      }    
}

