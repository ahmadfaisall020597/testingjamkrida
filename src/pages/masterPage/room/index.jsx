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
import { editRoom, getListRoom } from "src/utils/api/apiMasterPage";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import { setListData } from "./roomSlice";
import { toast } from "react-toastify";
import usePrivileges from "src/utils/auth/getCurrentPrivilege";
import { formatNumberWithThousandSeparator } from "src/utils/helpersFunction";

/**
 * This component is used to display a list of rooms.
 * It allows the user to search room name, sort the table by room name, location, capacity, type, and status.
 * It also allows the user to edit the room details or set the room status to active/inactive.
 * The component is connected to the redux store and uses the 'room' slice to get the list of rooms.
 * The component is also connected to the 'room' slice to dispatch the action to get the list of rooms.
 */
const RoomIndexPage = () => {
	const currentPrivileges = usePrivileges();
	const dispatch = useDispatch();
	const { listData } = useSelector(state => state.room);

	const [currentPage, setCurrentPage] = useState(1);
	const [totalRows, setTotalRows] = useState(0);
	const [sortObject, setSortObject] = useState({
		sortBy: "",
		order: "asc"
	});

	const [currentSearchRoomName, setCurrentSearchRoomName] = useState("");
	const [searchTermRoomName, setSearchTermRoomName] = useState("");

	const [loading, setLoading] = useState(false);
	const debounceSearchRoomNameRef = useRef(null);
	const perPage = 10;

	const columnsConfig = [
    {
      name: "Room Name",
      cell: row =>(
        <Link to={`${objectRouterMasterPage.viewRoom.path}?q=${row.ROOM_ID}`}>{row.ROOM_NAME}</Link>
      ),
      sortable: true,
      sortField: "ROOM_NAME",
			wrap: true
    },
    {
      name: "Location",
      selector: row => row.ROOM_LOCATION,
      sortable: true,
      sortField: "ROOM_LOCATION",
			wrap: true
    },
    {
      name: "Capacity",
      selector: row => formatNumberWithThousandSeparator(row.CAPACITY),
      sortable: true,
      sortField: "CAPACITY",
    },
		{
      name: "Type",
      selector: row => row.ROOM_TYPE_DESC,
      sortable: true,
      sortField: "ROOM_TYPE_DESC",
			wrap: true
    },
		{
      name: "Status",
      cell: row =>(
				<div className={`fw-bold text-${row.ROOM_STATUS? 'success': 'danger'}`}>{row.ROOM_STATUS? 'Active': 'Inactive'}</div>
      ),
      sortable: true,
      sortField: "ROOM_STATUS",
    },
    {
      name: "Actions",
      cell: row => (
        <Stack direction="horizontal">
					{
						currentPrivileges.includes('U') &&
						<Button variant="link" onClick={() => handleEdit(row.ROOM_ID)} className="me-2">
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
							Set {row.ROOM_STATUS? 'Inactive': 'Active'}
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
			roomName:searchTermRoomName,
			sortBy:sortObject.sortBy,
			order:sortObject.order
		}
		getListRoom(params).then(res=>{
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
	},[currentPage, dispatch, searchTermRoomName, sortObject])

	useEffect(() => {
		fetchData();
	}, [fetchData]);
	
	useEffect(() => {
		debounceSearchRoomNameRef.current = _.debounce((value) => {
			setCurrentPage(1);
			setSearchTermRoomName(value);
		}, 500);
	}, [searchTermRoomName]);


	const handleSearchRoomName = (e, from) => {
		if(from == "onchange"){
			setCurrentSearchRoomName(e.target.value);
			debounceSearchRoomNameRef.current(e.target.value);
		}else{
			setCurrentPage(1);
			setSearchTermRoomName(currentSearchRoomName);
		}
	};

	const handleSort = (column, sortDirection) => {
			setSortObject({
				sortBy: column.sortField,
				order: sortDirection
			})
		}
	
	const handleEdit = (id) => {
		History.navigate(`${objectRouterMasterPage.editRoom.path}?q=${id}`);
		// Navigate to edit page or show modal
	};

	const handleActiveInactive = (row) => {
		const id = row.ROOM_ID
		const status = !row.ROOM_STATUS
		const body = {...row, ROOM_STATUS:status}
		// console.log(body)
		editRoom(body, id).then(res=>{
			toast.success(res.data.message)
			fetchData()
		})
		// Show confirmation and handle delete action
	};

	return (
		<Container fluid id="list-room-page">
			<CardComponent
				title={`List Room`}
				type="index"
				sideComponent={
					currentPrivileges.includes('C') &&
					<ButtonComponent
						onClick={() => History.navigate(objectRouterMasterPage.createRoom.path)}
						title={"Add New"}
						icon={<MdOutlineAddCircle size={28}/>}
					/>
				}
			>
				<div className="content mb-3">
					<Row className="my-2">
						<Col xl={3} md={6}>
							<InputSearchComponent
                label="Room Name"
                value={currentSearchRoomName}
                onChange={(e) => handleSearchRoomName(e, "onchange")}
                placeholder="Search Room name..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearchRoomName(null, "button")}
                formGroupClassName={"inputRoomName"}
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
						exportFn={getListRoom}
						exportParam={{roomName:searchTermRoomName, sortBy:sortObject.sortBy, order:sortObject.order}}
						exportFileName={"list-room"}
					/>
				</div>
			</CardComponent>
		</Container>
	);
}
export default RoomIndexPage;