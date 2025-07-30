/* eslint-disable no-unused-vars */
import moment from "moment";
import { useState } from "react";
import { Badge, Button, Col, Form, Image, Modal, Row, Stack } from "react-bootstrap";
import TableComponent from "src/components/partial/tableComponent";
import ButtonComponent from "../../../../../components/partial/buttonComponent";
import ModalComponent from "../../../../../components/partial/modalComponent";
import ModalRejectComponent from "../../../../../components/partial/ModalRejectComponent";
import { fnStoreStatusApprovalUserMitra } from "../../userMitraFn";

const TablelUserMitraVerification = ({ data, canEdit, onChangePrice, onChangeStatus, onViewDetail, currentParamValue }) => {
	const [show, setShow] = useState(false);
	const [selectedRow, setSelectedRow] = useState(null);
	const [selectedMitraId, setSelectedMitraId] = useState("");

	const handleClose = () => {
		setShow(false);
		setSelectedRow(null);
		setSelectedMitraId("");
	};

	const handleShow = row => {
		setSelectedRow(row);
		setShow(true);
	};

	const handleConfirm = (row) => {
		console.log("row :", data);
		const payload = {            
					statusApproval: "Approved"            
				};
		fnStoreStatusApprovalUserMitra(row.user_id,  payload);
		//fetchUserMitraData();
		//alert("Confirmed with Mitra ID: " + selectedMitraId);
		handleClose();
	};

	const mitraIdOptions = [
		{ value: "CORE001", label: "CORE001" },
		{ value: "CORE002", label: "CORE002" },
		{ value: "CORE003", label: "CORE003" },
		{ value: "CORE004", label: "CORE004" },
		{ value: "CORE005", label: "CORE005" }
	];

	const [showModalReject, setShowModalReject] = useState(false);

	const handleReject = () =>{
		alert("Berhasil Menolak Mitra");
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
					<Button variant="link" onClick={() => setShowModalReject(true)} className="me-2 text-decoration-none">
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
		<>
			<div>
				<TableComponent columns={columnConfig} data={data || []} pagination persistTableHead responsive striped paginationComponentOptions={{ noRowsPerPage: true }} customStyles={customStyles} />
			</div>
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
						<ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="outline-danger" title="Close" onClick={handleClose}/>
						<ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="success" title="Confirm" type="submit" onClick={()=>handleConfirm(data.user_id)} disabled={!selectedMitraId} />
					</Stack>
				</Modal.Footer>
			</Modal>
			<ModalRejectComponent 
			show={showModalReject}
			 onHide={() => setShowModalReject(false)} 
			 onConfirm={handleReject} 
			 title="Reject Data" 
			 confirmText="Ya, Reject" 
			 cancelText="Batal" />
		</>
	);
};

export default TablelUserMitraVerification;
