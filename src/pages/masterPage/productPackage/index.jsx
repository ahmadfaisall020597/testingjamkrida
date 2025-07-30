/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Button, Card, Col, Container, Row, Stack } from "react-bootstrap";
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
import { setListData } from "./productPackageSlice";
import { History } from "src/utils/router";
import ButtonComponent from "src/components/partial/buttonComponent";
import InputComponent from "src/components/partial/inputComponent";
import _, { wrap } from "lodash";
import TableComponent from "src/components/partial/tableComponent";
import { setStylePriceStatus } from "../product/productFn";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import { getListProductPackage } from "src/utils/api/apiMasterPage";
import ButtonGroupTenantComponent from "src/components/partial/buttonTenantComponent";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";
import { fnGetTenantDetails } from "../tenant/TenantFn";


const ProductPackage = () => {
	const currentPrivileges = usePrivileges()
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { priceStatusProduct } = useSelector(state => state.product);
	const { listData } = useSelector(state => state.productPackage);
	const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);

	const [currentSearchTenantName, setCurrentSearchTenantName] = useState("");
	const [currentSearchProductPackageName, setCurrentSearchProductPackageName] = useState("");

  const [searchTermTenantName, setSearchTermTenantName] = useState("");
	const [searchTermProductPackageName, setSearchTermProductPackageName] = useState("");

	const [statusFilter, setStatusFilter] = useState("");
	const [available, setAvailable] = useState("");

	const [sortObject, setSortObject] = useState({
    sortBy: "",
    order: "asc"
  });
	const [loading, setLoading] = useState(false);
	const debounceSearchTenantNameRef = useRef(null);
	const debounceSearchProductPackageNameRef = useRef(null);
	const perPage = 10

	const { profileUsers, listRoleUsers, UsersRoleFunctionRequest } = useSelector(state=>state.global)

	const adminRole = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_01")
	const campServices = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_02")
  const isIncludeAdminRole = UsersRoleFunctionRequest?.find(item=>item.RoleId==adminRole?.SHORT_DESC)
	const isIncludeCampService = UsersRoleFunctionRequest?.find(item=>item.RoleId==campServices?.SHORT_DESC)

	const [selectedTenant, setSelectedTenant] = useState(null);

	const [canAddPackage, setCanAddPackage] = useState(true);

	const columnsConfig = [
    {
      name: "Package ID",
      cell: row =>(
        <Link to={`${objectRouterMasterPage.viewProductPackage.path}?q=${row.PACKAGE_ID}`}>{row.PACKAGE_ID}</Link>
      ),
			// selector: row => row.PACKAGE_ID,
      sortable: true,
      sortField: "PACKAGE_ID",
    },
    {
      name: "Package Name",
      selector: row => row.PACKAGE_NAME,
      sortable: true,
      sortField: "PACKAGE_NAME",
			wrap: true
    },
		{
      name: "Status",
      cell: row =>(
				<div className={`fw-bold text-${row.STATUS? 'success': 'danger'}`}>{row.STATUS? 'Active': 'Inactive'}</div>
      ),
      sortable: true,
      sortField: "STATUS",
			width: "110px",
    },
		{
      name: "Available",
      selector: row => row.AVAILABLE ? 'Yes': 'No',
      sortable: true,
      sortField: "AVAILABLE",
    },
    {
      name: "Tenant Name",
      selector: row => row.TENANT_NAME,
      sortable: true,
      sortField: "TENANT_NAME",
			wrap: true
    },
		{
			name: "Price Status",
			cell: row =>(
				<div className={`fw-bold text-capitalize`} style={setStylePriceStatus(row.PRICE_STATUS, priceStatusProduct)}>{row.PRICE_STATUS_DESC}</div>
			),
			sortable: true,
			sortField: "PRICE_STATUS",
			width: "160px",
		},
    {
      name: "Actions",
      cell: row => (
        <Stack direction="horizontal">
					{
						currentPrivileges.includes("U")&&
						<Button variant="link" onClick={() => handleEdit(row.PACKAGE_ID)} className="me-2">
							<Stack direction="horizontal" gap={2}>
								<RiEditBoxFill />
								<div>Edit</div>
							</Stack>
						</Button>
					}
          
        </Stack>
      ),
      width: "130px",
    },
  ];

	const fetchData =useCallback((tenantAdmin) => {
		setLoading(true);
		const params = {
			pageNumber: currentPage, 
			pageSize:perPage,
			sortBy:sortObject.sortBy,
			order:sortObject.order,
			packageName:searchTermProductPackageName,
			tenantName:searchTermTenantName,
			status: statusFilter,
			available: available,
			tenantId: tenantAdmin?.[0] ? tenantAdmin[0].TENANT_ID : ""
		}
		setSelectedTenant(tenantAdmin?.[0] || null)
		getListProductPackage(params).then(res=>{
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
	},[available, currentPage, searchTermProductPackageName, searchTermTenantName, sortObject, statusFilter, dispatch])

	useEffect(() => {
		let tenantAdmin = profileUsers?.tenantAdmin
		if(isIncludeAdminRole || isIncludeCampService){
			tenantAdmin = null
		}

		fetchData(tenantAdmin);
	}, [fetchData, isIncludeAdminRole, isIncludeCampService, profileUsers]);

	const fetchDataDetailTenant = useCallback((tenantId)=>{
		fnGetTenantDetails(tenantId).then(res=>{
			if(res){
				const availableAddPackage = res.ADD_PACKAGE
				setCanAddPackage(availableAddPackage)
			}
		})
	},[])

	useEffect(()=>{
		if(selectedTenant){
			fetchDataDetailTenant(selectedTenant?.TENANT_ID)
		}
	},[fetchDataDetailTenant, selectedTenant])

	
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
		debounceSearchProductPackageNameRef.current = _.debounce((value) => {
			setCurrentPage(1);
			setSearchTermProductPackageName(value);
		}, 500);
	}, [searchTermProductPackageName]);

	const handleSearchProductPackageName = (e, from) => {
		if(from == "onchange"){
			setCurrentSearchProductPackageName(e.target.value);
			debounceSearchProductPackageNameRef.current(e.target.value);
		}else{
			setCurrentPage(1);
			setSearchTermProductPackageName(currentSearchProductPackageName);
		}
	};

	const handleSort = (column, sortDirection) => {
		setSortObject({
			sortBy: column.sortField,
			order: sortDirection
		})
	}
	
	const handleEdit = (id) => {
		History.navigate(`${objectRouterMasterPage.editProductPackage.path}?q=${id}`);
		// Navigate to edit page or show modal
	};

	return (
		<Container fluid id="list-product-package-page">
			<CardComponent
				title={`List Product Package ${selectedTenant? `- ${selectedTenant.TENANT_NAME}`: ""}`}
				type="index"
				sideComponent={
					currentPrivileges.includes("C") && canAddPackage &&
					<ButtonComponent
						onClick={() => History.navigate(objectRouterMasterPage.createProductPackage.path)}
						title={"Add New"}
						icon={<MdOutlineAddCircle size={28}/>}
					/>
				}
			>
				<div className="content mb-3">
					{/* not used since per user only have one tenant admin */}
					{/* <ButtonGroupTenantComponent className={"my-3"} listTenant={profileUsers?.tenantAdmin} selectedTenant={selectedTenant} onChangeTenant={(tenant)=>setSelectedTenant(tenant)}/> */}
					<Row className="my-2">
						<Col xl={3} md={6}>
							<InputSearchComponent
                label="Tenant Name"
                value={currentSearchTenantName}
                onChange={(e) => handleSearchTenantName(e, "onchange")}
                placeholder="Search tenant..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearchTenantName(null, "button")}
                formGroupClassName={"inputTenantName"}
								labelXl="12"
              />
						</Col>
						<Col xl={3} md={6}>
							<InputSearchComponent
                label="Package Name"
                value={currentSearchProductPackageName}
                onChange={(e) => handleSearchProductPackageName(e, "onchange")}
                placeholder="Search package..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearchProductPackageName(null, "button")}
                formGroupClassName={"inputProductPackageName"}
								labelXl="12"
              />
						</Col>
						<Col xl={2} md={6}>
							<InputDropdownComponent
								onChange={(e) => setStatusFilter(e.target.value)}
								value={statusFilter}
								label="Status"
								listDropdown={[
									{ value: "", label: "All" },
									{ value: true, label: "Active" },
									{ value: false, label: "Inactive" },
								]}
								labelXl="12"
								valueIndex
							/>
						</Col>
						<Col xl={2} md={6}>
							<InputDropdownComponent
								listDropdown={[
									{ value: "", label: "All" },
									{ value: true, label: "Yes" },
									{ value: false, label: "No" },
								]}
								valueIndex
								label="Available"
								labelXl="12"
								value={available}
								onChange={(e) => setAvailable(e.target.value)}
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
						needExport
						exportFn={getListProductPackage}
						exportParam={{
							sortBy:sortObject.sortBy,
							order:sortObject.order,
							packageName:searchTermProductPackageName,
							tenantName:searchTermTenantName,
							status: statusFilter,
							available: available
						}}
						exportFileName={"list-product-package"}
					/>
				</div>
			</CardComponent>
		</Container>
	);
};

export default ProductPackage;
