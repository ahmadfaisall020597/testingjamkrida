/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Card, Col, Container, Row, Stack, Table } from "react-bootstrap";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import CardComponent from "src/components/partial/cardComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import { FaSearch } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { MdOutlineAddCircle } from "react-icons/md";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import DataTable from "react-data-table-component";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { RiEditBoxFill } from "react-icons/ri";
import { setListData } from "./productPromoSlice";
import { History } from "src/utils/router";
import ButtonComponent from "src/components/partial/buttonComponent";
import InputComponent from "src/components/partial/inputComponent";
import _ from "lodash";
import InputDateRangeComponent from "src/components/partial/inputDateRangeComponent";
import moment from "moment";
import TableComponent from "src/components/partial/tableComponent";
import { editProductPromo, getAllForExportProductPromo, getListProductPromo } from "src/utils/api/apiMasterPage";
import { toast } from "react-toastify";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";


const ProductPromo = () => {
	const currentPrivileges = usePrivileges()
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { listData } = useSelector(state => state.productPromo);

	const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
	const [sortObject, setSortObject] = useState({
    sortBy: "",
    order: "asc"
  });

	const [currentSearchTenantName, setCurrentSearchTenantName] = useState("");
	const [currentSearchProductName, setCurrentSearchProductName] = useState("");

  const [searchTermTenantName, setSearchTermTenantName] = useState("");
	const [searchTermProductName, setSearchTermProductName] = useState("");
	const [dateRange, setDateRange] = useState({
		startDate: moment().format('yyyy-MM-DD'),
		endDate: moment().format('yyyy-MM-DD')
	});

	const [loading, setLoading] = useState(false);
	const debounceSearchTenantNameRef = useRef(null);
	const debounceSearchProductNameRef = useRef(null);
	const perPage = 10

	const columnsConfig = [
    {
      name: "Product ID",
			cell: row =>(
        <Link to={`${objectRouterMasterPage.viewProductPromo.path}?q=${row.PROMO_ID}`}>{row.PRODUCT_ID}</Link>
      ),
      sortable: true,
      sortField: "PRODUCT_ID",
    },
    {
      name: "Product Name",
      selector: row => row.PRODUCT_NAME,
      sortable: true,
      sortField: "PRODUCT_NAME",
			wrap: true
    },
    {
      name: "Type",
      selector: row => row.TYPE_PRODUCT,
      sortable: true,
      sortField: "TYPE_PRODUCT",
			wrap: true
    },
    {
      name: "Tenant",
      selector: row => row.TENANT_NAME,
      sortable: true,
      sortField: "TENANT_NAME",
			wrap: true
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
						<Button variant="link" onClick={() => handleEdit(row.PROMO_ID)} className="me-2">
							<Stack direction="horizontal" gap={2}>
								<RiEditBoxFill />
								<div>Edit</div>
							</Stack>
						</Button>
					}
					{
						currentPrivileges.includes('U') && currentPrivileges.includes('D') && <div className="vr my-2"></div>
					}
					{
						currentPrivileges.includes('D') &&
							<Button variant="link" onClick={() => handleActiveInactive(row)}>
								Set {row.STATUS? 'Inactive': 'Active'}
							</Button>
					}
        </Stack>
      ),
      width: "240px",
    },
  ];

	const fetchData =useCallback(() => {
		setLoading(true);
		const params = {
			pageNumber: currentPage, 
			pageSize:perPage,
			tenantName:searchTermTenantName,
			productName:searchTermProductName,
			fromDate: dateRange.startDate,
			thruDate: dateRange.endDate,
			sortBy:sortObject.sortBy,
			order:sortObject.order
		}
		getListProductPromo(params).then(res=>{
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
	},[currentPage, dispatch, searchTermTenantName, sortObject, searchTermProductName, dateRange])

	useEffect(() => {
		fetchData();
	}, [fetchData]);
	
	useEffect(() => {
		debounceSearchTenantNameRef.current = _.debounce((value) => {
			setCurrentPage(1);
			setSearchTermTenantName(value);
		}, 500);
	}, [searchTermTenantName]);

	const handleSearchTenantName = (e, from) => {
		if(from == "onchange"){
			setCurrentSearchTenantName(e.target.value);
			debounceSearchTenantNameRef.current(e.target.value);
		}else{
			setCurrentPage(1);
			setSearchTermTenantName(currentSearchTenantName);
		}
	};

	useEffect(() => {
		debounceSearchProductNameRef.current = _.debounce((value) => {
			setCurrentPage(1);
			setSearchTermProductName(value);
		}, 500);
	}, [searchTermProductName]);

	const handleSearchProductName = (e, from) => {
		if(from == "onchange"){
			setCurrentSearchProductName(e.target.value);
			debounceSearchProductNameRef.current(e.target.value);
		}else{
			setCurrentPage(1);
			setSearchTermProductName(currentSearchProductName);
		}
	};

	const handleSort = (column, sortDirection) => {
			setSortObject({
				sortBy: column.sortField,
				order: sortDirection
			})
		}
	
	const handleEdit = (id) => {
		History.navigate(`${objectRouterMasterPage.editProductPromo.path}?q=${id}`);
		// Navigate to edit page or show modal
	};

	const handleActiveInactive = (row) => {
		const id = row.PROMO_ID
		const status = !row.STATUS
		const body = {...row, DETAILS_JSON: JSON.stringify(row.DETAILS), STATUS:status}
		// console.log(body)
		editProductPromo(body, id).then(res=>{
			toast.success(res.data.message)
			fetchData()
		})
		// Show confirmation and handle delete action
	};

	return (
		<Container fluid id="list-product-promo-page">
			<CardComponent
				title={`List Product Promo`}
				type="index"
				sideComponent={
					currentPrivileges.includes("C") &&
					<ButtonComponent
						onClick={() => History.navigate(objectRouterMasterPage.createProductPromo.path)}
						title={"Add New"}
						icon={<MdOutlineAddCircle size={28}/>}
					/>
				}
			>
				<div className="content mb-3">
					<Row className="my-2">
						<Col xl={3} md={6}>
							<InputSearchComponent
                label="Tenant Name"
                value={currentSearchTenantName}
                onChange={(e) => handleSearchTenantName(e, "onchange")}
                placeholder="Search tenant Name..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearchTenantName(null, "button")}
                formGroupClassName={"inputTenantName"}
								labelXl="12"
              />
						</Col>
						<Col xl={3} md={6}>
							<InputSearchComponent
                label="Product Name"
                value={currentSearchProductName}
                onChange={(e) => handleSearchProductName(e, "onchange")}
                placeholder="Search product name..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearchProductName(null, "button")}
                formGroupClassName={"inputProductName"}
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
						exportFn={getAllForExportProductPromo}
						exportParam={{
							tenantName:searchTermTenantName,
							productName:searchTermProductName,
							startDate: dateRange.startDate,
							endDate: dateRange.endDate,
							sortBy:sortObject.sortBy,
							order:sortObject.order
						}}
						exportFileName={"list-product-promo"}
					/>
				</div>
			</CardComponent>
		</Container>
	);
};

export default ProductPromo;
