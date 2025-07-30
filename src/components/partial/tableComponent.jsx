import moment from "moment";
import { Button, Stack } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { RiFileExcel2Fill } from "react-icons/ri";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TableComponent = (props) => {
  const exportToExcel = async ()=>{
    try {
      if(props.exportFn){
        const param = {
          ...props.exportParam,
          pageNumber: 1,
          pageSize: props.paginationTotalRows
        }
        const response = await props.exportFn(param)
        if(response && response.data){
          const data = response.data.data
          if (!data || data.length === 0) {
            toast.warning("Tidak ada data untuk diekspor.");
            return;
          }

          // Generate Timestamp dengan Moment.js
          const timestamp = moment().format("YYYYMMDD_HHmmss"); // Format: YYYYMMDD_HHmmss
          
          // Nama file dengan datetime
          const fileName = props.exportFileName ? `${props.exportFileName}_${timestamp}.xlsx` : `data_${timestamp}.xlsx`;
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
      }else{
        toast.error('url api not found')
      }
    } catch (error) {
      toast.error('error export: ' + error);
    }    
  }

  return (
    <div>
      {
        props.needExport && (
          <Button variant="secondary" className="mb-1" onClick={()=>exportToExcel()}>
            <Stack direction="horizontal" gap={2}>
              <RiFileExcel2Fill/>
              <p className="m-0">Export to Excel</p>
            </Stack>
          </Button>
        )
      }
      <DataTable
        {...props}
      />
    </div>
  )
};

export default TableComponent;