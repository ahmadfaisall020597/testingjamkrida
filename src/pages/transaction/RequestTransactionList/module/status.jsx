import { useEffect, useMemo, useState } from "react"
import { Button, Image, Modal, Stack } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import ButtonComponent from "src/components/partial/buttonComponent"
import { getLookupValueDetails } from "src/utils/api/apiMasterPage"
import { statusOrder } from "src/utils/variableGlobal/varLookupValue"
import { setFormData } from "../requestTransactionListSlice"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import { getHistoryStatusByOrderId } from "src/utils/api/apiTransaction"
import closeButton from "src/assets/image/close_button_gray.png"
import DataTable from "react-data-table-component"
import moment from "moment"

const StatusComponent = ()=>{
  const dispatch = useDispatch()
  const { data, formData } = useSelector(state=>state.requestTransactionList)
  const [listStatusOrder, setListStatusOrder] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [listHistoryStatus, setListHistoryStatus] = useState([]);

  useEffect(()=>{
    getLookupValueDetails({}, statusOrder).then(res=>{
      const data = res.data.data
      const detailData = data.DETAILS
      setListStatusOrder(detailData)
    })
  },[data])

  const onClick = (status) => {
    // Menandai tombol yang diklik sebagai aktif
    dispatch(setFormData({key: "STATUS", value: status}))
  };

  const showHistoryStatus = () =>{
    dispatch(setShowLoadingScreen(true))
    getHistoryStatusByOrderId({ID: data.ID}).then(res=>{
      setShowModal(true)
      if(res?.data?.data?.length > 0){
        const data = res.data.data.map((v, idx)=>{
          const running_number = idx + 1
          return {...v, NUMBER: running_number}
        })
        setListHistoryStatus(data)
      }
    })
    .finally(()=>{
      dispatch(setShowLoadingScreen(false)) 
    })
  }

  // Fungsi untuk parse DESC dan mengembalikan info yang dibutuhkan
  const parseDesc = (desc) => {
    const result = {};
    const nextMatch = desc.match(/next: \[(.*?)\]/);
    const labelsMatch = desc.match(/labels: \[(.*?)\]/);
    const stylesMatch = desc.match(/styles: \[(.*?)\]/);

    if (nextMatch) result.next = nextMatch[1].split(", ").map(item => item.replace(/"/g, ""));
    if (labelsMatch) result.labels = labelsMatch[1].split(", ").map(item => item.replace(/"/g, ""));
    if (stylesMatch) result.styles = stylesMatch[1].split(", ").map(item => item.replace(/"/g, ""));

    return result;
  };

  // Menggunakan useMemo untuk menghitung statusMapping dan filteredNextStatuses
  const { filteredNextStatuses, statusMapping, availableStatus } = useMemo(() => {
    const statusMapping = {};

    listStatusOrder.forEach((status) => {
      const parsedDesc = parseDesc(status.DESC);
      statusMapping[status.CODE_ID] = {
        label: status.SHORT_DESC,
        ...parsedDesc
      };
    });

    const currentStatus = data?.STATUS;
    const availableStatus = statusMapping[currentStatus] || { next: [], labels: [], styles: [] };

    let filteredNextStatuses = availableStatus.next;

    // Hanya tampilkan tombol jika "next" ada isinya (tidak kosong)
    if (filteredNextStatuses?.[0] === '') {
      filteredNextStatuses = [];
    }

    // if (currentStatus === "SO_001") {
    //   // Pada status "Submitted", hanya tampilkan "Confirm" dan "Tenant Cancel"
    //   filteredNextStatuses = availableStatus.next.filter((status) => status === "SO_002" || status === "SO_008");
    // }

    return { filteredNextStatuses, statusMapping, availableStatus };
  }, [listStatusOrder, data]);

  return(
    <Stack gap={3}>
      <div>
        <div className="px-3 py-2 header-title-status fw-bold fs-6 text-white">
        Update Status
        </div>
        <p className="m-0 header-subtitle-status"><small>Please update your order status here</small></p>
      </div>
      <Stack direction="horizontal" className="flex-wrap" gap={2}>
        {/* here all available status button */}
        {filteredNextStatuses.length > 0 && filteredNextStatuses.map((status, index) => {          
          const { label } = statusMapping[status] || {};
          let buttonLabel = availableStatus.labels?.[index] || label;
          buttonLabel = status=="SO_008" ? "Cancel" : buttonLabel
          const isActive = formData?.STATUS === status; // Menandai tombol yang aktif

          return (
            <ButtonComponent
              key={status}
              title={buttonLabel}
              className={`${isActive ? "active" : ""}`}
              variant={`${availableStatus.styles[index] || "secondary"} `}
              onClick={() => onClick(status)}
              rounded="2"
            />
          );
        })}
      </Stack>
      <div>
        <Button variant="link" onClick={() => showHistoryStatus()} title="View History Status" className="m-0 p-0">
          View History Status
        </Button>
      </div>
      <Modal
        show={showModal}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        onHide={()=>setShowModal(false)}
      >
        <Modal.Body className="position-relative">
          <div role="button" className="position-absolute" onClick={()=>setShowModal(false)} style={{right:"12px"}}>
            <Image src={closeButton} />
          </div>
          <div className="p-2">
            <Modal.Title id="contained-modal-title-vcenter" className="mb-2">
              List History Status
            </Modal.Title>
            <div>
              <DataTable
                columns={[
                  {
                    name: "No.",
                    selector: row => row.NUMBER,
                    width: "70px"
                  },
                  {
                    name: "Status",
                    selector: row => row.STATUS_DESC,
                    wrap: true
                  },
                  {
                    name: "Update Date",
                    selector: row => row.LAST_UPDATED_DATE && moment(moment.utc(row.LAST_UPDATED_DATE).local()).format("DD/MM/YYYY"),
                    width: "140px"
                  },
                  {
                    name: "Update Time",

                    selector: row => row.LAST_UPDATED_DATE && moment(moment.utc(row.LAST_UPDATED_DATE).local()).format("HH:mm"),
                    width: "130px"
                  },
                ]}
                data={listHistoryStatus}
                pagination
                paginationPerPage={10}
                paginationComponentOptions={{noRowsPerPage: true}}
                persistTableHead
                striped
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Stack>
  )
}

export default StatusComponent