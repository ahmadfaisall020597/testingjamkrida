import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import TableComponent from "src/components/partial/tableComponent";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import { setListData } from "./TenantSlice";
import { getListTenant } from "src/utils/api/apiMasterPage";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";
import { fnStoreEditTenant } from "./TenantFn";


const TenantIndexPage = () => {
	const dispatch = useDispatch();
	const currentPrivileges = usePrivileges();
	const { listData } = useSelector(state => state.tenant);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalRows, setTotalRows] = useState(0);
	const [sortObject, setSortObject] = useState({
		sortBy: "",
		order: "asc"
	});

	const [currentSearchTenantName, setCurrentSearchTenantName] = useState("");
	const [searchTermTenantName, setSearchTermTenantName] = useState("");

	const [loading, setLoading] = useState(false);
	const debounceSearchTenantNameRef = useRef(null);
	const perPage = 10

	const columnsConfig = [
    {
      name: "Tenant ID",
			selector: row=> row.TENANT_ID,
      sortable: true,
      sortField: "TENANT_ID",
			width: "140px"
    },
    {
      name: "Name",
			cell: row =>(
        <Link to={`${objectRouterMasterPage.viewTenant.path}?q=${row.TENANT_ID}`}>{row.TENANT_NAME}</Link>
      ),
      sortable: true,
      sortField: "TENANT_NAME",
			wrap: true
    },
    {
      name: "Location",
      selector: row => row.ADDRESS,
      sortable: true,
      sortField: "ADDRESS",
			wrap: true
    },
		{
      name: "Status",
      cell: row =>(
				<div className={`fw-bold text-${row.STATUS? 'success': 'danger'}`}>{row.STATUS? 'Active': 'Inactive'}</div>
      ),
      sortable: true,
      sortField: "STATUS",
			width: "150px"
    },
    {
      name: "Actions",
      cell: row => (
        <Stack direction="horizontal">
					{
						currentPrivileges.includes('U') &&
						<Button variant="link" onClick={() => handleEdit(row.TENANT_ID)} className="me-2">
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
			width: "250px",
    },
  ];
	

	const fetchData =useCallback(() => {
		setLoading(true);
		const params = {
			pageNumber: currentPage, 
			pageSize:perPage,
			tenantName:searchTermTenantName,
			sortBy:sortObject.sortBy,
			order:sortObject.order
		}
		getListTenant(params).then(res=>{
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
	},[currentPage, dispatch, searchTermTenantName, sortObject])

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

	const handleSort = (column, sortDirection) => {
			setSortObject({
				sortBy: column.sortField,
				order: sortDirection
			})
		}
	
	const handleEdit = (id) => {
		History.navigate(`${objectRouterMasterPage.editTenant.path}?q=${id}`);
		// Navigate to edit page or show modal
	};

	const handleActiveInactive = (row) => {
		const id = row.TENANT_ID
		const bodyFormData = new FormData();
		
		bodyFormData.append("TENANT_ID", row.TENANT_ID);
		bodyFormData.append("TENANT_NAME", row.TENANT_NAME);
		bodyFormData.append("COMPANY_NAME", row.COMPANY_NAME);
		bodyFormData.append("ADDRESS", row.ADDRESS);
		bodyFormData.append("CONTACT_NAME", row.CONTACT_NAME);
		bodyFormData.append("CONTACT_PHONE", row.CONTACT_PHONE);
		bodyFormData.append("EMAIL_ADDRESS", row.EMAIL_ADDRESS);
		bodyFormData.append("ADD_PACKAGE", row.ADD_PACKAGE);
		bodyFormData.append("STATUS", !row.STATUS);

		if (row.TENANT_IMAGE) {
			bodyFormData.append("TenantImageFile", row.TENANT_IMAGE);
			bodyFormData.append("TENANT_IMAGE", row.TENANT_IMAGE.name);
		}

		bodyFormData.append("USERS_JSON", JSON.stringify(row.USERS));


		bodyFormData.append("COURIER_JSON", JSON.stringify(row.COURIER));


		// TODO: Implement submit request using bodyFormData
		fnStoreEditTenant(bodyFormData, id, ()=>fetchData())
		fetchData()
		// Show confirmation and handle delete action
	};

	return (
		<Container fluid id="list-tenant-page">
			<CardComponent
				title={`List Tenant`}
				type="index"
				sideComponent={
					currentPrivileges.includes('C') &&
					<ButtonComponent
						onClick={() => History.navigate(objectRouterMasterPage.createTenant.path)}
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
                placeholder="Search tenant name..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearchTenantName(null, "button")}
                formGroupClassName={"inputTenantName"}
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
						exportFn={getListTenant}
						exportParam={{tenantName:searchTermTenantName, sortBy:sortObject.sortBy, order:sortObject.order}}
						exportFileName={"list-tenant"}
					/>
				</div>
			</CardComponent>
		</Container>
	);
}
export default TenantIndexPage;