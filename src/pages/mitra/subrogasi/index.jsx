/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Badge, Card, Col, Container, Form, FormControl, InputGroup, Row, Stack } from "react-bootstrap";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import TableComponent from "src/components/partial/tableComponent";
import { FaEye, FaEdit, FaFileContract } from "react-icons/fa";
import { dataDummySubrogasi } from "./dataDummySubrogasi";
import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { Alignment } from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
// import "dayjs/locale/en";
import { formatDateToDDMMYYYY } from "../../../utils/dateFormatter";
import customParseFormat from "dayjs/plugin/customParseFormat";
import SearchListComponent from "../../../components/partial/searchListComponent";

const SubrogasiMitraPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchData, setSearchData] = useState("");
	const [filteredData, setFilteredData] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
	const [formattedDate, setFormattedDate] = useState("");

	//
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);
	console.log('translate bahasa : ', translationData[code_lang]);

	const [filters, setFilters] = useState({
		TanggalPengajuan: "",
		status: ""
	});

	const listDataStatus = [
		{ value: "subrogasi.subrogasi_no", label: translationData[code_lang]?.subrogasi?.sub1 },
		{ value: "subrogasi.no_permohonan", label: translationData[code_lang]?.subrogasi?.sub2 },
		{ value: "subrogasi.tgl_pengajuan", label: translationData[code_lang]?.subrogasi?.sub3 },
		{ value: "mapping_value.label", label: translationData[code_lang]?.subrogasi?.status },
		{ value: "subrogasi.nama", label: translationData[code_lang]?.subrogasi?.name },
		{ value: "subrogasi.nik", label: translationData[code_lang]?.subrogasi?.nik }
	];


	// const handleSearchChange = e => {
	// 	const value = e.target.value.toLowerCase();
	// 	setSearchData(value);

	// 	const localData = JSON.parse(localStorage.getItem("dataClaimMitra") || "[]");
	// 	console.log(localStorage);
	// 	const allData = [...localData, ...dataDummySubrogasi];

	// 	const filtered = allData.filter(item => item.nomorPenjaminan.toLowerCase().includes(value));

	// 	setFilteredData(filtered);
	// };

	useEffect(() => {
		// Mengambil filter dan search data dari localStorage
		const storedSearchData = localStorage.getItem("searchData");
		const storedFilters = JSON.parse(localStorage.getItem("status") || "{}");
		const storedDate = localStorage.getItem("selectedDate");

		if (storedSearchData) {
			setSearchData(storedSearchData);
		}

		if (storedFilters) {
			setFilters(storedFilters);
		}

		// if (storedDate) {
		// 	const parsedDate = dayjs(storedDate, "DD/MM/YYYY").toDate();
		// 	setSelectedDate(parsedDate);
		// }
		// console.log(storedDate);

		// localStorage.clear();
	}, []);

	// function search
	const handleSearchChange = e => {
		const value = e.target.value.toLowerCase();
		setSearchData(value);
		localStorage.setItem("searchData", value);
	};

	// function to handle filter status
	const handleStatusChange = e => {
		const value = e.target.value;
		setFilters(prevFilters => {
			const newFilters = { ...prevFilters, status: value };
			localStorage.setItem("status", JSON.stringify(newFilters));
			return newFilters;
		});
	};

	// function to handle change date
	const handleDateChange = date => {
		setSelectedDate(date);
		const formatted = dayjs(date).format("DD/MM/YYYY");
		setFormattedDate(formatted);
		localStorage.setItem("selectedDate", dayjs(date).format("DD/MM/YYYY"));
	};

	const handleSearchAndFilter = () => {
		let filtered = dataDummySubrogasi;

		if (searchData) {
			filtered = filtered.filter(item => item.nomorPenjaminan.toLowerCase().includes(searchData.toLowerCase()));
			// console.log("After search filter:", filtered);
		}

		if (filters.status) {
			filtered = filtered.filter(item => item.status === filters.status);
			// console.log("After status filter:", filtered);
		}

		if (selectedDate) {
			const formattedSelectedDate = dayjs(selectedDate).format("DD/MM/YYYY");
			// console.log("Selected date (formatted):", formattedSelectedDate);

			filtered = filtered.filter(item => {
				const itemDateFormatted = dayjs(item.tglPengajuan, "DD/MM/YYYY").format("DD/MM/YYYY");
				console.log("Item date:", item.tglPengajuan, "-> Formatted:", itemDateFormatted);

				const isMatch = itemDateFormatted === formattedSelectedDate;
				// console.log("Match:", isMatch);

				return isMatch;
			});

			// console.log("After date filter:", filtered);
		}

		setFilteredData(filtered);
	};

	useEffect(() => {
		const localData = JSON.parse(localStorage.getItem("dataClaimMitra") || "[]");
		const combinedData = [...localData, ...dataDummySubrogasi];
		setFilteredData(combinedData);
	}, []);

	const handleDownloadPdf = row => {
		const fileContent = `Ini adalah contoh isi PDF untuk ${row.nomer}`;

		const blob = new Blob([fileContent], { type: "application/pdf" });

		const fileName = `Penjaminan-${row.nomer}.pdf`;

		saveAs(blob, fileName);
	};

	const columns = [
		{ name: translationData[code_lang]?.subrogasi?.sub1, selector: row => row.nomorSubrograsi, sortable: true },
		{ name: translationData[code_lang]?.subrogasi?.sub2, selector: row => row.nomorClaim, sortable: true },
		{
			name: translationData[code_lang]?.subrogasi?.sub3,
			selector: row => {
				// Untuk sorting - konversi ke Date object
				const [day, month, year] = row.tglPengajuan.split("/");
				return new Date(`${year}-${month}-${day}`);
			},
			sortable: true,
			cell: row => <span>{formatDateToDDMMYYYY(row.tglPengajuan)}</span>,
			format: row => formatDateToDDMMYYYY(row.tglPengajuan)
		},
		{
			name: translationData[code_lang]?.subrogasi?.status,
			selector: row => row.status || "Belum Ada",
			sortable: true,
			cell: row => {
				let badgeColor = "secondary";
				let badgeText = row.status;

				if (row.status === "Verified") {
					badgeColor = "success";
				} else badgeColor = "danger";
				return (
					<Badge pill bg={badgeColor} style={{ backgroundColor: "#ffa500", fontSize: "12px", padding: "5px 10px" }}>
						{badgeText}
					</Badge>
				);
			}
		},
		{
			name: translationData[code_lang]?.subrogasi?.action,
			cell: row => (
				<div style={{ display: "flex", gap: 10, justifyContent: "flex-start", minWidth: 80 }}>
					<FaEye style={{ cursor: "pointer", color: "blue", width: 20, height: 20 }} title="View" onClick={() => navigate(`/mitra/subrogasi/detail/${row.nomorSubrograsi}`)} />
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
		<Container fluid id="claim-page">
			<CardComponent type="index">
				<div className="content custom-style" style={{ marginTop: 15 }}>
					<Row className="align-items-end">
						<Col md={8}>
							<div className="d-flex align-items-end gap-2" style={{ flexWrap: "wrap" }}>
								<SearchListComponent ListDataStatus={listDataStatus} onChange={listFilter => console.log(listFilter)} />
							</div>
						</Col>
					</Row>
				</div>
				<div style={{ marginTop: 20 }}>
					<TableComponent columns={columns} data={filteredData} pagination paginationTotalRow={dataDummySubrogasi.length} customStyles={customStyles} />
				</div>
			</CardComponent>
		</Container>
	);
};

export default SubrogasiMitraPage;
