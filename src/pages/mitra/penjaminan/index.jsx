/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Badge, Col, Container, Row, Spinner } from "react-bootstrap";
import "./style.scss";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import TableComponent from "src/components/partial/tableComponent";
import { FaEye, FaEdit, FaFileContract, FaTimes } from "react-icons/fa";
import { dataDummyPenjaminan } from "./dataDummyPenjaminan";
import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
// import "dayjs/locale/en";
import { formatDateToDDMMYYYY } from "../../../utils/dateFormatter";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
import SearchListComponent from "../../../components/partial/searchListComponent";
import { list } from "../../../utils/api/apiPenjaminan";
import { store } from "src/utils/store/combineReducers"
import { setListPenjaminan, setLoading } from "./penjaminanSlice";


const PenjaminanMitraPage = () => {
	const navigate = useNavigate();
	const listPenjaminan = useSelector((state) => state.penjaminan.listPenjaminan);
	const isLoading = useSelector((state) => state.penjaminan.isLoading);
	const [searchData, setSearchData] = useState(
		{
			"page": 1,
			"show_page": 10,
			"sort_column": "trx_no",
			"sort": "asc",
			"filter": []
		}
	);
	const [filters, setFilters] = useState({
		TanggalPengajuan: "",
		status: "",
		filter: []
	});

	const listDataStatus = [
		{ value: "trx_no", label: "Nomor Transaksi" },
		{ value: "no_permohonan", label: "Nomor Permohonan" },
		{ value: "created_at", label: "Tanggal Pengajuan" },
		{ value: "trx_status", label: "Status" },
		{ value: "nama", label: "Nama" },
		{ value: "nik", label: "NIK" }
	];

	// function search
	const handleSearchChange = listFilter => {
		// debugger;
		const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
		const { mitra_id } = dataLogin.data;
		const filterAdd = [...listFilter, {field: 'mitra_id', value: mitra_id ? mitra_id : ''}];
		let searchParam = { ...searchData, filter: filterAdd };
		setSearchData(searchParam);
		fetchData(searchParam);
	};

	const fetchData = (searchParam) => {
		// debugger;
		store.dispatch(setLoading(true))
		list(searchParam).then(res => {
			console.log("list res", res);
			store.dispatch(setListPenjaminan(res.data));
			store.dispatch(setLoading(false))
		}).catch(err => {
			console.log("list err", err);
			store.dispatch(setListPenjaminan([]));
			store.dispatch(setLoading(false))
		}).finally(() => store.dispatch(setLoading(false)))
	}

	const handlePerRowsChange = (newPerPage, page) => {
		let searchParam = { ...searchData, show_page: newPerPage, page: page }
		setSearchData(searchParam);
		fetchData(searchParam);
	};

	const handlePageChange = (page) => {
		let searchParam = { ...searchData, page: page }
		setSearchData(searchParam);
		fetchData(searchParam);
	};

	const handleSort = (column, direction) => {
		console.log(column)
		console.log(direction)
		let searchParam = { ...searchData, sort_column: column.id, sort: direction }
		setSearchData(searchParam);
		fetchData(searchParam);
	};


	useEffect(() => {
		// const localData = JSON.parse(localStorage.getItem("dataPenjaminanMitra") || "[]");
		// const combinedData = [...localData, ...dataDummyPenjaminan];
		// setFilteredData(combinedData);
	}, []);

	const handleDownloadPdf = row => {
		const fileContent = `Ini adalah contoh isi PDF untuk ${row.nomer}`;

		const blob = new Blob([fileContent], { type: "application/pdf" });

		const fileName = `Penjaminan-${row.nomer}.pdf`;

		saveAs(blob, fileName);
	};

	const columns = [
		{ id: "trx_no", name: "Nomor Transaksi", selector: row => row.trx_no, sortable: true, width:"150px"},
		{ id: "no_permohonan", name: "Nomor Permohonan", selector: row => row.no_permohonan, sortable: true },
		{ id: "nik", name: "NIK", selector: row => row.nik, sortable: true, width:"200px" },
		{ id: "nama", name: "Nama", selector: row => row.nama, sortable: true },
		{
			id: "created_at", 
			name: "Tanggal Pengajuan",
			selector: row => {
				// Untuk sorting - konversi ke Date object
				const [day, month, year] = row.created_at.split("/");
				return new Date(`${year}-${month}-${day}`);
			},
			sortable: true,
			cell: row => <span>{formatDateToDDMMYYYY(row.created_at)}</span>,
			format: row => formatDateToDDMMYYYY(row.created_at)
		},
		{
			id: "trx_status", 
			name: "Status",
			selector: row => row.trx_status || "Belum Ada",
			sortable: true,
			cell: row => {
				let badgeColor = "secondary";
				let badgeText = row.trx_status;

				if (row.trx_status === "Submitted") {
					badgeColor = "secondary";
				} else if (row.trx_status === "Processing") {
					badgeColor = "warning-badge";
				} else if (row.trx_status === "On Review") {
					badgeColor = "info";
				} else if (row.trx_status === "Completed") {
					badgeColor = "success";
				}

				return (
					<Badge pill bg={badgeColor} style={{ backgroundColor: "#ffa500", fontSize: "12px", padding: "5px 10px" }}>
						{badgeText}
					</Badge>
				);
			}
		},
		{
			id: "action", 
			name: "Action",
			cell: row => (
				<div style={{ display: "flex", gap: 10, justifyContent: "flex-start", minWidth: 80 }}>
					{/* <FaEye style={{ cursor: "pointer", color: "blue", width: 20, height: 20 }} title="View"
						//  onClick={() => navigate("/mitra/penjaminan-mitra/create")}
						onClick={() => navigate("/mitra/penjaminan-mitra/create", {
							state: { id: row.nomorPenjaminan,
									 type: "View"
							 }
						})}
					/> */}
					<FaEye style={{ cursor: "pointer", color: "blue", width: 20, height: 20 }} title="View" onClick={() => navigate(`/mitra/penjaminan-mitra/detail/${row.trx_no}`)} />
					{/* {row.status === "Submitted" && <FaEdit style={{ cursor: "pointer", color: "orange", width: 20, height: 20 }} title="Edit" onClick={() => navigate("/mitra/penjaminan-mitra/create")} />} */}
					{/* {row.status === "Completed" && <FaFileContract style={{ cursor: "pointer", color: "green", width: 20, height: 20 }} onClick={() => handleDownloadPdf(row)} />} */}
				</div>
			),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
			Alignment: "center"
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
			}
		},
		cells: {
			style: {
				// color: "black",
				// borderRight: "1px solid black",
				// justifyContent: "center",
				// textAlign: "center"
			}
		},
		rows: {
			style: {
				minHeight: "45px"
			}
		}
	};

	return (
		<Container fluid id="penjaminan-mitra-page">
			<CardComponent type="index">
				<div className="content custom-style" style={{ marginTop: 15 }}>
					<Row className="align-items-end">
						{/* Search component */}
						<Col md={8} >
							<div className="d-flex align-items-end gap-3" style={{ flexWrap: "wrap" }}>
								<SearchListComponent ListDataStatus={listDataStatus} onChange={(listFilter) => handleSearchChange(listFilter)} />
							</div>
						</Col>
						{/* Buttons */}
						<Col md={4} className="mt-md-3 mt-3 ">
							<div className="d-flex gap-2 justify-content-md-end mb-3">
								<ButtonComponent title="Upload Excel" onClick={() => navigate("/mitra/penjaminan-mitra/upload")} />
								<ButtonComponent title="Create" onClick={() => navigate("/mitra/penjaminan-mitra/create")} />
							</div>
						</Col>
					</Row>
				</div>
				<div style={{ marginTop: 30 }}>
					<TableComponent 
						columns={columns} 
						data={listPenjaminan.data} 
						paginationTotalRow={dataDummyPenjaminan.length} 
						customStyles={customStyles} 
						progressPending={isLoading}
						progressComponent={<Spinner  />}	
						pagination
						paginationServer
						paginationTotalRows={listPenjaminan.total}
						paginationDefaultPage={listPenjaminan.current_page}
						onChangeRowsPerPage={handlePerRowsChange}
						onChangePage={handlePageChange}
						sortServer
						onSort={handleSort}
					/>
				</div>
			</CardComponent>
		</Container>
	);
};

export default PenjaminanMitraPage;
