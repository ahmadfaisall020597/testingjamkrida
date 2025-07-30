/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import { Badge, Button, Card, Col, Container, Form, Modal, Row, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router";
import CardComponent from "src/components/partial/cardComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import { objectRouterPortalAdmin } from "src/utils/router/objectRouter.portalAdmin";
import TablelUserMitraVerification from "./module/tablelUserMitraVerification";
import { getlistUserMitra, getlistUserMitraVerification } from "../../../../utils/api/apiUserMitra";
import ModalRejectComponent from "../../../../components/partial/ModalRejectComponent";
import ButtonComponent from "../../../../components/partial/buttonComponent";
import TableComponent from "src/components/partial/tableComponent";
import { fnStoreStatusApprovalUserMitra } from "../userMitraFn";
// import "./style.scss";

const UserMitraVerificationPage = () => {
	const [show, setShow] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedMitraId, setSelectedMitraId] = useState("");
	const [userId, setUserId] = useState("");
	let [searchParams] = useSearchParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [showModalReject, setShowModalReject] = useState(false);
	const [showOrderPreview, setShowOrderPreview] = useState(false);
	const [dataDetailPerSequence, setDataDetailPerSequence] = useState(null);
	const [error, setError] = useState(false);
	const [data, setData] = useState([
		{ ID: "BSI", NAME: 'Admin BSI 1', EMAIL: "admin1@bsi.co.id", STATUS: "Active", },
		{ ID: "BSI", NAME: 'Admin BSI 2', EMAIL: "admin2@bsi.co.id", STATUS: "Inactive", },
		{ ID: "BSI", NAME: 'Admin BSI 3 ', EMAIL: "admin3@bsi.co.id", STATUS: "Active", },
		{ ID: "MPN", NAME: 'Admin MPN 1 ', EMAIL: "admin1@mpn.co.id", STATUS: "Inactive", },
		{ ID: "MPN", NAME: 'Admin MPN 2 ', EMAIL: "admin2@mpn.co.id", STATUS: "Inactive", },
		{ ID: "MPN", NAME: 'Admin MPN 3 ', EMAIL: "admin3@mpn.co.id", STATUS: "Active", },
		{ ID: "MPN", NAME: 'Admin MPN 4 ', EMAIL: "admin4@mpn.co.id", STATUS: "Inactive", },
		{ ID: "MPN", NAME: 'Admin MPN 5 ', EMAIL: "admin5@mpn.co.id", STATUS: "Inactive", },
	]);
	const mitraIdOptions = [
		{ value: "CORE001", label: "CORE001" },
		{ value: "CORE002", label: "CORE002" },
		{ value: "CORE003", label: "CORE003" },
		{ value: "CORE004", label: "CORE004" },
		{ value: "CORE005", label: "CORE005" }
	];
	const [currentPage, setCurrentPage] = useState(1);
	const [totalRows, setTotalRows] = useState(0);
	const [sortObject, setSortObject] = useState({
		sortBy: "",
		order: "asc"
	});

	const [currentSearch, setCurrentSearch] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [userMitraList, setUserMitraList] = useState([]);
	const [userMitraBackupList, setUserMitraBackupList] = useState([]);
	const [loading, setLoading] = useState(false);
	const debounceSearchRef = useRef(null);
	const perPage = 10

	//
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);
	console.log('translate bahasa : ', translationData[code_lang]);

	const handleClose = () => {
		setShow(false);
		setSelectedRow(null);
		setSelectedMitraId("");
	};
	const handleCloseReject = () => {
		setShowModalReject(false);
		setSelectedRow(null);
		setSelectedMitraId("");
	};
	const handleShow = row => {
		setSelectedRow(row);
		setShow(true);
	};
	const handleShowReject = row => {
		setSelectedRow(row);
		setShowModalReject(true);
	};
	useEffect(() => {
		fetchUserMitraDataVerification();
	}, []); // fetch once on mount

	const fetchUserMitraDataVerification = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await getlistUserMitraVerification();
			console.log("response :", response);
			if (Array.isArray(response.data.data)) {
				setUserMitraList(response.data.data);
				setUserMitraBackupList(response.data.data);
			} else {
				console.error("Response data is not an array:", response.data);
				setError("Format data tidak valid");
				setUserMitraList([]);
			}
		} catch (err) {
			console.error("Error fetching mitra data:", err);
			setError("Gagal memuat data mitra");
		} finally {
			setLoading(false);
		}
	};
	const handleViewDetail = (row) => {
		setShowOrderPreview(true)
		setDataDetailPerSequence(row)
	}

	const handleSearch = (e, from) => {
		const searchValue = e.target.value;
		setCurrentSearch(searchValue);

		if (from === "onchange") {
			if (searchValue.trim() === "") {
				// Reset to full list when input is cleared
				setUserMitraList(userMitraBackupList);
			} else {
				const filtered = userMitraList.filter((item) =>
					item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
					item.email.toLowerCase().includes(searchValue.toLowerCase()) ||
					item.status.toLowerCase().includes(searchValue.toLowerCase())
				);
				setUserMitraList(filtered);
			}
		} else {
			setCurrentPage(1);
			setSearchTerm(searchValue);
		}
	};
	const handleConfirm = (row) => {
		console.log("row :", data);
		const payload = {
			statusApproval: "Approved"
		};
		fnStoreStatusApprovalUserMitra(row, payload);
		fetchUserMitraDataVerification();
		handleClose();
	};

	const handleReject = (row) => {
		const payload = {
			statusApproval: "Rejected"
		};
		fnStoreStatusApprovalUserMitra(row, payload);
		fetchUserMitraDataVerification();
		handleCloseReject();
	}
	const columnConfig = [
		{
			name: "Mitra",
			selector: row => row.mitra_id,
			// width: "180px",
			sortable: true
		},
		{
			name: "Name",
			selector: row => row.name,
			// width: "180px",
			sortable: true
		},
		{
			name: "Email",
			selector: row => row.email,
			// width: "180px",
			sortable: true,
			wrap: true
		},
		{
			name: "Status",
			selector: row => row.status,
			// width: "180px",
			sortable: true,
			cell: row => {
				// Default badge color
				let badgeColor = "secondary";
				let badgeText = row.status;

				if (row.STATUS === "Inactive") {
					badgeColor = "danger";
				} else if (row.status === "Active") {
					badgeColor = "success";
				}

				return (
					<Badge pill bg={badgeColor} style={{ fontSize: "12px", padding: "5px 10px", color: "#fff" }}>
						{badgeText}
					</Badge>
				);
			}
		},
		{
			name: "Action",
			cell: row => (
				<Stack direction="horizontal" className="justify-content-center align-content-center">
					<Button variant="link" onClick={() => handleShow(row)} className="me-2 text-decoration-none">
						Approve
					</Button>
					<div>|</div>
					<Button variant="link" onClick={() => handleShowReject(row)} className="me-2 text-decoration-none">
						Reject
					</Button>
				</Stack>
			)
			// width: "180px",
		}
	];

	const customStyles = {
		// header: {
		//   style: {
		//     background: '#EBF451',
		//     color: '#333333',
		//     fontSize: '18px',
		//     fontWeight: 'bold',
		//     textAlign: 'center'
		//   },
		// },
		headCells: {
			style: {
				textAlign: "center",
				background: "#EBF451",
				color: "#333333",
				fontWeight: "bold"
			}
		},
		rows: {
			style: {
				textAlign: "center",
				backgroundColor: "#f1f1f1"
			}
		},
		cells: {
			style: {
				textAlign: "center"
			}
		}
	};
	return (
		<Container fluid id="user-mitra-verification-page">
			<CardComponent
				title={translationData[code_lang]?.user_mitra?.verification?.text1}
				type="index"
			>
				<div className="content mt-3">
					<Row>
						<Col xl={3} md={6}>
							<InputSearchComponent
								label=""
								value={currentSearch}
								onChange={(e) => handleSearch(e, "onchange")}
								placeholder="Search"
								componentButton={<FaSearch />}
								buttonOnclick={() => handleSearch(null, "button")}
								formGroupClassName={"inputDescriptionValue"}
								labelXl="12"
							/>
						</Col>
					</Row>
					{/* <TablelUserMitraVerification
						canEdit={false}
						data={userMitraList}
						onChangePrice={() => console.log()}
						onChangeStatus={() => console.log()}
						onViewDetail={handleViewDetail}
					/> */}
					<TableComponent columns={columnConfig} data={userMitraList || []} pagination persistTableHead responsive striped paginationComponentOptions={{ noRowsPerPage: true }} customStyles={customStyles} />
					<Modal show={show} onHide={handleClose} size="md">
						<Modal.Header closeButton>
							<Modal.Title>Verifikasi User Mitra</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							{selectedRow && (
								<div className="p-3">
									<h5 className="mb-4 text-center">Informasi user Mitra</h5>
									<Row className="mb-3">
										<Col md={4}>
											<strong>Nama:</strong>
										</Col>
										<Col md={8}>{selectedRow.name || "-"}</Col>
									</Row>

									<Row className="mb-3">
										<Col md={4}>
											<strong>Email:</strong>
										</Col>
										<Col md={8}>{selectedRow.email || "-"}</Col>
									</Row>

									<Row className="mb-3">
										<Col md={4}>
											<strong>No Telepon:</strong>
										</Col>
										<Col md={8}>{selectedRow.phone || selectedRow.phone || "-"}</Col>
									</Row>

									<Row className="mb-3">
										<Col md={4}>
											<strong>Mitra:</strong>
										</Col>
										<Col md={8}>{selectedRow.mitra_id || "-"}</Col>
									</Row>

									<hr className="my-4" />

									<Form.Group className="mb-3">
										<Form.Label>
											<strong>
												Mitra ID (Core) <span className="text-danger">*</span>
											</strong>
										</Form.Label>
										<Form.Select value={selectedMitraId} onChange={e => setSelectedMitraId(e.target.value)} required>
											<option value="">Pilih Mitra ID...</option>
											{mitraIdOptions.map(option => (
												<option key={option.value} value={option.value}>
													{option.label}
												</option>
											))}
										</Form.Select>
									</Form.Group>
								</div>
							)}
						</Modal.Body>
						<Modal.Footer>
							<Stack direction="horizontal" gap={2}>
								<ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="outline-danger" title="Close" onClick={handleClose} />
								<ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="success" title="Confirm" type="submit" onClick={() => handleConfirm(selectedRow.user_id)} disabled={!selectedMitraId} />
							</Stack>
						</Modal.Footer>
					</Modal>
					<ModalRejectComponent
						show={showModalReject}
						onHide={() => setShowModalReject(false)}
						onConfirm={() => handleReject(selectedRow.user_id)}
						title="Reject Data"
						confirmText="Ya, Reject"
						cancelText="Batal" />
				</div>
			</CardComponent>
		</Container>
	);
};

export default UserMitraVerificationPage;
