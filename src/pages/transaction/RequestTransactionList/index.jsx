import moment from "moment"
import { useCallback, useEffect, useState } from "react"
import { Button, Col, Container, Row, Stack } from "react-bootstrap"
import { RiEditBoxFill } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { Link, useLocation } from "react-router"
import ButtonGroupTenantComponent from "src/components/partial/buttonTenantComponent"
import CardComponent from "src/components/partial/cardComponent"
import CardStatus from "src/components/partial/cardStatusComponent"
import InputDateRangeComponent from "src/components/partial/inputDateRangeComponent"
import InputDropdownComponent from "src/components/partial/inputDropdownComponent"
import LoadingSpinner from "src/components/partial/spinnerComponent"
import TableComponent from "src/components/partial/tableComponent"
import { getLookupValueDetails } from "src/utils/api/apiMasterPage"
import { getStatusCountTenant, getTransactionListTenant } from "src/utils/api/apiTransaction"
import { History } from "src/utils/router"
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest"
import { statusOrder } from "src/utils/variableGlobal/varLookupValue"
import { encryptDataId } from "./requestTransactionListFn"
import { setResetRequestTransactionListState } from "./requestTransactionListSlice"
import usePrivileges from "src/utils/auth/getCurrentPrivilege"

const BundleCardStatus = ({notifCount})=>{
  const arrayNotifStatus = ["SO_001", "SO_003", "SO_005", "SO_006", "SO_010"]
  const [listData, setListData] = useState([]);

  useEffect(()=>{
    getLookupValueDetails({}, statusOrder).then(res=>{
      const data = res.data.data
      const detailData = data.DETAILS.filter(v=> arrayNotifStatus.includes(v.CODE_ID)).map(v=>{
        const backgroundColor = v.DESC.match(/backgroundColor:\s*['"]?([^,'"]+)['"]?/);
        return {...v, COLOR:backgroundColor[1]}
      })
      setListData(detailData)
    })
  },[])

  const getNotifCount = (codeId) => {
    const notif = notifCount.find(v => v.CODE_ID === codeId)
    if (notif) return notif.COUNT
    return 0
  }

  return(
    listData.map((v, idx)=>
      <CardStatus name={v.SHORT_DESC} count={getNotifCount(v.CODE_ID)} color={v.COLOR} key={`${v.CODE_ID}-${idx}`}/>
    )
  )
}

