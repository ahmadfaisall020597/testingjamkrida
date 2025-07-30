import { useCallback, useEffect, useRef, useState } from "react";
import { Col, Image, Modal, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { setSelectableModalQuery, setShowModalQuery } from "src/utils/store/globalSlice";
import LoadingSpinner from "./spinnerComponent";
import InputSearchComponent from "./inputSearchComponent";
import { FaSearch } from "react-icons/fa";
import closeButton from "src/assets/image/close_button_gray.png"
import _ from "lodash";

const ModalQuerySearch = () =>{
  const dispatch = useDispatch()
  const [totalRows, setTotalRows] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSearch, setCurrentSearch] = useState("");
  const [sortObject, setSortObject] = useState({
    sortBy: "",
    order: "asc"
  });
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const perPage = 10
  const { showModalQuery, contentModalQuery } = useSelector(state => state.global);
  const debounceSearchRef = useRef(null);

  const fetchData =useCallback(() => {
    setLoading(true);
    const params = {
      pageNumber: currentPage, 
			pageSize:perPage,
			[contentModalQuery?.searchKey]:searchTerm,
			sortBy:sortObject.sortBy,
			order:sortObject.order,
      ...contentModalQuery?.params
    }
    if(typeof contentModalQuery?.data === "function"){
      contentModalQuery?.data(params).then(res=>{
        const data = res.data
        if(contentModalQuery?.usingPaginationServer){
          setTotalRows(res.data.totalData)
          setListData(data.data)
        }else{
          setListData(data.data)
        }
        setLoading(false)
      }).catch(err=>{
        const response = err.response.data
        setTotalRows(response.totalData)
        setListData(response.data || [])
        setLoading(false)
      })
    }
  },[currentPage, searchTerm, sortObject, contentModalQuery])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if(!showModalQuery){
      setCurrentSearch("");
      setListData([]);
      setSearchTerm("");
      setCurrentPage(1);
      setTotalRows(0);
      setSortObject({
        sortBy: "",
        order: "asc"
      });
    }
  },[showModalQuery])

  const handleSort = (column, sortDirection) => {
    setSortObject({
      sortBy: column.sortField,
      order: sortDirection
    })
  }

  const handleRowClicked = (row)=>{
    dispatch(setSelectableModalQuery({data: row, title: contentModalQuery?.title, params:contentModalQuery?.paramsReturn}))
    dispatch(setShowModalQuery({show: false}))
  }

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

  const onCloseModal = ()=>{
    dispatch(setShowModalQuery({show: false}))
  }

  return(
    <Modal
      show={showModalQuery}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={()=>onCloseModal()}
    >
      <Modal.Body className="position-relative">
        <div role="button" className="position-absolute" onClick={()=>onCloseModal()} style={{right:"12px"}}>
          <Image src={closeButton} />
        </div>
        <div className="p-2">
          <Modal.Title id="contained-modal-title-vcenter" className="mb-2">
            {contentModalQuery?.title}
          </Modal.Title>
          <Row>
            <Col sm="5">
              <InputSearchComponent
                label={contentModalQuery?.searchLabel || "Search Data"}
                value={currentSearch}
                onChange={(e) => handleSearch(e, "onchange")}
                placeholder="Search..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearch(null, "button")}
                formGroupClassName={"searchModalQueryTemplate"}
                labelXl="12"
                
              />
            </Col>
          </Row>
          <div>
            <DataTable
              columns={contentModalQuery?.columnConfig}
              data={listData}
              pagination
              paginationServer={contentModalQuery?.usingPaginationServer}
              paginationTotalRows={totalRows}
              paginationPerPage={10}
              paginationComponentOptions={{noRowsPerPage: true}}
              highlightOnHover
              pointerOnHover
              onChangePage={page => setCurrentPage(page)}
              progressPending={loading}
              progressComponent={<LoadingSpinner color="secondary" />}
              persistTableHead
              sortServer
              onSort={(selectedColumn, sortDirection)=>handleSort(selectedColumn, sortDirection)}
              responsive
              onRowClicked={(row)=>handleRowClicked(row)}
              striped
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalQuerySearch;