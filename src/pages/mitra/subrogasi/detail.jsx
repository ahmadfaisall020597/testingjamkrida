/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack, Image, Modal, Button, Badge } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
//import { fnStoreRoom } from "./roomFn";
import { History } from "src/utils/router";
import { toast } from "react-toastify";
import InputDateComponent from "src/components/partial/inputDateComponent";
import { data, useNavigate, useParams } from "react-router";
import objectRouter from "src/utils/router/objectRouter";
import TableComponent from "src/components/partial/tableComponent";

import { getLogoPath } from "src/utils/getLogoByEmail";
import { getMitraName } from "../../../utils/getLogoByEmail";
import { dataDummySubrogasi } from "./dataDummySubrogasi";
import { useSelector } from "react-redux";

/**
 * The CreateRoom component allows users to create a new room with specific attributes.
 * It initializes form data state and populates room type options from the redux store.
 * Users can input room details such as name, location, capacity, type, status, and upload an image.
 * The component validates form inputs before submission and handles form data submission to the server.
 * React hooks are utilized for managing form state and fetching room type data.
 */
const objectName = [
	"BIRTH_DATE", //0
	"START_DATE" //1
];

export default function SubrogasiMitraPageDetail() {
	const navigate = useNavigate();
	const { id } = useParams();
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);
	console.log('translate bahasa : ', translationData[code_lang]);

	const [formData, setFormData] = useState({
		nama: "",
		mitraPenjamin: "",
		piutangSubrogasi: "",
		sisaPiutangSubrogasi: "",
		pokokPembiayaan: "",
		klaimDisetujui: "",
		periodeAwal: "",
		jangkaWaktu: "",
		nomorSubrograsi: "",
		nomorClaim: "",
		tglPengajuan: "",
		status: "",
		subrogasi: [
			{
				no: 1,
				angsuran: "",
				noRefrensi: "",
				tanggalAngsuran: "",
				status: ""
			}
		]
	});

	useEffect(() => {
		if (id) {
			const existingData = JSON.parse(localStorage.getItem("dataPenjaminanMitra") || "[]");
			const combinedData = [...dataDummySubrogasi, ...existingData];

			const data = combinedData.find(item => item.nomorSubrograsi === id);
			if (data) {
				setFormData(data);
			}
		}
	}, [id]);

	const handleChange = (field, value) => {
		setFormData(prev => { });
	};

	const formatRupiah = number => {
		const numericValue = parseInt(number, 10);

		const formattedValue = new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0
		}).format(numericValue);

		return formattedValue;
	};

	const handleSubmit = event => {
		event.preventDefault();

		const existingData = JSON.parse(localStorage.getItem("dataPenjaminanMitra") || "[]");

		const today = new Date();
		const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

		const newEntry = {
			nomer: `PJN${Date.now()}`,
			tglPengajuan: formattedDate,
			...formData,
			status: "Processing"
		};

		const updatedData = [newEntry, ...existingData];
		localStorage.setItem("dataPenjaminanMitra", JSON.stringify(updatedData));

		toast.success("Data berhasil disimpan.");
		setTimeout(() => {
			navigate("/mitra/subrogasi");
		}, 2000);
	};

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

	const tableData = formData.subrogasi || [];
	const columns = [
		{ name: translationData[code_lang]?.subrogasi?.detail?.ang1, selector: row => row.no, sortable: true },
		{ name: translationData[code_lang]?.subrogasi?.detail?.ang2, selector: row => formatRupiah(row.angsuran), sortable: true },
		{ name: translationData[code_lang]?.subrogasi?.detail?.ang3, selector: row => row.noRefrensi, sortable: true },
		{ name: translationData[code_lang]?.subrogasi?.detail?.ang4, selector: row => row.tanggalAngsuran, sortable: true },
		{
			name: translationData[code_lang]?.subrogasi?.detail?.ang5,
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
		}
	];

	// logo
	const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
	const mitra_id = dataLogin.data.mitra_id;
	const logoPath = getLogoPath(mitra_id);

	const mitraName = getMitraName(mitra_id);

	return (
		<>
			<Container fluid id="subrogasi-page-detail">
				<Row>
					<CardComponent title="Detail Subrograsi" type="create" needFooter>
						<Form onSubmit={handleSubmit}>
							<div className="form-header mb-4">
								<Row className="align-items-center">
									<Col xs={12} md={6} className="mb-3 mb-md-0">
										<div className="company-info">
											<h4 className="mb-2 text-primary">{mitraName}</h4>
											<h5 className="mb-1 text-secondary">B001</h5>
											<span className="text-muted">Jenis 1</span>
										</div>
									</Col>
									<Col xs={12} md={6} className="text-end">
										<Image src={logoPath} className="img-fluid" role="button" width={150} height={80} style={{ maxWidth: "100%", height: "auto" }} />
									</Col>
								</Row>
							</div>
							<br />
							<br />
							<div className="mb-4">
								<div className="section-header mb-3">
									<h5 className="fw-bold border-bottom pb-2">{translationData[code_lang]?.subrogasi?.detail?.deb}</h5>
								</div>

								<Row className="g-3">
									<Col xs={12}>
										<InputComponent
											type="text"
											label={translationData[code_lang]?.subrogasi?.detail?.deb1}
											labelXl="3"
											value={formData.nama}
											name="nama"
											onChange={e => handleChange("nama", e.target.value)}
											required
											formGroupClassName="gx-2"
											placeholder="Masukkan nama debitur"
											disabled
										/>
									</Col>
									<Col xs={12}>
										<InputComponent
											type="text"
											label={translationData[code_lang]?.subrogasi?.detail?.deb2}
											labelXl="3"
											value={formData.mitraPenjamin}
											name="mitraPenjamin"
											onChange={e => handleChange("mitraPenjamin", e.target.value)}
											required
											formGroupClassName="gx-2"
											placeholder="Masukkan penerima jaminan"
											disabled
										/>
									</Col>
									<Col xs={12}>
										<InputComponent
											type="text"
											label={translationData[code_lang]?.subrogasi?.detail?.deb3}
											labelXl="3"
											value={formatRupiah(formData.piutangSubrogasi)}
											name="piutangSubrogasi"
											onChange={e => handleChange("piutangSubrogasi", e.target.value)}
											formGroupClassName="gx-2"
											placeholder="0"
											disabled
										/>
									</Col>
									<Col xs={12}>
										<InputComponent
											type="text"
											label={translationData[code_lang]?.subrogasi?.detail?.deb4}
											labelXl="3"
											value={formatRupiah(formData.sisaPiutangSubrogasi)}
											name="sisaPiutangSubrogasi"
											onChange={e => handleChange("sisaPiutangSubrogasi", e.target.value)}
											formGroupClassName="gx-2"
											placeholder="0"
											disabled
										/>
									</Col>
								</Row>
							</div>
							<br />
							<div className="mb-4">
								<div className="section-header mb-3">
									<h5 className=" fw-bold border-bottom pb-2">{translationData[code_lang]?.subrogasi?.detail?.jam}</h5>
								</div>

								<Row className="g-3">
									<Col xs={12}>
										<InputComponent
											type="text"
											label={translationData[code_lang]?.subrogasi?.detail?.jam1}
											labelXl="3"
											value={formatRupiah(formData.pokokPembiayaan)}
											name="pokokPembiayaan"
											onChange={e => handleChange("pokokPembiayaan", e.target.value)}
											formGroupClassName="gx-2"
											placeholder="0"
											disabled
										/>
									</Col>
									<Col xs={12}>
										<InputComponent
											type="text"
											label={translationData[code_lang]?.subrogasi?.detail?.jam2}
											labelXl="3"
											value={formatRupiah(formData.klaimDisetujui)}
											name="klaimDisetujui"
											onChange={e => handleChange("klaimDisetujui", e.target.value)}
											formGroupClassName="gx-2"
											placeholder="0"
											disabled
										/>
									</Col>
									<Row>
										<Col style={{ paddingLeft: "8px" }}> {translationData[code_lang]?.subrogasi?.detail?.jam3}</Col>
										<Col xs={9}>
											<InputDateComponent
												labelXl="3"
												value={formData.tglPengajuan}
												name="tglPengajuan"
												onChange={e => handleChange("tglPengajuan", e.target.value)}
												formGroupClassName="gx-2"
												readOnly
											/>
										</Col>
									</Row>

									<Col xs={12}>
										<InputComponent
											type="number"
											label={translationData[code_lang]?.subrogasi?.detail?.jam4}
											labelXl="3"
											value={formData.jangkaWaktu}
											name="jangkaWaktu"
											onChange={e => handleChange("jangkaWaktu", e.target.value)}
											formGroupClassName="gx-2"
											placeholder="0"
											disabled
										/>
									</Col>
								</Row>
							</div>

							<br />
							<div className="mb-4">
								<div className="section-header mb-3">
									<h5 className=" fw-bold border-bottom pb-2">{translationData[code_lang]?.subrogasi?.detail?.ang}</h5>
								</div>

								<TableComponent
									columns={columns}
									data={tableData}
									// pagination
									// paginationTotalRow={dataDummySubrogasi.length}
									customStyles={customStyles}
								/>
							</div>

							<div className="form-actions">
								<Row>
									<Col xs={12}>
										<Stack direction="horizontal" className="justify-content-end flex-wrap" gap={3}>
											<ButtonComponent
												className="px-4 py-2 fw-semibold order-2 order-sm-1"
												variant="outline-danger"
												onClick={() => History.navigate(objectRouter.SubrogasiMitraPage.path)}
												title={translationData[code_lang]?.global?.btn?.close}
											/>
										</Stack>
									</Col>
								</Row>
							</div>
						</Form>
					</CardComponent>
				</Row>
			</Container>
		</>
	);
}
