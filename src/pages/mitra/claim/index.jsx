import React, { useEffect, useState } from "react";
import { getDataClaim } from "../../../utils/api/apiClaim";
import { Container, Row, Col, Badge, Spinner, Modal, Stack } from "react-bootstrap";
import { useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import TableComponent from "src/components/partial/tableComponent";
import { FaEye, FaFileAlt, FaGavel, FaTimes, FaClipboardCheck } from "react-icons/fa";
import SearchListComponent from "../../../components/partial/searchListComponent";
import CardComponent from "src/components/partial/cardComponent";
import { setListClaim, setLoading } from "./claimSlice";
import { useDispatch, useSelector } from "react-redux";
import { store } from "src/utils/store/combineReducers";
import { fnStoreRejectedClaim } from "./claimFn";
import jsPDF from "jspdf";

const ClaimMitraPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const [filteredData, setFilteredData] = useState([]);
	const [error, setError] = useState(null);
	const listClaim = useSelector(state => state.claim.listClaim);
	const isLoading = useSelector(state => state.claim.isLoading);
	const [searchData, setSearchData] = useState({
		page: 1,
		show_page: 10,
		sort_column: "claim_no",
		sort: "asc",
		filter: []
	});

	const listDataStatus = [
		{ value: "claim_no", label: "Nomor Claim" },
		{ value: "penjaminan_no", label: "Nomor Pengajuan" },
		{ value: "tgl_surat_pengajuan", label: "Tanggal Pengajuan" },
		{ value: "nama", label: "Nama" },
		{ value: "claim_status", label: "Status" },
		{ value: "nik", label: "NIK" }
	];

	const handleSearchChange = listFilter => {
		const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
		const { mitra_id } = dataLogin.data;
		const filterAdd = [...listFilter, {field: 'mitra_id', value: mitra_id ? mitra_id : ''}];
		let searchParam = { ...searchData, filter: filterAdd };
		setSearchData(searchParam);
		fetchData(searchParam);
	};

	const fetchData = searchParam => {
		store.dispatch(setLoading(true));
		getDataClaim(searchParam)
			.then(res => {
				console.log("list res", res);
				store.dispatch(setListClaim(res.data));
				store.dispatch(setLoading(false));
			})
			.catch(err => {
				console.log("list err", err);
				store.dispatch(setListClaim([]));
				store.dispatch(setLoading(false));
			})
			.finally(() => store.dispatch(setLoading(false)));
	};

	const handlePerRowsChange = (newPerPage, page) => {
		let searchParam = { ...searchData, show_page: newPerPage, page: page };
		setSearchData(searchParam);
		fetchData(searchParam);
	};

	const handlePageChange = page => {
		let searchParam = { ...searchData, page: page };
		setSearchData(searchParam);
		fetchData(searchParam);
	};

	const handleSort = (column, direction) => {
		console.log(column);
		console.log(direction);
		let searchParam = { ...searchData, sort_column: column.id, sort: direction };
		setSearchData(searchParam);
		fetchData(searchParam);
	};

	useEffect(() => {
		// const fetchClaimData = async () => {
		// 	try {
		// 		dispatch(setLoading(true));
		// 		const response = await axios.get("/api/claim", { params: { claim_no: "CLM000001" } });
		// 		dispatch(setListClaim(response.data));
		// 	} catch (error) {
		// 		console.error("Error fetching claim data", error);
		// 	} finally {
		// 		dispatch(setLoading(false));
		// 	}
		// };
		// fetchClaimData();
	}, []);

	// const handleShowReject = row => {
	// 	setShow(true);
	// 	setSelectedRow(row);
	// };
	const handleClose = () => {
		setShow(false);
		setSelectedRow(null);
	};
	const handleConfirm = row => {
		const payload = {
			claim_no: row
		};
		fnStoreRejectedClaim(row, payload);
		fetchData();
		handleClose();
	};

	const handleDownloadPdf = row => {
		const fileContent = `Dummy Contoh ${row.claim_status === "Rejected" ?
			"Surat Pembatalan" : "Sertifikat Claim"} untuk ${row.claim_no}.
			\nNama\t\t\t: ${row.nama}
			\nTgl pengajuan\t   : ${row.tgl_surat_pengajuan}
			\nStatus\t\t\t: ${row.claim_status}`;
		const doc = new jsPDF();
		doc.text(fileContent, 10, 30);const fileName = `${row.claim_status === "Rejected" ?
			"Surat Pembatalan" : "Sertifikat Claim"}-${row.claim_no}.pdf`;
		doc.save(fileName);
	};

	const columns = [
		{ name: "Nomor", selector: row => row.claim_no, sortable: true, width: "300px" },
		{ name: "Nomor Pengajuan", selector: row => row.penjaminan_no, sortable: true, width: "300px" },
		{
			id: "claim_status",
			name: "Status",
			selector: row => row.claim_status || "Belum Ada",
			sortable: true,
			cell: row => {
				// Mapping kode status ke teks dan warna
				let badgeColor = "secondary";
				let badgeText = row.claim_status;

				if (row.claim_status === "Draft") {
					badgeColor = "secondary";
					badgeText = "Draft";
				} else if (row.claim_status === "Processing") {
					badgeColor = "warning-badge";
					badgeText = "Processing";
				} else if (row.claim_status === "Submitted") {
					badgeColor = "info";
					badgeText = "Submitted";
				} else if (row.claim_status === "Rejected") {
					badgeColor = "danger";
					badgeText = "Rejected";
				} else if (row.claim_status === "Completed") {
					badgeColor = "success";
				}

				return (
					<Badge
						pill
						bg={badgeColor}
						style={{
							fontSize: "12px",
							padding: "5px 10px",
							minWidth: "100px",
							textAlign: "center"
						}}
					>
						{badgeText}
					</Badge>
				);
			},
			width: "200px"
		},
		{
			name: "Action",
			cell: row => (
				<div
					style={{
						display: "flex",
						gap: 8,
						flexWrap: "wrap",
						fontSize: "12px"
					}}
				>
					<button
						style={{
							padding: "4px 8px",
							background: "#f8f9fa",
							color: "#20388e",
							border: "none",
							borderRadius: 4,
							cursor: "pointer",
							display: "flex",
							gap: 4
						}}
						onClick={() =>
							navigate(`/mitra/claim/detail/${row.claim_no}`, {
								state: { claimNo: row.claim_no }
							})
						}
					>
						<FaEye size={14} />
						View
					</button>
					<button
						style={{
							padding: "4px 8px",
							background: "#f8f9fa",
							color: "#20388e",
							border: "none",
							borderRadius: 4,
							cursor: "pointer",
							display: "flex",
							marginRight: "30px",
							// alignItems: "center",
							gap: 4
						}}
						onClick={() => navigate(`/mitra/claim/banding/${row.claim_no}`)}
					>
						<FaGavel size={14} />
						Banding
					</button>
					<button
						style={{
							padding: "4px 8px",
							background: "#f8f9fa",
							color: "#20388e",
							border: "none",
							borderRadius: 4,
							cursor: "pointer",
							display: "flex",
							gap: 4
						}}
						onClick={() => navigate(`/mitra/claim/revisi-lampiran/${row.claim_no}`)}
					>
						<FaClipboardCheck size={14} />
						Revisi Lampiran
					</button>
					{row.claim_status === "Rejected" && (
						<button
							style={{
								padding: "4px 8px",
								background: "#f8f9fa",
								color: "#20388e",
								border: "none",
								borderRadius: 4,
								cursor: "pointer",
								display: "flex",
								gap: 4
							}}
							onClick={() => handleDownloadPdf(row)}
						>
							<FaFileAlt size={14} />
							Surat Pembatalan
						</button>
					)}

					{row.claim_status === "Completed" && (
						<button
							style={{
								padding: "4px 8px",
								background: "#f8f9fa",
								color: "#20388e",
								border: "none",
								borderRadius: 4,
								cursor: "pointer",
								display: "flex",
								gap: 4
							}}
							onClick={() => handleDownloadPdf(row)}
						>
							<FaFileAlt size={14} />
							Surat Persetujuan
						</button>
					)}
					<button
						style={{
							padding: "4px 8px",
							background: "#f8f9fa",
							color: "#20388e",
							border: "none",
							borderRadius: 4,
							cursor: "pointer",
							display: "flex",
							// alignItems: "center",
							gap: 4
						}}
						onClick={() => handleShowReject(row)}
					>
						<FaTimes size={14} />
						Batalkan
					</button>
				</div>
			),
			width: "auto",
			minWidth: "200px",
			ignoreRowClick: true,
			allowOverflow: true
		}
	];

	const customStyles = {
		headCells: {
			style: {
				color: "black",
				background: "#EBF451",
				fontWeight: "bold",
				borderRight: "1px solid black",
				justifyContent: "center",
				textAlign: "center"
				// padding: "10px 5px"
			}
		},
		cells: {
			style: {
				// padding: "8px 5px",
				borderRight: "1px solid #dee2e6"
				// justifyContent: "center"
			}
		},
		rows: {
			style: {
				minHeight: "45px",
				"&:not(:last-of-type)": {
					borderBottom: "1px solid #dee2e6"
				}
			}
		}
	};

	return (
		<>
			<Container fluid id="claim-page">
				<CardComponent type="index">
					<div className="content custom-style" style={{ marginTop: 15 }}>
						<Row className="align-items-end">
							{/* Search component */}
							<Col md={8}>
								<div className="d-flex align-items-end gap-2" style={{ flexWrap: "wrap" }}>
									<SearchListComponent ListDataStatus={listDataStatus} onChange={listFilter => handleSearchChange(listFilter)} />
								</div>
							</Col>
							<Col md={4} className="mt-md-3 mt-3 ">
								<div className="d-flex gap-2 justify-content-md-end mb-3">
									<ButtonComponent title="Upload Excel" onClick={() => navigate("/mitra/claim/upload")} />
									<ButtonComponent title={"Create"} onClick={() => navigate("/mitra/claim/create")} cursor={"pointer"} />
								</div>
							</Col>
						</Row>
					</div>
					<div style={{ marginTop: 30 }}>
						<TableComponent
							columns={columns}
							data={listClaim.data}
							paginationTotalRow={listClaim.length}
							customStyles={customStyles}
							progressPending={isLoading}
							progressComponent={<Spinner />}
							pagination
							paginationServer
							paginationTotalRows={listClaim.total}
							paginationDefaultPage={listClaim.current_page}
							onChangeRowsPerPage={handlePerRowsChange}
							onChangePage={handlePageChange}
							sortServer
							onSort={handleSort}
						/>
					</div>
				</CardComponent>
			</Container>
			<Modal show={show} onHide={handleClose} size="md">
				<Modal.Header closeButton>
					<Modal.Title>Batalkan Claim</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					{selectedRow && (
						<div className="p-3">
							<h5 className="mb-4 text-center">
								Apakah anda yakin ingin membatalkkan claim <strong>{selectedRow.claim_no}</strong> ini ?
							</h5>
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					<Stack direction="horizontal" gap={2}>
						<ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="outline-danger" title="Close" onClick={handleClose} />
						<ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="success" title="Batalkan" type="submit" onClick={() => handleConfirm(selectedRow.claim_no)} />
					</Stack>
				</Modal.Footer>
			</Modal>
		</>
	);
};

export default ClaimMitraPage;
