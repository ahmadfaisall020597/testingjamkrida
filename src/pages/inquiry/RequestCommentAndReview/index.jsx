import _ from "lodash"
import moment from "moment"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button, Col, Container, Row, Stack } from "react-bootstrap"
import { FaSearch } from "react-icons/fa"
import CardComponent from "src/components/partial/cardComponent"
import InputDropdownComponent from "src/components/partial/inputDropdownComponent"
import InputSearchComponent from "src/components/partial/inputSearchComponent"
import LoadingSpinner from "src/components/partial/spinnerComponent"
import TableComponent from "src/components/partial/tableComponent"
import { getRecommendationTenantTransaction, listRequestCommentAndReview } from "src/utils/api/apiTransaction"
import usePrivileges from "src/utils/auth/getCurrentPrivilege"
import { encryptData } from "src/utils/cryptojs"
import { History } from "src/utils/router"
import objectRouterInquiry from "src/utils/router/objectRouter.inquiry"

const RequestCommentAndReview = () => {
  const currentPrivileges = usePrivileges();
  const [sortObject, setSortObject] = useState({
    sortBy: "ORDER_ID",
    order: "desc"
  });
	const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [listData, setListData] = useState([]);
  const perPage = 10
  const [stateParams, setStateParams] = useState({});

  const [currentSearch, setCurrentSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTenant, setCurrentTenant] = useState("");
  const [listTenant, setListTenant] = useState([]);
  const debounceSearchRef = useRef(null);

  const columnConfig = [
    {
      name: "Order ID",
			selector: row => row.ORDER_ID,
      sortable: true,
      sortField: "ORDER_ID",
			width: "180px",
    },
    {
      name: "Sequence",
			selector: row => row.SEQUENCE_VIEW,
      sortable: true,
      sortField: "SEQUENCE_VIEW",
			width: "140px",
    },
    {
      name: "Tenant",
			selector: row => row.TENANT_NAME,
      sortable: true,
      sortField: "TENANT_NAME",
			width: "150px",
    },
    {
      name: "Item",
			selector: row => `${row.ITEM} Item`,
      sortable: true,
      sortField: "ITEM",
			width: "150px",
    },
    {
      name: "Quantity Order",
			selector: row => row.QUANTITY_ORDER,
      sortable: true,
      sortField: "QUANTITY_ORDER",
			width: "170px",
    },
    {
      name: "Product",
			selector: row => row.PRODUCT_NAME,
      sortable: true,
      sortField: "PRODUCT_NAME",
			width: "150px",
      wrap: true
    },
    {
      name: "You Rated",
			selector: row => row.RATED ? `${row.RATED} Star` : "-",
      sortable: true,
      sortField: "RATED",
			width: "150px",
    },
    {
      name: "Delivery Date",
			selector: row => moment(row.DELIVERY_DATE).format("DD MMM YYYY"),
      sortable: true,
      sortField: "DELIVERY_DATE",
			width: "160px",
    },
    {
      name: "Actions",
      cell: row => (
        <Stack direction="horizontal">
          {row.RATED ?
            currentPrivileges.includes("R") &&
            <Button variant="link" onClick={() => handleRate(row, false)} className="me-2 link-secondary">
              <Stack direction="horizontal" gap={2}>
                <div>View Detail Rate</div>
              </Stack>
            </Button>
          :
            currentPrivileges.includes("C") &&
            <Button variant="link" onClick={() => handleRate(row, true)} className="me-2">
              <Stack direction="horizontal" gap={2}>
                <div>Rate Your Food</div>
              </Stack>
            </Button>
          }

        </Stack>
      ),
      width: "220px",
    },
  ]

  const fetchTenantData =useCallback(() => {
    setListTenant([{value:"", label:"Loading..."}])
    const params = {
      tenantName:"",
    }
    getRecommendationTenantTransaction(params).then(res=>{
      const data = res.data.data
      const listTenantData = data.map(item => ({ value: item.TENANT_ID, label: item.TENANT_NAME }))
      setListTenant([{value:"", label:"ALL"}, ...listTenantData])
    }).catch(err=>{
      const response = err.response.data
      setListTenant(response.data)
    })
  },[])

  useEffect(() => {
    fetchTenantData();
  }, [fetchTenantData]);

  const fetchData =useCallback(() => {
    const params = {
      pageNumber: currentPage, 
      pageSize:perPage,
      productName:searchTerm,
      sortBy:sortObject.sortBy,
      order:sortObject.order,
      tenantId: currentTenant
    }
    setStateParams(params)
    setLoading(true);
    listRequestCommentAndReview(params).then(res=>{
      const data = res.data.data
      setTotalRows(res.data.totalData)
      setListData(data)
      setLoading(false)
    }).catch(err=>{
      const response = err.response.data
      setTotalRows(response.totalData)
      setListData(response.data)
      setLoading(false)
    })
  },[currentPage, searchTerm, sortObject, currentTenant]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    debounceSearchRef.current = _.debounce((value) => {
      setCurrentPage(1);
      setSearchTerm(value);
    }, 500);
  }, [searchTerm]);

  const handleSearch = (e, from) => {
    if(from == "onchange"){
      setCurrentSearch(e.target.value);
      debounceSearchRef.current(e.target.value);
    }else{
      setCurrentPage(1);
      setSearchTerm(currentSearch);
    }
  };

  const handleSort = (column, sortDirection) => {
    setSortObject({
      sortBy: column.sortField,
      order: sortDirection
    })
  }

  const handleRate = (row, isEdit) => {
    const stringObjectData = encryptData({...row, isEdit: isEdit})
    History.navigate(`${objectRouterInquiry.formRequestCommentAndReview.path}?q=${encodeURIComponent(stringObjectData)}`);
  }

  return (
		<Container fluid id="list-request-transaction-page">
			<CardComponent
				title={`List Order`}
				type="index"
			>
        <div className="content my-3">
          <Row className="my-2">
						<Col xl={3} md={6}>
							<InputSearchComponent
                label="Product name"
                value={currentSearch}
                onChange={(e) => handleSearch(e, "onchange")}
                placeholder="Search product..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearch(null, "button")}
                formGroupClassName={"searchProductName"}
								labelXl="12"
              />
						</Col>
            <Col xl={3} md={6}>
              <InputDropdownComponent
								onChange={(e) => setCurrentTenant(e.target.value)}
								value={currentTenant}
								label="Tenant"
								listDropdown={listTenant}
								labelXl="12"
								valueIndex
							/>
            </Col>
          </Row>
          <TableComponent
            columns={columnConfig}
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
            exportFn={listRequestCommentAndReview}
            exportParam={stateParams}
          />
        </div>
      </CardComponent>
    </Container>
  )
}

export default RequestCommentAndReview