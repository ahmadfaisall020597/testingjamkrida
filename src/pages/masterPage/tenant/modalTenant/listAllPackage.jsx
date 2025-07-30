import { Col, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import InputSearchComponent from "src/components/partial/inputSearchComponent"
import { FaSearch } from "react-icons/fa"
import { useCallback, useEffect, useRef, useState } from "react"
import _ from "lodash"
import TableComponent from "src/components/partial/tableComponent"
import LoadingSpinner from "src/components/partial/spinnerComponent"
import { setListPackage } from "../TenantSlice"
import { getTenantPackageDetails } from "src/utils/api/apiMasterPage"
export default function ModalContentListAllPackage({
  tenantId
}){
  const columnsConfig = [
    {
      name: "Package ID",
      selector: row => row.PACKAGE_ID,
      sortable: true,
      sortField: "PACKAGE_ID",
    },
    {
      name: "Package Name",
      selector: row => row.PACKAGE_NAME,
      sortable: true,
      sortField: "PACKAGE_NAME",
    },
    {
      name: "Total Category",
      selector: row => row.TOTAL_CATEGORY,
      sortable: true,
      sortField: "TOTAL_CATEGORY",
    }
  ];
  const dispatch = useDispatch()
  const {listPackage} = useSelector(state=>state.tenant)
  const [currentSearch, setCurrentSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
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
      const params = {
        packageName:searchTerm,
        pageNumber: currentPage, 
        pageSize:perPage,
        sortBy:sortObject.sortBy,
        order:sortObject.order,
      }
      getTenantPackageDetails(params, tenantId).then(res=>{
        const data = res.data.data
        setTotalRows(res.data.totalData)
        dispatch(setListPackage(data))
        setLoading(false)
      }).catch(err=>{
        const response = err.response.data
        setTotalRows(response.totalData)
        dispatch(setListPackage(response.data))
        setLoading(false)
      })
    },[currentPage, searchTerm, sortObject.order, sortObject.sortBy, tenantId, dispatch])
  
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
            label="Package name"
            value={currentSearch}
            onChange={(e) => handleSearch(e, "onchange")}
            placeholder="Search Package..."
            componentButton={<FaSearch />}
            buttonOnclick={() =>handleSearch(null, "button")}
            formGroupClassName={"searchPackageName"}
            labelXl="12"
          />
        </Col>
      </Row>
      <div className="table-responsive">
        <TableComponent 
          columns={columnsConfig}
          data={listPackage}
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