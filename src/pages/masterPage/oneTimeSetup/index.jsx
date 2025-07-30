/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, Col, Container, Row, Stack } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import { MdOutlineAddCircle } from "react-icons/md";
import { RiEditBoxFill, RiFileExcel2Fill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import "./style.scss";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputComponent from "src/components/partial/inputComponent";
import { toast } from "react-toastify";
import moment from "moment";
import { editOneTimeSetup, getListOneTimeSetup } from "src/utils/api/apiMasterPage";
import { setDefaultData, setListData, setShowModal } from "./oneTimeSetupSlice";
import { fnExportXlsx, fnUpdateValueDefaultConfig, loopDropDownDeliveryDays } from "./oneTimeSetupFn";
import { typeModalOneTimeSetup } from "src/utils/variableGlobal/var";
import ModalParent from "./modalOneTimeSetup/ModalParent";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";

const OneTimeSetupPage = () => {
	const currentPrivileges = usePrivileges()
	const dispatch = useDispatch();
	const { listData, defaultData, needReloadPage } = useSelector(state => state.oneTimeSetup);
	const { showLoadingScreen } = useSelector(state => state.global)

	const [currentPage, setCurrentPage] = useState(1);
	const [totalRows, setTotalRows] = useState(0);
	const [sortObject, setSortObject] = useState({
		sortBy: "",
		order: "asc"
	});

	const [localDefaultData, setLocalDefaultData] = useState({});
	const [dataLogs, setDataLogs] = useState([]);
	const [Cancel, setCancel] = useState(false);
	const [loading, setLoading] = useState(false);
	const perPage = 10

	const [dataModal, setDataModal] = useState({
    title: "",
    id: "",
		data:{}
  });

	const columnsConfig = [
    {
      name: "Number",
			selector: (row,idx) => Number(idx+1),
      sortable: false,
      sortField: "ID",
			width: "100px",
    },
    {
      name: "Tenant Name",
      selector: row => row.TENANT_NAME,
      sortable: true,
      sortField: "TENANT_NAME",
			wrap: true
    },
		{
      name: "Delivery Days",
      selector: row => `H-${row.DELIVERY_DAYS}`,
      sortable: true,
      sortField: "DELIVERY_DAYS",
			width: "170px",
    },
		{
      name: "Delivery Hours",
      selector: row => row.DELIVERY_HOURS,
      sortable: true,
      sortField: "DELIVERY_HOURS",
			width: "180px",
    },
		{
      name: "Min. Order per Portion",
      selector: row => row.MIN_ORDER,
      sortable: true,
      sortField: "MIN_ORDER",
			width: "240px",
    },
		{
      name: "Can Cancel Order H-1",
      selector: row => row.CANCEL_ORDER_FLAG ? "Yes":"No",
      sortable: true,
      sortField: "CANCEL_ORDER_FLAG",
			width: "240px",
    },
		{
      name: "Actions",
      cell: row => (
        <Stack direction="horizontal">
					{
						currentPrivileges.includes('U') &&
						<Button variant="link" onClick={() => handleEdit(row)} className="me-2">
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
						<Button variant="link" className="text-danger link-underline-danger" onClick={() => handleDelete(row)}>
							Delete
						</Button>
					}
        </Stack>
      ),
			width: "200px",
    },
  ];

	useEffect(()=>{
		if(listData){
			if(listData.LOGS){
				setDataLogs(listData.LOGS)
			}
		}
	},[listData])
	
	useEffect(() => {
    setLocalDefaultData(defaultData);
	}, [defaultData]);

	const fetchData =useCallback(() => {
		setLoading(true);
		const params = {
			pageNumber: currentPage, 
			pageSize:perPage,
			sortBy:sortObject.sortBy,
			order:sortObject.order
		}
		getListOneTimeSetup(params).then(res=>{
			const data = res.data
			if(data?.data){
				setTotalRows(data.totalData)
				dispatch(setListData(data.data))
				dispatch(setDefaultData(data.data.DEFAULT))
			}else{
				dispatch(setListData({
					CUSTOM: [],
					DEFAULT: {},
					LOGS:[]
				}))
				dispatch(setDefaultData({}))
			}
			setCancel(false)
			setLoading(false)
		})
	},[currentPage, dispatch, sortObject])

	useEffect(() => {
		if(!needReloadPage){
			fetchData();
		}
	}, [fetchData, needReloadPage]);

	const loopDropDownMaxOutstandingHour = ()=>{
		// looping 24 hour
		const arr = []
		for(let i=0; i<=10; i++){
			arr.push({value:i, label:`H-${i}`})
		}
		return arr
	}

	const handleSort = (column, sortDirection) => {
			setSortObject({
				sortBy: column.sortField,
				order: sortDirection
			})
		}
	
	const handleEdit = (row) => {
		handleShowModals(1, row)
		// Navigate to edit page or show modal
	};

	const handleDelete = (row) => {
		// Show confirmation and handle delete action
		const id = row.ID
		const ISDELETED = !row.ISDELETED
		const body = {...row, ISDELETED}
		fnUpdateValueDefaultConfig(body, ()=>console.log())
	};

	const handleChange = (key, value)=>{
		const updatedData = { ...localDefaultData, [key]: value };
    setLocalDefaultData(updatedData);
    // dispatch(setDefaultData(updatedData));
	}

	const handleUpdateDefaultConfig = () =>{
		const { TENANT_ID, LOGS, ISDELETED, ...rest} = localDefaultData
		const payload = rest
		// bikin validasi payload disini

		// Validasi kosong atau tidak diisi
    if (!payload.DELIVERY_DAYS || isNaN(payload.DELIVERY_DAYS) || Number(payload.DELIVERY_DAYS) < 0) {
			toast.error("Please select a valid Delivery Days (H-0 to H-10).");
			return;
		}

		if (!payload.DELIVERY_HOURS || !/^\d{2}:\d{2}$/.test(payload.DELIVERY_HOURS)) {
				toast.error("Please enter a valid Delivery Hours in HH:mm format.");
				return;
		}

		if (!payload.MIN_ORDER || isNaN(payload.MIN_ORDER) || Number(payload.MIN_ORDER) <= 0) {
				toast.error("Minimum Order must be a positive number.");
				return;
		}

		if (typeof payload.CANCEL_ORDER_FLAG !== "boolean") {
				toast.error("Invalid value for Can Cancel Order. Please select Yes or No.");
				return;
		}

		// submit then reload
		fnUpdateValueDefaultConfig(payload, ()=>console.log())
	}

	const handleCancel = () =>{
		setCancel(true)
		fetchData()
	}

	const handleShowModals = (index, row) => {
			setDataModal({
				title: typeModalOneTimeSetup[index].title,
				id: row?.ID,
				data: row,
				type: row? "edit" : "create"
			})
			dispatch(setShowModal(true))
		}

	return (
		<Container fluid id="list-lookup-value-page">
			<CardComponent
				title={``}
				type="index"
				sideComponent={<></>}
				needFooter
				dataFooter={dataLogs}
				loadingFooter={loading}
			>
				<div className="content mb-3">
					<Row>
						<Col xl={7}>
							<div className="my-3 px-3 py-2 header-title fw-bold fs-5">
								 Default Function Request Configuration
							</div>
						</Col>
						<Col xl={5} className="text-sm-end align-self-center">
							{
								currentPrivileges.includes("C") &&
								<ButtonComponent
									onClick={() => handleShowModals(0, null)}
									title={"Add New"}
									icon={<MdOutlineAddCircle size={28}/>}
								/>
							}
						</Col>
					</Row>
					<div>
						<h5 className="fw-bold">Default</h5>
					</div>
					{
						!Cancel && (
							<>
								<Row className="gx-4">
									<Col xl={3} lg={6}>
										<InputDropdownComponent
											onChange={(e) => handleChange("DELIVERY_DAYS", e.target.value)}
											value={localDefaultData.DELIVERY_DAYS}
											label="Delivery Days"
											listDropdown={loopDropDownDeliveryDays()}
											labelXl="6"
											valueIndex={true}
											formGroupClassName="gx-1"
											readOnly={!currentPrivileges.includes("U")}
										/>
									</Col>
									<Col xl={4} lg={6}>
										<InputComponent
											labelXl="7"
											label="Min. Order per Portion"
											value={localDefaultData.MIN_ORDER}
											onChange={(e) => handleChange("MIN_ORDER", e.target.value)}
											type={"text"}
											formGroupClassName="gx-1"
											disabled={!currentPrivileges.includes("U")}
										/>
									</Col>
								</Row>
								<Row className="gx-4">
									<Col xl={3} lg={6}>
										<InputComponent
											labelXl="6"
											label="Delivery Hours"
											value={localDefaultData.DELIVERY_HOURS}
											onChange={(e) => handleChange("DELIVERY_HOURS", e.target.value)}
											type={"time"}
											name="DELIVERY_HOURS"
											formGroupClassName="gx-1"
											disabled={!currentPrivileges.includes("U")}
										/>
									</Col>
									<Col xl={4} lg={6}>
										<InputDropdownComponent
											onChange={(e) => handleChange("CANCEL_ORDER_FLAG", e.target.value)}
											value={localDefaultData.CANCEL_ORDER_FLAG}
											label="Can Cancel Order H-1"
											listDropdown={[
												{value: true, label: "Yes"},
												{value: false, label: "No"}
											]}
											labelXl="7"
											valueIndex={true}
											formGroupClassName="gx-1"
											readOnly={!currentPrivileges.includes("U")}
										/>
									</Col>
								</Row>
							</>
						)
					}

					<div className="my-4 table-responsive">
						<Button variant="secondary" onClick={()=>fnExportXlsx()}>
							<Stack direction="horizontal" gap={2}>
								<RiFileExcel2Fill/>
								<p className="m-0">Export to Excel</p>
							</Stack>
						</Button>
						<div className="my-1 px-3 py-2 header-title fw-bold fs-5">
							Function Request / Tenant
						</div>
						<DataTable
							columns={columnsConfig}
							data={listData.CUSTOM}
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
					<div>
						{
							currentPrivileges.includes("U") &&
							<Stack direction="horizontal" className="justify-content-end" gap={3}>
								<ButtonComponent
									className={"px-sm-5 fw-semibold"}
									variant="warning"
									onClick={() => handleUpdateDefaultConfig()}
									title={"Save"}
								/>
								<ButtonComponent
									className={"px-sm-5 fw-semibold"}
									variant="outline-danger"
									onClick={() => handleCancel()}
									title={"Cancel"}
								/>
							</Stack>
						}
					</div>
				</div>
			</CardComponent>
			<ModalParent data={dataModal}/>
		</Container>
	);
};

export default OneTimeSetupPage;
