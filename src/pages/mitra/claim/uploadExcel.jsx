import { useEffect, useRef, useState } from "react";
import { Col, Container, Form, FormControl, Image, Row, Stack, Card, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { History } from "src/utils/router";
import objectRouter from "src/utils/router/objectRouter";
import CardComponent from "src/components/partial/cardComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import ButtonComponent from "src/components/partial/buttonComponent";
// import logoBankDKI from "src/assets/image/bank-dki-logo.png";
import snkBankDKI from "src/assets/image/snk-bank-dki.png";
import { templateFileBase64DataClaim } from "src/utils/dummy/templateFileBase64DataClaim";
import "./style.scss";

import { getLogoPath, getMitraName } from "src/utils/getLogoByEmail";
import { getEntitasName } from "../../../utils/getLogoByEmail";
// import { getSettingPerykeyAndMitra } from "../../../utils/api/apiSettings"

import { store } from "../../../utils/store/combineReducers";
import { storeBulk } from "../../../utils/api/apiClaim";

import { fnGetListProduk } from "./claimFn";
import { setShowLoadingScreen } from "../../../utils/store/globalSlice";
import { getLampiranMappingApi } from "../../../utils/api/apiSettings";

const templateBase64 = templateFileBase64DataClaim.excelFormClaim;
const downloadTemplateFileName = "template_form_claim_mitra.csv";

/**
 * The CreateRoom component allows users to create a new room with specific attributes.
 * It initializes form data state and populates room type options from the redux store.
 * Users can input room details such as name, location, capacity, type, status, and upload an image.
 * The component validates form inputs before submission and handles form data submission to the server.
 * React hooks are utilized for managing form state and fetching room type data.
 */
export default function ClaimMitraUploadExcelPage() {
	const navigate = useNavigate();
	const [lampiranArray, setLampiranArray] = useState([]);

	const { typeRoom } = useSelector(state => state.room);

	const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
	const mitra_id = dataLogin.data.mitra_id;
	const logoPath = getLogoPath(mitra_id);
	const mitraName = getMitraName(mitra_id);
	const entityName = getEntitasName(mitra_id);

	const wrapperRef = useRef(null);
	const onDragEnter = () => wrapperRef.current.classList.add("dragover");
	const onDragLeave = () => wrapperRef.current.classList.remove("dragover");
	const onDrop = () => wrapperRef.current.classList.remove("dragover");

	const [formData, setFormData] = useState({
		mitraID: mitra_id.toLowerCase(),
		idProduk: "",
		filesExcel: [],
		filesLampiran: [],
		menyetujuiSnk: false
	});
	const [showModalSnk, setModalSnk] = useState(false);

	useEffect(() => {
		if (typeRoom?.length > 0) {
			handleChange("valTypeRoom", typeRoom[0].value);
		}
	}, [typeRoom]);

	useEffect(() => {
		console.log("snk yu", formData.menyetujuiSnk);
	}, [formData.menyetujuiSnk]);

	useEffect(() => {
		console.log("fmd file", formData.image);
	}, [formData.image]);

	useEffect(() => {
		console.log("xdd file", formData.filesExcel);
	}, [formData.filesExcel]);

	useEffect(() => {
		fnGetListProduk()
	}, [])


	const claimSelector = useSelector(state => state.claim);

	const downloadFormExcelTemplate = () => {
		console.log("atob", templateBase64);
		const bytes = atob(templateBase64);
		const byteArr = new Array(bytes.length);
		for (let i = 0; i < bytes.length; i++) {
			byteArr[i] = bytes.charCodeAt(i);
		}
		const byteIntArr = new Uint8Array(byteArr);
		const blob = new Blob([byteIntArr], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		});

		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = downloadTemplateFileName;
		link.click();
		//clean url after download
		URL.revokeObjectURL(url);
	};

	// Handle change for form inputs
	const handleChange = async (key, value) => {
		if (key === "filesExcel" || key === "filesLampiran" || key === "menyetujuiSnk") {
			setFormData(prev => ({
				...prev,
				[key]: value
			}));
			return;
		}
		// const response = await getSettingPerykeyAndMitra("KLAIM_SETTINGS", entityName, value);
		const response = await getLampiranMappingApi({
			module: "KLAIM_SETTINGS",
			jenis_mitra: entityName,
			jenis_produk: value
		});
		console.log(response)
		const lampiranValues = response.data.data && response.data.data.length > 0
			? response.data.data.map(item => item.value)
			: [];

		console.log(lampiranValues); // Output: ['srtp']
		setLampiranArray(lampiranValues);
		if (formData.filesExcel.length > 0) {
			setFormData(prev => ({
				...prev,
				filesExcel: [],
				filesLampiran: []
			}));
		}
		setFormData(prev => ({
			...prev,
			[key]: value,
		}));
	};
	// Handle excel file input changes
	const handleExcelChange = fileData => {
		const files = Array.from(fileData.target.files);
		console.log("lampiranchange", fileData);
		console.log("lampirantarget", fileData.target.files);
		if (files.length > 0) {
			handleChange("filesExcel", files);
		} else {
			handleChange("filesExcel", null);
		}
	};

	// Handle lampiran file input changes
	const handleLampiranChange = fileData => {
		const files = Array.from(fileData.target.files);
		console.log("filechange", fileData);
		console.log("filetarget", fileData.target.files);
		if (fileData) {
			handleChange("filesLampiran", files);
		} else {
			handleChange("filesLampiran", null);
		}
	};

	const handleCheckMenyetujuiSnk = value => {
		console.log("check snk", value);
		handleChange("menyetujuiSnk", value);
	};

	// Validate the form before submitting
	const validateForm = () => {
		const { idProduk, filesExcel, filesLampiran, menyetujuiSnk } = formData;

		if (idProduk === "" || filesExcel.length === 0 || (lampiranArray.length > 0 && filesLampiran.length === 0)) {
			toast.error("Mohon isi semua form yang diperlukan.");
			return false;
		}

		if (menyetujuiSnk === false) {
			toast.error("Mohon untuk menyetujui Syarat dan Ketentuan yang berlaku.");
			return false;
		}

		const isValidExcelFiles = Array.isArray(formData.filesExcel) &&
			formData.filesExcel.every(file => {
				const ext = file.name.toLowerCase();
				return ext.endsWith(".csv");
			});

		if (!isValidExcelFiles) {
			toast.error("Upload Form hanya menerima file Excel (.csv)");
			return false;
		}

		if (filesLampiran.length > 0 && !filesLampiran[0].name.endsWith(".rar") && !filesLampiran[0].name.endsWith(".zip")) {
			toast.error("Upload Lampiran hanya menerima file RAR/ZIP.");
			return false;
		}

		return true;
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		const bodyFormData = new FormData();
		bodyFormData.append("PRODUCT_ID", formData.idProduk);

		if (formData.filesExcel && Array.isArray(formData.filesExcel)) {
			for (const [index, file] of formData.filesExcel.entries()) {
				if (file instanceof File) {
					const base64File = await formatFileToBas64(file);
					bodyFormData.append(`FormFile[${index}]`, base64File); // Append Base64 encoded file
				} else {
					console.error('Invalid file in filesExcel:', file);
				}
			}
		}

		console.log(formData.filesLampiran)
		// Convert files in filesLampiran to Base64
		// if (formData.filesLampiran) {
		if (lampiranArray.length > 0) {
			for (const [index, file] of formData.filesLampiran.entries()) {
				if (file instanceof File) {
					const base64File = await formatFileToBas64(file);
					bodyFormData.append(`LampiranFile[${index}]`, base64File); // Append Base64 encoded file
				} else {
					console.error('Invalid file in filesLampiran:', file);
				}
			}
		} else {
			bodyFormData.append(`LampiranFile[]`, []);
		}


		bodyFormData.append("SNK_STATUS", formData.menyetujuiSnk);
		bodyFormData.append("Mitra_ID", formData.mitraID)

		bodyFormData.forEach((value, key) => {
			console.log(key, value);
		});

		store.dispatch(setShowLoadingScreen(true));
		storeBulk(bodyFormData).then((res) => {
			store.dispatch(setShowLoadingScreen(false));
			const response = res.data;
			toast.success(response.message || "Data berhasil disimpan");
			if (Array.isArray(response.missing_files) && response.missing_files.length > 0) {
				response.missing_files.forEach((item) => {
					const missingList = item.file.join(', ');
					toast.warning(`NIK ${item.NIK} missing dokumen: ${missingList}`);
				});
			}
		}).catch((error) => {
			console.log("err api store pnj csv", error);
			store.dispatch(setShowLoadingScreen(false));
		});
	};

	const formatFileToBas64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => {
				resolve(reader.result);
			}
			reader.onerror = (error) => {
				console.error('Error:', error);
				resolve(null);
			}
			reader.readAsDataURL(file);
		});
	}

	return (
		<Container fluid id="claim-mitra-upload-excel-page">
			<CardComponent title="Upload Claim" type="create">
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
				<Row>
					<Col className="content mt-3">
						<hr />
					</Col>
				</Row>
				<Row>
					<div className="content mt-3 pb-4">
						<Form onSubmit={handleSubmit}>
							<Row>
								<Col>
									<InputDropdownComponent
										listDropdown={claimSelector.listProduk.length > 0 ? claimSelector.listProduk : []}
										valueIndex
										label="Jenis Produk"
										required
										labelXl="2"
										value={formData.idProduk}
										onChange={async e => {
											const selectedValue = e.target.value;
											handleChange("idProduk", selectedValue);
										}}
										formGroupClassName="gx-2"
									/>
								</Col>
							</Row>
							{/* UPLOAD excel section */}
							<Row>
								<Col sm={3}>
									<div>
										<p>
											Upload Form<span className="text-danger">*</span>
										</p>
									</div>
								</Col>
								<Col sm={6}></Col>
								<Col sm={3}>
									<div className="text-end download-template-link" onClick={downloadFormExcelTemplate}>
										<p>
											<u>Download Template</u>
										</p>
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<Card className="text-center border-black">
										<Card.Body className="p-0">
											<div ref={wrapperRef} className="drop-file-input" onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
												<div className="w-100 h-50 text center align-content-end">
													<Card.Title>Drop file or click here to upload</Card.Title>
												</div>
												<div className="w-100 h-50 text center align-content-start">
													{formData.filesExcel.length === 0 ? (
														<Card.Text>No file selected</Card.Text>
													) : (
														Array.from(formData.filesExcel).map((file, index) => (
															<Card.Text key={index}>{file.name}</Card.Text>
														))
													)}
												</div>
												<FormControl type="file" multiple accept=".csv" onChange={handleExcelChange} />
											</div>
										</Card.Body>
									</Card>
								</Col>
							</Row>

							<Row>
								<Col className="mt-3">
									<div className="mt-3">
										<p>
											Upload Lampiran.zip (
											{lampiranArray.length > 0 ? lampiranArray.join(",").toLocaleUpperCase() : "No lampiran available"})
											<span className="text-danger">
												*</span>
										</p>
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<Card className="text-center border-black">
										<Card.Body className="p-0">
											<div ref={wrapperRef} className="drop-file-input" onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDrop={onDrop}>
												<div className="w-100 h-50 text center align-content-end">
													<Card.Title>Drop file or click here to upload</Card.Title>
												</div>
												<div className="w-100 h-50 text center align-content-start">
													{formData.filesLampiran.length === 0 && <Card.Text>No file selected</Card.Text>}
													{formData.filesLampiran.length > 0 && <Card.Text>{formData.filesLampiran[0].name}</Card.Text>}
												</div>
												<FormControl type="file" accept=".zip,.rar" onChange={handleLampiranChange} />
											</div>

											<div ref={wrapperRef}>

											</div>
										</Card.Body>
									</Card>
								</Col>
							</Row>
							{/* UPLOAD excel section (END) */}
							{/* UPLOAD Lampiran section */}

							{/* UPLOAD Lampiran section (END) */}
							<Row className="mt-3">
								<Col sm={2} />
								<Col sm={2} className="text-end">
									<Form.Check type="checkbox" className="h1 w-100 border-black" checked={formData.menyetujuiSnk === true} onChange={() => handleCheckMenyetujuiSnk(!formData.menyetujuiSnk)} />
								</Col>
								<Col>
									<div className="h-100 align-content-center">
										<p className="m-0">
											Saya menyetujui <Link onClick={() => setModalSnk(!showModalSnk)}>Syarat dan Ketentuan</Link> yang berlaku
											<span className="text-danger">*</span>
										</p>
									</div>
								</Col>
							</Row>
							<Row>
								<Col>
									<div className="text-danger">
										<p>
											<b>*) Wajib diisi</b>
										</p>
									</div>
								</Col>
							</Row>
							<div>
								<Stack direction="horizontal" className="mt-3 justify-content-center" gap={3}>
									<ButtonComponent className="px-sm-5 fw-semibold" variant="warning" title="Submit" type="submit" />
									<ButtonComponent className="px-sm-5 fw-semibold" variant="outline-danger" onClick={() => History.navigate(objectRouter.ClaimMitraPage.path)} title="Cancel" />
								</Stack>
							</div>
						</Form>
					</div>
				</Row>
			</CardComponent>
			<Modal show={showModalSnk}>
				<Modal.Header>
					<Modal.Title>Syarat dan Ketentuan</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Image src={snkBankDKI} className="w-100 h-auto" />
				</Modal.Body>
				<Modal.Footer>
					<ButtonComponent onClick={() => setModalSnk(!showModalSnk)} title={"Saya Mengerti"} />
				</Modal.Footer>
			</Modal>
		</Container>
	);
}