const IndexRequestTransactionList = ()=>{
  const currentPrivileges = usePrivileges();
  const location = useLocation()
  const dispatch = useDispatch()
	const { profileUsers } = useSelector(state=>state.global)
  const { statusOrder } = useSelector(state => state.newFunctionRequest)

  useEffect(()=>{
    dispatch(setResetRequestTransactionListState())
  },[dispatch, location])

	const [selectedTenant, setSelectedTenant] = useState(null);
	useEffect(()=>{
		if(profileUsers?.tenantAdmin){
			setSelectedTenant(profileUsers?.tenantAdmin[0])
		}
	},[profileUsers])

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
	const [sortObject, setSortObject] = useState({
    sortBy: "ORDER_ID",
    order: "desc"
  });
  const [listData, setListData] = useState([]);
  const perPage = 10

  // const [loadingButton, setLoadingButton] = useState(false);
  const [listDataStatusButton, setListDataStatusButton] = useState([]);

  const [filterStatus, setFilterStatus] = useState("");

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  const columnsConfig = [
    {
      name: "Requested by",
			cell: row =>(
        <Link to={`${objectRouterFunctionRequest.viewRequestTransactionList.path}?q=${encryptDataId(row.ORDER_ID, "view")}`}>{row.REQUEST_BY}</Link>
      ),
      sortable: true,
      sortField: "REQUEST_BY",
    },
    {
      name: "Order ID",
      selector: row => row.ORDER_ID,
      sortable: true,
      sortField: "ORDER_ID",
    },
    {
      name: "Status",
      selector: row => row.STATUS_DESC,
      sortable: true,
      sortField: "STATUS",
    },
    {
      name: "Delivery Date",
      selector: row => moment(row.DELIVERY_DATE).format("DD MMM YYYY"),
      sortable: true,
      sortField: "DELIVERY_DATE",
    },
    {
      name: "Delivery Type",
      selector: row => row.DELIVERY_TYPE,
      sortable: true,
      sortField: "DELIVERY_TYPE",
    },
		{
      name: "Type",
      selector: row => row.REQUEST_TYPE,
      sortable: true,
      sortField: "REQUEST_TYPE",
    },
    {
      name: "Actions",
      cell: row => (
        <Stack direction="horizontal">
          {
            currentPrivileges.includes("U") &&
            <Button variant="link" onClick={() => handleEdit(row)} className="me-2">
              <Stack direction="horizontal" gap={2}>
                <RiEditBoxFill />
                <div>Edit</div>
              </Stack>
            </Button>
          }
        </Stack>
      ),
      width: "150px",
    },
  ];

  const fetchData =useCallback(() => {
    setLoading(true);
    const params = {
      pageNumber: currentPage, 
      pageSize:perPage,
      status: filterStatus,
      deliveryDateFrom: dateRange.startDate,
      deliveryDateTo: dateRange.endDate,
      sortBy:sortObject.sortBy,
      order:sortObject.order
    }
    getTransactionListTenant(params).then(res=>{
      const data = res.data.data
      setTotalRows(res.data.totalData)
      setListData(data)
      setLoading(false)
    }).catch(err=>{
      const response = err.response.data
      setTotalRows(response.totalData)
      setListData(response.data || [])
      setLoading(false)
    })
  },[currentPage, dateRange, sortObject, filterStatus])
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchDataGetStatus =useCallback(() => {
    // setLoadingButton(true);
    getStatusCountTenant().then(res=>{
      const data = res.data.data
      setListDataStatusButton(data)
      // setLoadingButton(false)
    }).catch(err=>{
      const response = err.response.data
      setListData(response.data || [])
      // setLoadingButton(false)
    })
  },[])
  
  useEffect(() => {
    fetchDataGetStatus();
  }, [fetchDataGetStatus]);

  const handleSort = (column, sortDirection) => {
    setSortObject({
      sortBy: column.sortField,
      order: sortDirection
    })
  }

  const handleEdit = (data) => {
    const id = data.ORDER_ID
    const idEncrypt = encryptDataId(id, "edit")
		History.navigate(`${objectRouterFunctionRequest.editRequestTransactionList.path}?q=${idEncrypt}`);
		// Navigate to edit page or show modal
	};

  return (
		<Container fluid id="list-request-transaction-page">
			<CardComponent
				title={`${selectedTenant? `${selectedTenant.TENANT_NAME}`: ""}  - Search Request`}
				type="index"
			>
        <div className="content mb-3">
					<ButtonGroupTenantComponent className={"my-3"} listTenant={profileUsers?.tenantAdmin} selectedTenant={selectedTenant} onChangeTenant={(tenant)=>setSelectedTenant(tenant)}/>
          <div className="my-4">
            <Stack direction="horizontal" className="flex-wrap" gap={3}>
              <BundleCardStatus notifCount={listDataStatusButton}/>
            </Stack>
          </div>
          <Row className="my-2">
						<Col xl={3} md={6}>
              <InputDropdownComponent
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
                label="Status"
                listDropdown={statusOrder}
                labelXl="12"
                valueIndex
              />
						</Col>
						<Col xl={4} lg={6} md={12}>
							<InputDateRangeComponent
								labelXl="12"
								formGroupClassName={"dateRangeProductPromo"}
                startDate={dateRange.startDate}
                endDate={dateRange.endDate}
                onChangeStartDate={(e)=>setDateRange({...dateRange, startDate: e})}
                onChangeEndDate={(e)=>setDateRange({...dateRange, endDate: e})}
							/>
						</Col>
					</Row>
          <TableComponent
						columns={columnsConfig}
						data={listData}
						pagination
						paginationServer
						paginationTotalRows={totalRows}
						paginationPerPage={perPage}
						paginationComponentOptions={{noRowsPerPage: true}}
						onChangePage={page => setCurrentPage(page)}
						progressPending={loading}
						progressComponent={<LoadingSpinner color="secondary" />}
						persistTableHead
						sortServer
						onSort={(selectedColumn, sortDirection)=>handleSort(selectedColumn, sortDirection)}
						responsive
						striped
						needExport={true}
						exportParam={{
              pageNumber: currentPage, 
              pageSize:perPage,
              status: filterStatus,
              deliveryDateFrom: dateRange.startDate,
              deliveryDateTo: dateRange.endDate,
              sortBy:sortObject.sortBy,
              order:sortObject.order
						}}
						exportFileName={"list-request-transaction-"+selectedTenant?.TENANT_NAME}
            exportFn={getTransactionListTenant}
					/>
        </div>
      </CardComponent>
    </Container>
  )
}

export default IndexRequestTransactionList