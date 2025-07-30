import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import CardComponent from "src/components/partial/cardComponent";
import CardStatus from "src/components/partial/cardStatusComponent";
import InputDateRangeComponent from "src/components/partial/inputDateRangeComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import TableComponent from "src/components/partial/tableComponent";
import { getLookupValueDetails } from "src/utils/api/apiMasterPage";
import { cancelOrderInquiry, getListHistoryOrder, getStatusCountAdmin } from "src/utils/api/apiTransaction";
import { History } from "src/utils/router";
import { statusOrder } from "src/utils/variableGlobal/varLookupValue";
import { encryptDataId } from "./orderHistoryListFn";
import objectRouterInquiry from "src/utils/router/objectRouter.inquiry";
import { toast } from "react-toastify";
import { setShowLoadingScreen, setShowModalGlobal } from "src/utils/store/globalSlice";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";

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
      <CardStatus name={v.SHORT_DESC} count={getNotifCount(v.CODE_ID)} color={v.COLOR} key={`${v.id}-${idx}`}/>
    )
  )
}
const OrderHistoryListPage = () => {
  const currentPrivileges = usePrivileges()
  const dispatch = useDispatch()
  const { statusOrder } = useSelector(state => state.newFunctionRequest)

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [sortObject, setSortObject] = useState({
    sortBy: "REQUEST_NUMBER",
    order: "desc"
  });
  const [listData, setListData] = useState([]);
  const perPage = 10

  const [searchTermRequest, setSearchTermRequest] = useState("");
  const [currentSearchRequest, setCurrentSearchRequest] = useState("");
  const debounceSearchRequestRef = useRef(null);

  const [filterStatus, setFilterStatus] = useState("");

  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });

  const [listDataStatusButton, setListDataStatusButton] = useState([]);

  const columnsConfig = [
    {
      name: "Request Number",
			selector: row => row.REQUEST_NUMBER,
      sortable: true,
      sortField: "REQUEST_NUMBER",
			width: "190px",
    },
    {
      name: "Request Type",
			selector: row => row.REQUEST_TYPE,
      sortable: true,
      sortField: "REQUEST_TYPE",
			width: "160px",
    },
    {
      name: "Total Attendees",
			selector: row => row.TOTAL_ATTENDANCE,
      sortable: true,
      sortField: "TOTAL_ATTENDANCE",
			width: "180px",
    },
    {
      name: "Request Status",
			selector: row => row.STATUS,
      sortable: true,
      sortField: "STATUS",
			width: "170px",
      wrap: true
    },
    {
      name: "Request By",
			selector: row => row.REQUEST_BY,
      sortable: true,
      sortField: "REQUEST_BY",
			width: "330px",
      wrap: true
    },
    {
      name: "Phone Number",
			selector: row => row.PHONE_NUMBER,
      sortable: true,
      sortField: "PHONE_NUMBER",
			width: "170px",
    },
    {
      name: "Description",
			selector: row => row.DESCRIPTION,
      sortable: true,
      sortField: "DESCRIPTION",
			width: "180px",
      wrap: true
    },
    {
      name: "Event Name",
			selector: row => row.EVENT_NAME,
      sortable: true,
      sortField: "EVENT_NAME",
			width: "180px",
      wrap: true
    },
    {
      name: "Cost Center",
			selector: row => row.COST_CENTER_ID,
      sortable: true,
      sortField: "COST_CENTER_ID",
			width: "150px",
    },
    {
      name: "Tenant",
			selector: row => row.TENANT_NAME,
      sortable: true,
      sortField: "TENANT_NAME",
			width: "120px",
      wrap: true
    },
    {
      name: "Action",
      cell: row => (
        <Stack direction="horizontal">
          {
            currentPrivileges.includes("R") &&
            <Button variant="link" className="text-dark link-underline-dark me-2" onClick={() => handleView(row)}>
              View
            </Button>
          }

          { currentPrivileges.includes("R") && currentPrivileges.includes("U") && <div className="vr my-2"></div> }

          {
            currentPrivileges.includes("U") &&
            <>
              <Button variant="link" onClick={() => handleEdit(row)} className="me-2">
                Edit
              </Button>
              {!["SO_002", "SO_007", "SO_008", "SO_009", "SO_010"].includes(row.STATUS_ID) && (
                <>
                  <div className="vr my-2"></div>
                  <Button variant="link" className="text-danger link-underline-danger" onClick={() => handleCancel(row)}>
                    Cancel
                  </Button>
                </>
              )}
            </>
          }
        </Stack>
      ),
      width: "250px",
    },
  ]

  const fetchData =useCallback(() => {
    setLoading(true);
    const params = {
      filter: searchTermRequest,
      pageNumber: currentPage, 
      pageSize:perPage,
      status: filterStatus,
      deliveryDateFrom: dateRange.startDate,
      deliveryDateTo: dateRange.endDate,
      sortBy:sortObject.sortBy,
      order:sortObject.order
    }
    getListHistoryOrder(params).then(res=>{
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
  },[currentPage, dateRange, sortObject, filterStatus, searchTermRequest])
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const fetchDataGetStatus =useCallback(() => {
    getStatusCountAdmin().then(res=>{
      const data = res.data.data
      setListDataStatusButton(data)
    }).catch(err=>{
      const response = err.response.data
      setListData(response.data || [])
    })
  },[])
  
  useEffect(() => {
    fetchDataGetStatus();
  }, [fetchDataGetStatus]);

  useEffect(() => {
  debounceSearchRequestRef.current = _.debounce((value) => {
    setCurrentPage(1);
    setSearchTermRequest(value);
  }, 500);
  }, [searchTermRequest]);

  const handleSearchRequest = (e, from) => {
    if(from == "onchange"){
      setCurrentSearchRequest(e.target.value);
      debounceSearchRequestRef.current(e.target.value);
    }else{
      setCurrentPage(1);
      setSearchTermRequest(currentSearchRequest);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSortObject({
      sortBy: column.sortField,
      order: sortDirection
    })
  }

  const handleView = (data) => {
    const orderId = data.REQUEST_NUMBER
    const idEncrypt = encryptDataId(orderId, "view")
		History.navigate(`${objectRouterInquiry.viewOrderHistoryList.path}?q=${idEncrypt}`);
  }

  const handleEdit = (data) => {
		// History.navigate(`${objectRouterMasterPage.editProductPromo.path}?q=${id}`);
    const orderId = data.REQUEST_NUMBER
    const idEncrypt = encryptDataId(orderId, "edit")
		History.navigate(`${objectRouterInquiry.editOrderHistoryList.path}?q=${idEncrypt}`);
	};

  const fnCancel = (data) => {
    dispatch(setShowLoadingScreen(true))

    const orderId = data.REQUEST_NUMBER
    cancelOrderInquiry(orderId).then((res)=>{
      if(res.data.data){
        toast.success(res.data.message)
        fetchData();
      }
    }).finally(()=>{
      dispatch(setShowLoadingScreen(false))
    })
  }

  const handleCancel = (data) => {
    dispatch(setShowModalGlobal({
      show: true,
      content: {
        captionText: `This action will cancel your current request and can’t be changed`,
        questionText: "Are you sure you want to cancel this order?",
        buttonLeftText: "Yes, Cancel",
        buttonRightText: "No, Go Back",
        buttonLeftFn: ()=>fnCancel(data),
        buttonRightFn: null
      }
    }))
  }

  return (
		<Container fluid id="list-request-transaction-page">
			<CardComponent
				title={`Admin AMNT - Search Request`}
				type="index"
			>
        <div className="content my-3">
          <div className="my-4">
            <Stack direction="horizontal" className="flex-wrap" gap={3}>
              <BundleCardStatus notifCount={listDataStatusButton}/>
            </Stack>
          </div>
          <Row className="my-2">
						<Col xl={3} md={6}>
							<InputSearchComponent
                label="Request"
                value={currentSearchRequest}
                onChange={(e) => handleSearchRequest(e, "onchange")}
                placeholder="Search Request..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearchRequest(null, "button")}
                formGroupClassName={"inputRequest"}
								labelXl="12"
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
                customLabelFrom={"Delivery Date From"}
                customLabelTo={"Delivery Date To"}
							/>
						</Col>
            <Col xl={2} md={4}>
              <InputDropdownComponent
                onChange={(e) => setFilterStatus(e.target.value)}
                value={filterStatus}
                label="Status"
                listDropdown={statusOrder}
                labelXl="12"
                valueIndex
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
              filter: searchTermRequest,
              pageNumber: currentPage, 
              pageSize:perPage,
              status: filterStatus,
              deliveryDateFrom: dateRange.startDate,
              deliveryDateTo: dateRange.endDate,
              sortBy:sortObject.sortBy,
              order:sortObject.order
						}}
						exportFileName={"list-order-history"}
            exportFn={getListHistoryOrder}
					/>
        </div>
      </CardComponent>
    </Container>
  );
};

export default OrderHistoryListPage;