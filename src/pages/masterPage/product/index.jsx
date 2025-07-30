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
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { RiEditBoxFill } from "react-icons/ri";
import { setListData } from "./productSlice";
import { History } from "src/utils/router";
import { setSelectableModalQuery } from "src/utils/store/globalSlice";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import ButtonComponent from "src/components/partial/buttonComponent";
import _, { wrap } from "lodash";
import TableComponent from "src/components/partial/tableComponent";
import { getListProduct } from "src/utils/api/apiMasterPage";
import { setStylePriceStatus } from "./productFn";
import ButtonGroupTenantComponent from "src/components/partial/buttonTenantComponent";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";

const ProductPage = () => {
	const currentPrivileges = usePrivileges()
	const dispatch = useDispatch();
	const { listData, typeProduct, categoryProduct, priceStatusProduct } = useSelector(state => state.product);

	const { profileUsers, listRoleUsers, UsersRoleFunctionRequest } = useSelector(state=>state.global)
	
	const adminRole = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_01")
	const campServices = listRoleUsers?.find(item=>item.CODE_ID==="ROLE_02")
  const isIncludeAdminRole = UsersRoleFunctionRequest?.find(item=>item.RoleId==adminRole?.SHORT_DESC)
	const isIncludeCampService = UsersRoleFunctionRequest?.find(item=>item.RoleId==campServices?.SHORT_DESC)

	const [selectedTenant, setSelectedTenant] = useState(null);

	const [currentSearch, setCurrentSearch] = useState("");
	const [currentCategory, setCurrentCategory] = useState("");
	const [type, setType] = useState("");
	const [priceStatus, setPriceStatus] = useState("");
	const [available, setAvailable] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
	const [sortObject, setSortObject] = useState({
    sortBy: "",
    order: "asc"
  });
	const [loading, setLoading] = useState(false);
	const [stateParams, setStateParams] = useState({});

	const debounceSearchRef = useRef(null);
	const perPage = 10

	const columnsConfig = [
		{
      name: "Tenant Name",
			selector: row => row.TENANT_NAME,
      sortable: false,
      sortField: "TENANT_NAME",
			width: "170px",
			wrap: true
    },
    {
      name: "Product ID",
			cell: row =>(
        <Link to={`${objectRouterMasterPage.viewProduct.path}?q=${row.PRODUCT_ID}`}>{row.PRODUCT_ID}</Link>
      ),
      sortable: true,
      sortField: "PRODUCT_ID",
			width: "140px",
    },
    {
      name: "Product",
      selector: row => row.PRODUCT_NAME,
      sortable: true,
      sortField: "PRODUCT_NAME",
			wrap: true
    },
		{
      name: "Status",
      cell: row =>(
				<div className={`fw-bold text-${row.STATUS_PRODUCT? 'success': 'danger'}`}>{row.STATUS_PRODUCT? 'Active': 'Inactive'}</div>
      ),
      sortable: true,
      sortField: "STATUS_PRODUCT",
			width: "110px",
    },
		{
      name: "Available",
      selector: row => row.AVAILABLE ? 'Yes': 'No',
      sortable: true,
      sortField: "AVAILABLE",
			width: "150px",
    },
    {
      name: "Category",
      selector: row => row.CATEGORY_PRODUCT_DESC,
      sortable: true,
      sortField: "CATEGORY_PRODUCT",
			wrap: true,
			width: "150px",
    },
		{
      name: "Type",
      selector: row => row.TYPE_PRODUCT_DESC,
      sortable: true,
      sortField: "TYPE_PRODUCT",
			width: "100px",
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
						<Button variant="link" onClick={() => handleEdit(row.PRODUCT_ID)} className="me-2">
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
			productName:searchTerm,
			sortBy:sortObject.sortBy,
			order:sortObject.order,
			categoryProduct: currentCategory,
			typeProduct: type,
			priceStatus: priceStatus,
			available: available,
			tenantId: tenantAdmin?.[0] ? tenantAdmin[0].TENANT_ID : ""
		}
		setSelectedTenant(tenantAdmin?.[0] || null)
		setStateParams(params)
		getListProduct(params).then(res=>{
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
	},[currentPage, dispatch, searchTerm, sortObject, currentCategory, type, priceStatus, available])

	useEffect(() => {
		let tenantAdmin = profileUsers?.tenantAdmin
		if(isIncludeAdminRole || isIncludeCampService){
			tenantAdmin = null
		}

		fetchData(tenantAdmin);
	}, [fetchData, isIncludeAdminRole, isIncludeCampService, profileUsers]);

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
		History.navigate(`${objectRouterMasterPage.editProduct.path}?q=${id}`);
		// Navigate to edit page or show modal
	};

	const showButtonAddNew = () =>{
		if(currentPrivileges.includes("C")){
			return (
				<ButtonComponent
					onClick={() => History.navigate(objectRouterMasterPage.createProduct.path)}
					title={"Add New"}
					icon={<MdOutlineAddCircle size={28}/>}
				/>
			)
		}
	}

	return (
		<Container fluid id="list-product-page">
			<CardComponent
				title={`List Product ${selectedTenant? `- ${selectedTenant.TENANT_NAME}`: ""}`}
				type="index"
				sideComponent={showButtonAddNew()}
			>
				<div className="content mb-3">
					{/* not used since per user only have one tenant admin */}
					{/* <ButtonGroupTenantComponent className={"my-3"} listTenant={profileUsers?.tenantAdmin} selectedTenant={selectedTenant} onChangeTenant={(tenant)=>setSelectedTenant(tenant)}/> */}
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
						<Col xl={2} md={6}>
							<InputDropdownComponent
								onChange={(e) => setCurrentCategory(e.target.value)}
								value={currentCategory}
								label="Category"
								listDropdown={categoryProduct}
								labelXl="12"
								valueIndex
							/>
						</Col>
						<Col xl={2} md={6}>
							<InputDropdownComponent
								onChange={(e) => setType(e.target.value)}
								value={type}
								label="Type"
								listDropdown={typeProduct}
								labelXl="12"
								valueIndex
							/>
						</Col>
						<Col xl={2} md={6}>
							<InputDropdownComponent
								onChange={(e) => setPriceStatus(e.target.value)}
								value={priceStatus}
								label="Price Status"
								listDropdown={priceStatusProduct}
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
						needExport={true}
						exportFn={getListProduct}
						exportParam={stateParams}
					/>
				</div>
			</CardComponent>
		</Container>
	);
};

export default ProductPage;
