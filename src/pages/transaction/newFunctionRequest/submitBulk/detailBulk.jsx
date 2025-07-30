import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import TableComponent from "src/components/partial/tableComponent";
import { getBulkListData, saveBulkListData, saveBulkStepFunctionRequest } from "src/utils/localStorage";
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest";
import { backToFunctionRequest, handleModalOpenQueryCostCenter, titleModalQueryCostCenter, validateBulkListData } from "../newFunctionRequestFn";
import { setBulkStepNameComponent } from "../newFunctionRequestSlice";
import moment from "moment";
import InputComponent from "src/components/partial/inputComponent";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { FaSearch } from "react-icons/fa";
import { setSelectableModalQuery, setShowLoadingScreen, setShowModalQuery } from "src/utils/store/globalSlice";
import { getBookRoom, getNonBookRoom } from "src/utils/api/apiTransaction";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";

const DetailBulk = () =>{
  const dispatch = useDispatch()
  const location = useLocation()
  const [localState, setLocalState] = useState([]);
  const [titleModalQuery, setTitleModalQuery] = useState(null);
  const {bulkStepNameComponent, deliveryType} = useSelector(state => state.newFunctionRequest)
  const { selectableModalQuery } = useSelector(state => state.global);

  const columnsConfig = [
    {
      name: "Seq",
      selector: row => row.sequence,
    },
    {
      name: "Delivery Date",
      width: "200px",
      cell: (row)=>(
        <InputComponent
          labelXl="0"
          label=""
          value={moment(row.roomSelectionData?.DELIVERY_DATETIME).format("YYYY-MM-DD")}
          onChange={(e)=>handleDateChange(row, e.target.value)}
          type={"date"}
          name="DATE"
          marginBottom="0"
        />
      ),
    },
    {
      name: "Delivery Time",
      width: "170px",
      cell: (row)=>(
        <InputComponent
          labelXl="0"
          label=""
          value={moment(row.roomSelectionData?.DELIVERY_DATETIME).format("HH:mm")}
          onChange={(e)=>handleTimeChange(row, e.target.value)}
          type={"time"}
          name="TIME"
          marginBottom="0"
        />
      ),
    },
    {
      name: "Status",
      cell: () => <div>Draft</div>
    },
    {
      name: "Tenant Name",
      width: "150px",
      wrap: true,
      selector: row => row.tenantSelectionData?.TENANT_NAME,
    },
    {
      name: "Non Booked Room",
      width: "250px",
      cell: (row)=>(
        row.roomSelectionData.NON_BOOK_ROOM ? 
        <div>
          <InputModalQueryComponent
            label=""
            labelXl="0"
            value={row.roomSelectionData?.ROOM_NON_TEAMS_NAME}
            componentButton={<FaSearch />}
            buttonOnclick={() =>handleOpenQueryNonBookRoom(row)}
            formGroupClassName={"align-items-center"}
            marginBottom="0"
          />
        </div>
        :
        <div>-</div>
      )
    },
    {
      name: "Booked Room",
      width: "250px",
      cell: (row)=>(
        row.roomSelectionData.NON_BOOK_ROOM ? 
        <div>-</div>
        :
        <div>
          <InputModalQueryComponent
            label=""
            labelXl="0"
            value={row.roomSelectionData?.ROOM_TEAMS_NAME}
            componentButton={<FaSearch />}
            buttonOnclick={() =>handleOpenQueryBookRoom(row)}
            formGroupClassName={"align-items-center"}
            marginBottom="0"
          />
        </div>
      )
    },
    {
      name: "Room Book by",
      width: "200px",
      cell: (row)=>(
        row.roomSelectionData.NON_BOOK_ROOM ? 
        <div>-</div>
        :
        <div>{row.roomSelectionData.OBJ_ROOM_DATA?.ROOM_BOOKEDBY}</div>
      )
    },
    {
      name: "Range Booking Room Date",
      width: "280px",
      cell: (row)=>(
        row.roomSelectionData.NON_BOOK_ROOM ? 
        <div>-</div>
        :
        <div>{moment(row.roomSelectionData?.OBJ_ROOM_DATA?.ROOM_FROM).format("DD MMM YYYY HH:mm")} - {moment(row.roomSelectionData?.OBJ_ROOM_DATA?.ROOM_TO).format("DD MMM YYYY HH:mm")}</div>
      )
    },
    {
      name: "Delivery Type",
      width: "200px",
      cell: (row)=>(
        <InputDropdownComponent
          onChange={(e) => handleChangeDeliveryType(row, e.target.value)}
          value={row.orderSummaryData?.deliveryType}
          label=""
          listDropdown={[...deliveryType]}
          labelXl="0"
          valueIndex
          marginBottom="0"
          formGroupClassName={"w-100"}
        />
      )
    },
    {
      name: "Delivery To",
      width: "200px",
      selector: row => row.roomSelectionData?.DELIVERY_TO_DESC
    },
    {
      name: "Phone Number",
      width: "200px",
      selector: row => row.roomSelectionData?.PHONE_NUMBER
    },
    {
      name: "Cost Center",
      width: "200px",
      cell: (row)=>(

        <div>{row.orderSummaryData?.costCenterId ? 
          (
            <InputModalQueryComponent
              label=""
              labelXl="0"
              value={row.orderSummaryData?.costCenterId}
              componentButton={<FaSearch />}
              buttonOnclick={() =>handleOpenCostCenter(row)}
              formGroupClassName={"align-items-center"}
              marginBottom="0"
            />
          )
          :
          "-"
        }</div>
      )
    },
    {
      name: "Total Attendance",
      width: "200px",
      selector: row => row.roomSelectionData?.TOTAL_ATTENDANCE
    }
  ]

  useEffect(()=>{
    if (location.pathname.includes(objectRouterFunctionRequest.submitBulkFunctionRequest.path)) {
      if(bulkStepNameComponent=="DetailBulk"){
        if(getBulkListData()){
          setLocalState(getBulkListData())
        }
      }
    }
  },[location, bulkStepNameComponent])
  
  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQuery) {
      setLocalState(prev =>{
        if(selectableModalQuery?.params?.type=="NON_BOOK_ROOM"){
          prev[selectableModalQuery?.params?.index].roomSelectionData.ROOM_NON_TEAMS_NAME = selectableModalQuery?.data?.ROOM_NAME;
          prev[selectableModalQuery?.params?.index].roomSelectionData.ROOM_NON_TEAMS_ID = selectableModalQuery?.data?.ROOM_ID;
          prev[selectableModalQuery?.params?.index].roomSelectionData.OBJ_ROOM_DATA = selectableModalQuery?.data
        }
        if(selectableModalQuery?.params?.type=="BOOK_ROOM"){
          prev[selectableModalQuery?.params?.index].roomSelectionData.ROOM_TEAMS_NAME = selectableModalQuery?.data?.ROOM_NAME;
          prev[selectableModalQuery?.params?.index].roomSelectionData.ROOM_TEAMS_ID = selectableModalQuery?.data?.ROOM_ID;
          prev[selectableModalQuery?.params?.index].roomSelectionData.OBJ_ROOM_DATA = selectableModalQuery?.data
        }
        if(selectableModalQuery?.params?.type=="COST_CENTER"){
          prev[selectableModalQuery?.params?.index].orderSummaryData.costCenterId = selectableModalQuery?.data?.costCenterId;
          prev[selectableModalQuery?.params?.index].roomSelectionData.costCenterName = selectableModalQuery?.data?.costCenterName;
        }
        saveBulkListData([...prev])
        return [...prev];
      });
    }

    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch, titleModalQuery]);

  const handleOpenQueryNonBookRoom = (row) =>{
    const data = getNonBookRoom;
    const index = localState.findIndex((item) => item.sequence === row.sequence);
    const title = "List Non Booked Room";
    setTitleModalQuery(title)
  
    const columnConfig = [
      {
        name: "Room ID",
        selector: (row) => row.ROOM_ID,
      },
      {
        name: "Room Name",
        selector: (row) => row.ROOM_NAME,
      },
      {
        name: "Capacity",
        selector: (row) => row.CAPACITY,
      },
    ]
    dispatch(setShowModalQuery({show:true,
      content:{
        title: title,
        data: data,
        columnConfig: columnConfig,
        searchKey: "roomName",
        searchLabel: "Room Name",
        usingPaginationServer: true,
        paramsReturn: {sequence: row.sequence, index: index, type: "NON_BOOK_ROOM"}
      }
    }))
  }

  const handleOpenQueryBookRoom = (row) =>{
    const data = getBookRoom;
    const index = localState.findIndex((item) => item.sequence === row.sequence);
    const title = "List Booked Room";
    setTitleModalQuery(title)
  
    const columnConfig = [
      {
        name: "Room ID",
        selector: (row) => row.ROOM_ID,
        width: "150px",
      },
      {
        name: "Room Name",
        selector: (row) => row.ROOM_NAME,
        wrap: true,
        width: "280px"
      },
      {
        name: "Book By",
        selector: (row) => row.ROOM_BOOKEDBY,
        wrap: true,
        width: "200px"
      },
      {
        name: "From",
        cell: (row) => <div>{moment(row.ROOM_FROM).format("DD/MM/YYYY HH:mm")} - {moment(row.ROOM_TO).format("DD/MM/YYYY HH:mm")}</div>,
        width: "360px",
      },
      {
        name: "Capacity",
        selector: (row) => row.CAPACITY,
      },
    ]
    dispatch(setShowModalQuery({show:true,
      content:{
        title: title,
        data: data,
        columnConfig: columnConfig,
        searchKey: "roomName",
        searchLabel: "Room Name",
        usingPaginationServer: false,
        params:{
          startTime: moment(row.roomSelectionData?.DELIVERY_DATETIME).format("YYYY-MM-DD"),
        },
        paramsReturn: {sequence: row.sequence, index: index, type: "BOOK_ROOM"}
      }
    }))
  }

  const handleOpenCostCenter = (row) =>{
    const index = localState.findIndex((item) => item.sequence === row.sequence);
    const title = titleModalQueryCostCenter;
    setTitleModalQuery(title)
    handleModalOpenQueryCostCenter(index)
  }

  const handleDateChange = (row, value)=>{
    const index = localState.findIndex((item) => item.sequence === row.sequence);
    setLocalState((prev)=>{
       const updatedDatetime = value && moment(prev[index].roomSelectionData?.DELIVERY_DATETIME).format("HH:mm") ? `${value} ${moment(prev[index].roomSelectionData?.DELIVERY_DATETIME).format("HH:mm")}:00` : undefined;
      prev[index].roomSelectionData.DELIVERY_DATETIME = updatedDatetime;
      saveBulkListData([...prev])
      return [...prev];
    })
  }

  const handleTimeChange = (row, value)=>{
    const index = localState.findIndex((item) => item.sequence === row.sequence);
    setLocalState((prev)=>{
      const updatedDatetime = moment(prev[index].roomSelectionData?.DELIVERY_DATETIME).format("YYYY-MM-DD") && value ? `${moment(prev[index].roomSelectionData?.DELIVERY_DATETIME).format("YYYY-MM-DD")} ${value}:00` : "";
      prev[index].roomSelectionData.DELIVERY_DATETIME = updatedDatetime;
      saveBulkListData([...prev])
      return [...prev];
    })
  }

  const handleChangeDeliveryType = (row, value)=>{
    const index = localState.findIndex((item) => item.sequence === row.sequence);
    setLocalState((prev)=>{
      prev[index].orderSummaryData.deliveryType = value;
      saveBulkListData([...prev])
      return [...prev];
    })
  }

  const handleNext = ()=>{
    const isValid = validateBulkListData(localState);
    if (isValid) {
      dispatch(setShowLoadingScreen(false))
      // toast.success("Validation Passed ✅");
      saveBulkListData(localState) // save to local storage
      saveBulkStepFunctionRequest("ProductBulkSelection")
      // simpan ke local storage, lalu call API
      dispatch(setBulkStepNameComponent("ProductBulkSelection"))
    }
  }

  const handleBack = ()=>{
    backToFunctionRequest("bulk")
  }

  return(
    <div>
      <h5 className="fw-bold mb-4">Detail Bulk Function Request</h5>
      <TableComponent
        columns={columnsConfig}
        data={localState}
        pagination
        paginationComponentOptions={{noRowsPerPage: true}}
        persistTableHead
        responsive
        striped
        // needExport
        // exportFileName={"list-bulk-function-request"}
        // exportParam={{}}
        // exportFn={getTransactionList}
      />
      {/* Submit & Cancel Buttons */}
      <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
        <ButtonComponent
          className="px-sm-5 fw-semibold"
          variant="outline-dark"
          onClick={handleBack}
          title="Back"
        />
        <ButtonComponent 
          className="px-sm-5 fw-semibold" 
          variant="warning"
          onClick={handleNext} 
          title="Next"
        />
      </Stack>
    </div>
  )
}

export default DetailBulk