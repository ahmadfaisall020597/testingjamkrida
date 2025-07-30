/* eslint-disable no-unused-vars */
import _ from "lodash";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import { toast } from "react-toastify";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import TableComponent from "src/components/partial/tableComponent";
import { editLookupValue, getListLookupValue } from "src/utils/api/apiMasterPage";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import { setListData } from "./lookupValueSetupSlice";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";


const LookupValuePage = () => {
	const currentPrivileges = usePrivileges()
	const dispatch = useDispatch();
	const { listData } = useSelector(state => state.lookupValueSetup);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalRows, setTotalRows] = useState(0);
	const [sortObject, setSortObject] = useState({
		sortBy: "",
		order: "asc"
	});

	const [currentSearch, setCurrentSearch] = useState("");
	const [searchTerm, setSearchTerm] = useState("");

	const [loading, setLoading] = useState(false);
	const debounceSearchRef = useRef(null);
	const perPage = 10

	const columnsConfig = [
    {
      name: "Value ID",
      cell: row =>(
        <Link to={`${objectRouterMasterPage.viewLookupValue.path}?q=${row.LOOKUP_ID}`}>{row.LOOKUP_ID}</Link>
      ),
      sortable: true,
      sortField: "LOOKUP_ID",
			width: "250px",

    },
    {
      name: "Name",
      selector: row => row.LOOKUP_NAME,
      sortable: true,
      sortField: "LOOKUP_NAME",
    },
		{
      name: "Status",
			cell: row =>(
				<div className={`fw-bold text-${row.STATUS? 'success': 'danger'}`}>{row.STATUS? 'Active': 'Inactive'}</div>
      ),
      sortable: true,
      sortField: "STATUS",
    },
    {
      name: "Actions",
      cell: row => (
        <Stack direction="horizontal">
					{
						currentPrivileges.includes('U') &&
						<Button variant="link" onClick={() => handleEdit(row.LOOKUP_ID)} className="me-2">
							<Stack direction="horizontal" gap={2}>
								<RiEditBoxFill />
								<div>Edit</div>
							</Stack>
						</Button>
					}
					{/* {
						currentPrivileges.includes('U') && currentPrivileges.includes('D') && <div className="vr my-2"></div>
					} */}
					{/* {
						currentPrivileges.includes('D') &&
						<Button variant="link" onClick={() => handleActiveInactive(row)}>
							Set {row.STATUS? 'Inactive': 'Active'}
						</Button>
					} */}
        </Stack>
      ),
      width: "250px",
    },
  ];
	

	const fetchData =useCallback(() => {
		setLoading(true);
		const params = {
			pageNumber: currentPage, 
			lookupName:searchTerm,
			pageSize:perPage,
			sortBy:sortObject.sortBy,
			order:sortObject.order
		}
		getListLookupValue(params).then(res=>{
				const data = res.data.data
				setTotalRows(res.data.totalData)
				dispatch(setListData(data))
				setLoading(false)
		}).catch(err=>{
			const response = err.response.data
			setTotalRows(response.totalData)
			dispatch(setListData(response.data))
			setLoading(false)
		})
	},[currentPage, dispatch, searchTerm, sortObject])

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
	
	const handleEdit = (id) => {
		History.navigate(`${objectRouterMasterPage.editlookupValue.path}?q=${id}`);
		// Navigate to edit page or show modal
	};

	const handleActiveInactive = (row) => {
		const id = row.LOOKUP_ID
		const status = !row.STATUS
		const body = {...row, STATUS:status}
		// console.log(body)
		editLookupValue(body, id).then(res=>{
			toast.success(res.data.message)
			fetchData()
		})
		// Show confirmation and handle delete action
	};

	return (
		<Container fluid id="list-lookup-value-page">
			<CardComponent
				title={`List All Lookup Value`}
				type="index"
				sideComponent={
					currentPrivileges.includes('C') &&
					<ButtonComponent
						onClick={() => History.navigate(objectRouterMasterPage.createlookupValue.path)}
						title={"Add New"}
						icon={<MdOutlineAddCircle size={28}/>}
					/>
				}
			>
				<div className="content mb-3">
					<Row className="my-2">
						<Col xl={3} md={6}>
							<InputSearchComponent
                label="Lookup Name"
                value={currentSearch}
                onChange={(e) => handleSearch(e, "onchange")}
                placeholder="Search lookup name..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearch(null, "button")}
                formGroupClassName={"inputDescriptionValue"}
								labelXl="12"
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
						exportFn={getListLookupValue}
						exportParam={{lookupName:searchTerm, sortBy:sortObject.sortBy, order:sortObject.order}}
						exportFileName={"list-lookup-value"}
					/>
				</div>
			</CardComponent>
		</Container>
	);
};

export default LookupValuePage;
