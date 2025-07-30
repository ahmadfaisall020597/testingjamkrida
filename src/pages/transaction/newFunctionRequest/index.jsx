import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, FormCheck, Row, Stack } from "react-bootstrap";
import { MdOutlineAddCircle } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import { History } from "src/utils/router";
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest";
import { encryptDataId, objectName, objectTable, updateFormSearchWithTenant } from "./newFunctionRequestFn";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { FaSearch } from "react-icons/fa";
import { handleModalOpenQueryTenant, titleModalQueryTenant } from "src/pages/masterPage/productPackage/productPackageFn";
import { setSelectableModalQuery, setShowLoadingScreen } from "src/utils/store/globalSlice";
import InputComponent from "src/components/partial/inputComponent";
import InputDateRangeComponent from "src/components/partial/inputDateRangeComponent";
import TableComponent from "src/components/partial/tableComponent";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { formatDateTime, formatNumber } from "src/utils/helpersFunction";
import { cancelTransaction, getTransactionList } from "src/utils/api/apiTransaction";
import { setListData, setShowModalUploadBulk } from "./newFunctionRequestSlice";
import "./style.scss";
import { toast } from "react-toastify";

import ModalUpload from "./submitBulk/modalUpload";
import { getBulkListData } from "src/utils/localStorage";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";

const linkApproval = import.meta.env.VITE_LINK_APPROVAL;

