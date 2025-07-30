import { Col, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import InputSearchComponent from "src/components/partial/inputSearchComponent"
import { FaSearch } from "react-icons/fa"
import { useCallback, useEffect, useRef, useState } from "react"
import _ from "lodash"
import InputDropdownComponent from "src/components/partial/inputDropdownComponent"
import TableComponent from "src/components/partial/tableComponent"
import LoadingSpinner from "src/components/partial/spinnerComponent"
import { setListProduct } from "../TenantSlice"
import { getListProduct } from "src/utils/api/apiMasterPage"
import { toast } from "react-toastify"
export default function ModalContentListAllProduct({
  tenantId
}){
  const columnsConfig = [
    {
      name: "Product ID",
      selector: row => row.PRODUCT_ID,
      sortable: true,
      sortField: "PRODUCT_ID",
    },
    {
      name: "Product Name",
      selector: row => row.PRODUCT_NAME,
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
    },
    {
      name: "Type",
      selector: row => row.TYPE_PRODUCT_DESC,
      sortable: true,
      sortField: "TYPE_PRODUCT",
    }
  ];
  const dispatch = useDispatch()
  const {typeProduct} = useSelector(state=>state.product)
  const {listProduct} = useSelector(state=>state.tenant)
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
	const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [sortObject, setSortObject] = useState({
    sortBy: "",
    order: "asc"
  });
  const [loading, setLoading] = useState(false);
  const debounceSearchRef = useRef(null);
  const perPage = 10

    const fetchData =useCallback(() => {
      setLoading(true);
      if(tenantId){
        const params = {
          pageNumber: currentPage, 
          pageSize:perPage,
          productName:searchTerm,
          sortBy:sortObject.sortBy,
          order:sortObject.order,
          categoryProduct: "",
          typeProduct: type,
          priceStatus: "",
          available: "",
          tenantId: tenantId
        }
        getListProduct(params).then(res=>{
          const data = res.data.data
          setTotalRows(res.data.totalData)
          dispatch(setListProduct(data))
          setLoading(false)
        }).catch(err=>{
          const response = err.response.data
          setTotalRows(response.totalData)
          dispatch(setListProduct(response.data))
          setLoading(false)
        })
      }else{
        toast.error("No Tenant Id")
        setLoading(false)
      }

    },[currentPage, dispatch, searchTerm, sortObject, tenantId, type])
  
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

  return (
    <div>
      <Row className="mt-2">
        <Col xl={4} md={6}>
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
            onChange={(e) => setType(e.target.value)}
            valueIndex
            value={type}
            label="Type"
            listDropdown={typeProduct}
            labelXl="12"
          />
        </Col>
      </Row>
      <div className="table-responsive">
        <TableComponent 
          columns={columnsConfig}
          data={listProduct}
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
        />
      </div>
    </div>
  )
}