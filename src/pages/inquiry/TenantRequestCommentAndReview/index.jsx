import _ from "lodash"
import moment from "moment"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button, Col, Container, Row, Stack } from "react-bootstrap"
import { FaSearch } from "react-icons/fa"
import { useSelector } from "react-redux"
import CardComponent from "src/components/partial/cardComponent"
import InputSearchComponent from "src/components/partial/inputSearchComponent"
import LoadingSpinner from "src/components/partial/spinnerComponent"
import TableComponent from "src/components/partial/tableComponent"
import { tenantListRequestCommentAndReview } from "src/utils/api/apiTransaction"
import { encryptData } from "src/utils/cryptojs"
import { History } from "src/utils/router"
import objectRouterInquiry from "src/utils/router/objectRouter.inquiry"

const TenantRequestCommentAndReview = () => {
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
  const debounceSearchRef = useRef(null);
  const { profileUsers } = useSelector(state=>state.global)


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
      wrap: true
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
    },
    {
      name: "Rated by Requestor",
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
          <Button variant="link" onClick={() => handleRate(row, false)} className="me-2" disabled={!row.RATED}>
            <Stack direction="horizontal" gap={2}>
              <div>View Detail Rate</div>
            </Stack>
          </Button>
        </Stack>
      ),
      width: "190px",
    },
  ]

  const [selectedTenant, setSelectedTenant] = useState(null);
	useEffect(()=>{
		if(profileUsers?.tenantAdmin){
			setSelectedTenant(profileUsers?.tenantAdmin[0])
		}
	},[profileUsers])


  const fetchData =useCallback(() => {
    if(selectedTenant == null) return
    const params = {
      pageNumber: currentPage, 
      pageSize:perPage,
      productName:searchTerm,
      sortBy:sortObject.sortBy,
      order:sortObject.order,
      tenantId: selectedTenant?.TENANT_ID
    }
    setStateParams(params)
    setLoading(true);
    tenantListRequestCommentAndReview(params).then(res=>{
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
  },[currentPage, searchTerm, sortObject, selectedTenant]);

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
    History.navigate(`${objectRouterInquiry.tenantFormRequestCommentAndReview.path}?q=${encodeURIComponent(stringObjectData)}`);
  }

  return (
		<Container fluid id="list-request-transaction-page">
			<CardComponent
      	title={`${selectedTenant? `${selectedTenant.TENANT_NAME}`: ""}  - List Order`}
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
            exportFn={tenantListRequestCommentAndReview}
            exportParam={stateParams}
          />
        </div>
      </CardComponent>
    </Container>
  )
}

export default TenantRequestCommentAndReview