const SideButton = () =>{
  const dispatch = useDispatch()
  const currentPrivileges = usePrivileges()

  const handleButtonBulk = ()=>{
    if(getBulkListData()){
      History.navigate(objectRouterFunctionRequest.submitBulkFunctionRequest.path)
    }else{
      dispatch(setShowModalUploadBulk(true))
    }
  }

  if(currentPrivileges.includes("C")){
    return(
      <Stack direction="horizontal" gap={3} className="justify-content-sm-end flex-wrap">
        <ButtonComponent
          onClick={() => History.navigate(objectRouterFunctionRequest.submitNonBulkFunctionRequest.path)}
          title={"Add Non Bulk Request"}
          icon={<MdOutlineAddCircle size={28}/>}
        />
        <ButtonComponent
          onClick={() => handleButtonBulk()}
          title={"Add Bulk Request"}
          icon={<MdOutlineAddCircle size={28}/>}
        />
      </Stack>
    )
  }

  return <></>
  
}
const NewFunctionRequest = () =>{
  const dispatch = useDispatch()
  const currentPrivileges = usePrivileges();
  const { requestType, statusOrder, listData } = useSelector(state => state.newFunctionRequest)
  const { selectableModalQuery } = useSelector(state => state.global);

  const [totalRows, setTotalRows] = useState(0);

  const [formSearch, setFormSearch] = useState(
    objectName.reduce(
      (acc, curr) => ({ [curr]: acc[curr] ?? "", ...acc }), // Pastikan nilai default dipertahankan
      {
        [objectName[8]]: 1,    // pageNumber
        [objectName[9]]: 10,   // pageSize
        [objectName[11]]: "desc", // order
        [objectName[10]]: "ORDER_ID",
      }
    )
  );

  const [loading, setLoading] = useState(false);
  const [searchNow, setSearchNow] = useState(true);

  const [selectedRows, setSelectedRows] = useState([]);

  const columnConfig = [
    {
      name: "Order ID",
      cell: row =>(
        <Button variant="link" onClick={() => handleEdit(row)} className="p-0">
          <Stack direction="horizontal" className="w-100 fw-semibold" gap={2}>
            <div>{row[objectTable[0]]}</div>
          </Stack>
        </Button>
      ),
      selector: row => row[objectTable[0]],
      sortable: true,
      sortField: objectTable[0],
      width: "180px", // Pastikan tidak terlalu kecil
      wrap: true,
    },
    {
      name: "Seq",
      selector: row => row[objectTable[1]],
      sortable: true,
      sortField: objectTable[1],
      width: "85px", // Biasanya angka kecil, jadi cukup kecil
    },
    {
      name: "Delivery To",
      selector: row => row.DELIVERY_TO + " - " + row.DELIVERY_TO_DESC,
      sortable: true,
      sortField: "DELIVERY_TO",
      width: "300px", // Biasanya angka kecil, jadi cukup kecil
      wrap: true,
    },
    {
      name: "Delivery Date",
      selector: row => formatDateTime(row[objectTable[2]], "DD MMM YYYY"),
      sortable: true,
      sortField: objectTable[2],
      width: "160px",
    },
    {
      name: "Delivery Time",
      selector: row => formatDateTime(row[objectTable[2]], "HH:mm"),
      sortable: true,
      sortField: objectTable[2],
      width: "160px", // Hanya butuh 5 karakter: "HH:mm"
    },
    {
      name: "Function Item",
      selector: row => row[objectTable[3]],
      sortable: true,
      sortField: objectTable[3],
      width: "160px",
      wrap: true
    },
    {
      name: "Tenant Name",
      selector: row => row[objectTable[4]],
      sortable: true,
      sortField: objectTable[4],
      width: "180px",
      wrap: true
    },
    {
      name: "Request Type",
      selector: row => row[objectTable[5]],
      sortable: true,
      sortField: objectTable[5],
      width: "160px",
    },
    {
      name: "Status",
      cell: row => (
        row[objectTable[5]]?.toLowerCase() == "business" ?
          ['SO_002', 'SO_003', 'SO_010'].includes(row?.STATUS_CODE) ?
          <a href={linkApproval + row[objectTable[0]]} target="_blank" rel="noopener noreferrer">{row[objectTable[6]]}</a>
          :
          <div>{row[objectTable[6]]}</div>
        :
        <div>{row[objectTable[6]]}</div>
      ),
      sortable: true,
      sortField: objectTable[6],
      width: "140px",
      wrap: true
    },
    {
      name: "Room Name",
      selector: row => row[objectTable[7]],
      sortable: true,
      sortField: objectTable[7],
      width: "200px",
      wrap: true
    },
    {
      name: "Room Book by",
      selector: row => row[objectTable[8]] || "-",
      sortable: true,
      sortField: objectTable[8],
      width: "170px",
      wrap: true
    },
    {
      name: "Range Booking Room Date",
      selector: row => row[objectTable[9]] && row[objectTable[10]] ?
      `${formatDateTime(row[objectTable[9]])} - ${formatDateTime(row[objectTable[10]])}`
      : "-",
      sortable: true,
      sortField: objectTable[9], // Urutkan berdasarkan `BOOK_DATE_FROM`
      width: "350px", // Formatnya panjang, jadi beri cukup ruang
    },
    {
      name: "Delivery Type",
      selector: row => row[objectTable[11]],
      sortable: true,
      sortField: objectTable[11],
      width: "160px",
    },
    {
      name: "Items",
      selector: row => row[objectTable[12]],
      sortable: true,
      sortField: objectTable[12],
      width: "100px",
    },
    {
      name: "Total price",
      selector: row => formatNumber(row[objectTable[13]]),
      sortable: true,
      sortField: objectTable[13],
      width: "140px",
    },
    {
      name: "Total price after discount",
      selector: row => formatNumber(row[objectTable[14]]),
      sortable: true,
      sortField: objectTable[14],
      width: "250px",
      wrap: true
    },
    {
      name: "Order Type",
      selector: row => row[objectTable[15]],
      sortable: true,
      sortField: objectTable[15],
      width: "160px",
    }
  ];

  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryTenant) {
      setFormSearch(prev => updateFormSearchWithTenant(prev, selectableModalQuery, objectName));
    }

    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch]);

  const fetchData = useCallback(()=>{
    if(searchNow){
      setLoading(true);
      dispatch(setShowLoadingScreen(true))
      // fetchDummyData().then(res => {
      getTransactionList(formSearch).then(res => {
        const data = res.data.data
        setTotalRows(res.data.totalData)
        dispatch(setListData(data))
      }).catch(err=>{
        const response = err.response.data
        setTotalRows(response.totalData)
        dispatch(setListData([]))
      })
      .finally(()=>{
        setLoading(false)
        setSearchNow(false)
        dispatch(setShowLoadingScreen(false))
      })
    }
  },[dispatch, formSearch, searchNow])

  useEffect(() => {
    fetchData()
  },[fetchData])

  const handleChange = (key, value) => {
    setFormSearch((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSort = (column, sortDirection) => {
    setFormSearch((prev) => ({
      ...prev,
      [objectName[10]]: column.sortField,
      [objectName[11]]: sortDirection
    }));
    setSearchNow(true)
	}

  const isRowSelectable = (row) => {
    return row[objectTable[6]] === "Submitted" || row[objectTable[6]] === "Waiting for Approval" || row[objectTable[6]] === "Pending";
  };
  
  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };  

  const handleCancelOrder = () =>{
    dispatch(setShowLoadingScreen(true))
    const selected = selectedRows.map(v=>v.ID)
    if(selected.length > 0){
      cancelTransaction({listOrder:selected})
      .then(res=>{
        toast.success(res.data.message)
        setTimeout(()=>{
          window.location.reload()
        },300)
      }).finally(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }else{
      dispatch(setShowLoadingScreen(false))
    }
  }

  const handleEdit = (row)=>{
    const id = row.ID
    const status = row.STATUS
    const getCodeIdStatus = statusOrder?.find(v=> v.label==status)
    const canEdit = getCodeIdStatus?.value == "SO_001"
    const encryptedData = encryptDataId(id, canEdit)
    window.location.href=`${objectRouterFunctionRequest.editNonBulkFunctionRequest.path}?q=${encryptedData}`
    // History.navigate(`${objectRouterFunctionRequest.editNonBulkFunctionRequest.path}?q=${encryptedData}`)
    
  }

  return (
		<Container fluid id="new-function-request-page">
			<CardComponent
				title={`Function Request`}
				type="index"
				sideComponent={<SideButton/>}
        addonClassName={"content overflow-hidden"}
        addonBodyClassName={"m-3"}
			>
				<div className="mt-4">
          <Row className="gx-5 gy-4">
            <Col xl={6}>
              <InputDropdownComponent
                onChange={(e) => handleChange(objectName[0], e.target.value)}
                value={formSearch[objectName[0]]}
                label="Request Type"
                listDropdown={requestType}
                labelXl="3"
                valueIndex
                marginBottom="3"
              />
              <InputDropdownComponent
                onChange={(e) => handleChange(objectName[1], e.target.value)}
                value={formSearch[objectName[1]]}
                label="Status"
                listDropdown={statusOrder}
                labelXl="3"
                valueIndex
                marginBottom="3"
              />
              <InputModalQueryComponent
                label="Tenant ID"
                labelXl="3"
                value={formSearch[objectName[3]]}
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleModalOpenQueryTenant()}
                formGroupClassName={"align-items-center"}
                marginBottom="0"
              />
            </Col>
            <Col xl={6}>
              <InputDateRangeComponent
                labelXs="4"
                labelXl="0"
                label="Delivery Date"
                startDate={formSearch[objectName[4]]}
                endDate={formSearch[objectName[5]]}
                onChangeStartDate={(e)=>handleChange(objectName[4], e)}
                onChangeEndDate={(e)=>handleChange(objectName[5], e)}
                rowClassName={"gx-2"}
              />
              <InputComponent
                type="text"
                label="Event Name"
                labelXl="4"
                value={formSearch[objectName[6]]}
                name={objectName[6]}
                onChange={(e) => handleChange(objectName[6], e.target.value)}
                formGroupClassName={"gx-2 align-items-center"}
                marginBottom="3"
              />
              <InputComponent
                type="text"
                label="Purpose of Function"
                labelXl="4"
                value={formSearch[objectName[7]]}
                name={objectName[7]}
                onChange={(e) => handleChange(objectName[7], e.target.value)}
                formGroupClassName={"gx-2 align-items-center"}
                marginBottom="3"
              />
              <ButtonComponent
                onClick={() => setSearchNow(true)}
                type="button"
                variant="primary"
                title="Search"
                className={"text-white mt-3 px-4 justify-items-center float-end w-25"}
                rounded="2"
                disabled={loading}
              />
            </Col>
          </Row>
          <TableComponent
            columns={columnConfig}
            data={listData}
            pagination
            paginationServer
            paginationTotalRows={totalRows}
            paginationPerPage={formSearch[objectName[9]]}
            paginationComponentOptions={{noRowsPerPage: true}}
            onChangePage={page => {handleChange(objectName[8], page); setSearchNow(true)}}
            progressPending={loading}
            progressComponent={<LoadingSpinner color="secondary" />}
            persistTableHead
            sortServer
            onSort={(selectedColumn, sortDirection)=>handleSort(selectedColumn, sortDirection)}
            responsive
            striped
            needExport
            exportFileName={"list-function-request"}
            exportFn={getTransactionList}
            exportParam={formSearch}
            selectableRows // 🔥 Aktifkan fitur select
            onSelectedRowsChange={handleRowSelected} // 🔥 Tangani perubahan selection
            selectableRowDisabled={row => !isRowSelectable(row)} // 🔥 Batasi yang bisa dipilih
            selectableRowsComponent={FormCheck}
            className="custom-checkbox-table"
            defaultSortAsc={true}
            defaultSortFieldId={"ORDER_ID"}
          />
          {
            currentPrivileges.includes("U") &&
            <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
              <ButtonComponent
                className="px-sm-5 pt-2 pb-2 fw-semibold"
                variant="outline-danger"
                onClick={() => handleCancelOrder()}
                title="Cancel Transaction"
                disabled={selectedRows.length === 0}
              />
            </Stack>
          }
          <ModalUpload/>
        </div>
      </CardComponent>
    </Container>
  )
}

export default NewFunctionRequest;