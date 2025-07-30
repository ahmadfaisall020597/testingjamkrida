/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack, Image, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputImageComponent from "src/components/partial/inputImageComponent";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
//import { fnStoreRoom } from "./roomFn";
import { History } from "src/utils/router";
import { toast } from "react-toastify";
import { formatNumberWithThousandSeparator, removeThousandSeparator } from "src/utils/helpersFunction";
// import { fnStoreClaim } from "./claimFn";
import logoMitra from "src/assets/image/logo-bank-bsi.png";
import imageSK from "src/assets/image/syarat-dan-ketentuan-bsi.webp";
import InputDateComponent from "src/components/partial/inputDateComponent";
import { Link, useNavigate } from "react-router";
import objectRouter from "src/utils/router/objectRouter";
import { dataDummyClaim } from "./dataDummyClaim";
import { getLogoPath } from "src/utils/getLogoByEmail";
import { getEntitasName, getMitraName } from "../../../utils/getLogoByEmail";
import { fnGetList, fnResetLampiranMitra, fnShowPenjaminan } from "../penjaminan/penjaminanFn";
import { dataBank } from "../../../utils/dummy/dataBank";
import { fnSubmitClaim } from "./penjaminanFn";
import dayjs from "dayjs";
import InputLampiranGroupComponent from "../../../components/partial/inputLampiranGroupComponent";
import { asyncConvertFileToBase64 } from "../../../utils/helpersFunction";
import { store } from "../../../utils/store/combineReducers";
import { resetNewDocumentClaim } from "./claimSlice";
import { setShowLoadingScreen } from "../../../utils/store/globalSlice";

/**
 * The CreateRoom component allows users to create a new room with specific attributes.
 * It initializes form data state and populates room type options from the redux store.
 * Users can input room details such as name, location, capacity, type, status, and upload an image.
 * The component validates form inputs before submission and handles form data submission to the server.
 * React hooks are utilized for managing form state and fetching room type data.
 */
const objectName = [
	"birthDate", //0
	"startDateCredit" //1
];

const listDataPenyebabKlaim = [
	{ value: "Kredit Macet", label: "Kredit Macet" },
	{ value: "Meninggal Dunia", label: "Meninggal Dunia" },
	{ value: "PHK", label: "PHK" },
	{ value: "PAW", label: "PAW" }
];

const BankData = dataBank.map(item => {
	return {
		value: item.bank_code,
		label: item.singkatan + " - " + item.nama_bank
	};
});

export default function CreateClaim() {
	const listPenjaminan = useSelector(state => state.penjaminan.listPenjaminan);
	const showPenjaminan = useSelector(state => state.penjaminan.showPenjaminan);
	const lampiranForm = useSelector(state => state.penjaminan.uploadLampiranList);
	console.log('show jenis penjaminan : ', showPenjaminan);
	const lampiranClaim = useSelector(state => state.claim.newDocument);
	const [errors, setErrors] = useState({});
	const navigate = useNavigate();
	const [filteredDataPengajuan, setFilteredDataPengajuan] = useState([]);
	const [dataCombined, setDataCombined] = useState([]);
	const [valueTunggakan, setValueTunggakan] = useState("");
	const [valueBunga, setValueBunga] = useState("");
	const [valueDenda, setValueDenda] = useState("");
	const [countData, setCountData] = useState(0);
	const [formData, setFormData] = useState({
		nomorPengajuan: "",
		nomorSuratPengajuan: "",
		nomorSP: 0,
		penyebabKlaim: "",
		kolektabilitas: 0,
		tunggakan: 0,
		bunga: 0,
		denda: 0,
		coverage: 70,
		nik: 0,
		name: "",
		npwp: 0,
		noTelp: 0,
		tempatLahir: "",
		dateBirth: Date,
		alamat: "",
		provinsi: "",
		kota: "",
		kecamatan: "",
		kelurahan: "",
		jenisProduk: "",
		plafonKredit: 0,
		nilaiPenjaminan: "",
		no_rek: "",
		bank: "",
		sukuBunga: 0,
		total: 0,
		totalXCoverage: 0,
		startDateCredit: Date,
		tglPengajuan: Date,
		jangkaWaktu: 0,
		status: true,
		menyetujuiSK: false
	});
	const [penjaminanMitra, setPenjaminanMitra] = useState("");
	// Validation rules (adjust the length as needed)
	const maxLength = {
		nomorSP: 30,
		nik: 16,
		name: 256,
		tempatLahir: 100,
		noTelp: 13,
		alamat: 500
	};

	// Validate input length
	const validateInput = (key, value) => {
		// Only validate fields that have maxLength defined
		if (maxLength[key] !== undefined) {
			return value.length <= maxLength[key];
		}
		return true; // No validation needed for this field
	};
	// Handle change for form inputs
	const handleChange = (field, value) => {
		if (!validateInput(field, value)) {
			console.warn(`Input for ${field} exceeds maximum length of ${maxLength[field]}`);
			return;
		}

		if (field === "nomorPengajuan" && value === "") {
			setFormData({
				nomorPengajuan: "",
				nomorSuratPengajuan: "",
				nik: "",
				name: "",
				alamat: "",
				provinsi: "",
				kota: "",
				kecamatan: "",
				kelurahan: "",
			});
			return;
		}

		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: null }));
		}

		if (field === "nomorPengajuan" && listPenjaminan?.data?.length) {
			const found = listPenjaminan.data.find(item => item.trx_no === value);
			if (found) {
				console.log("found : ", found);
				setFormData(prev => ({
					...prev,
					...found,
					nomorPengajuan: value,
					nomorSuratPengajuan: generateNomorSurat(value)
				}));
			} else {
				setFormData(prev => ({
					...prev,
					[field]: value
				}));
			}
			console.log("value : ", value);
			if (value) {
				fnShowPenjaminan(value, { hide_lampiran: true });
			}
		} else {
			setFormData(prev => ({
				...prev,
				[field]: value
			}));
		}
	};



	const handleCheckMenyetujuiSnk = value => {
		handleChange("menyetujuiSK", value);
	};

	// Validate the form before submitting
	const validateForm = () => {
		const { nik, name, npwp, noTelp, tempatLahir, alamat, nilaiPenjaminan } = formData;

		return true;
	};

	const formatRupiah = value => {
		// Convert to string first
		const strValue = String(value);
		const numericOnly = strValue.replace(/[^0-9]/g, "");
		const numericValue = Number(numericOnly);
		if (!numericValue) return "Rp 0";
		// Add thousand separator using comma
		const formatted = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		return `Rp ${formatted}`;
	};
	const formatNoRupiah = value => {
		// Convert to string first
		const strValue = String(value);
		const numericOnly = strValue.replace(/[^0-9]/g, "");
		const numericValue = Number(numericOnly);
		if (!numericValue) return "0";
		// Add thousand separator using comma
		const formatted = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		return `${formatted}`;
	};
	const handleChangeTunggakan = e => {
		const rawValue = e.target.value;
		const numericValue = rawValue.replace(/[^\d]/g, "");
		setValueTunggakan(numericValue);
		setFormData(prev => {
			return {
				...prev,
				tunggakan: numericValue
			};
		});
	};
	const handleChangeBunga = e => {
		const rawValue = e.target.value;
		const numericValue = rawValue.replace(/[^\d]/g, "");
		setValueBunga(numericValue);
		setFormData(prev => {
			return {
				...prev,
				bunga: numericValue
			};
		});
	};
	const handleChangeDenda = e => {
		const rawValue = e.target.value;
		const numericValue = e.target.value.replace(/[^\d]/g, "");

		setValueDenda(numericValue);
		setFormData(prev => {
			const rawTotal = Number(valueTunggakan || 0) + Number(totalBungaRupiah || 0) + Number(numericValue || 0);
			const coverage = Number(prev.coverage || 0);
			const total = formatNoRupiah(rawTotal);
			const resultNumber = rawTotal * (coverage / 100);
			const formatNoRupiahs = (number) => {
				return 'Rp.' + number.toLocaleString('id-ID');
			};
			const totalXCoverage = formatNoRupiahs(resultNumber);

			return {
				...prev,
				denda: numericValue,
				total,
				totalXCoverage
			};
		});
	};
	// const handleSubmit = event => {
	// 	event.preventDefault();

	// 	if (!validateForm()) return;

	// 	const existingData = JSON.parse(localStorage.getItem("dataClaimMitra") || "[]");

	// 	const today = new Date();
	// 	const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

	// 	const newEntry = {
	// 		nomorClaim: `CLM${Date.now()}`,
	// 		tglPengajuan: formattedDate,
	// 		...formData,
	// 		status: "Processing"
	// 	};

	// 	const updatedData = [newEntry, ...existingData];
	// 	localStorage.setItem("dataClaimMitra", JSON.stringify(updatedData));
	// 	toast.success("Data berhasil disimpan.");
	// 	setTimeout(() => {
	// 		navigate("/mitra/claim");
	// 	}, 1000);
	// };

	const handleSubmit = (e) => {
		e.preventDefault();
		const generatedClaimNo = `CLM${Date.now()}`;
		const dataLoginString = localStorage.getItem('dataLogin');
		const dataLogin = dataLoginString ? JSON.parse(dataLoginString) : null;
		console.log('data login : ', dataLogin);
		if (!dataLogin || !dataLogin.data.mitra_id) {
			alert("Data login tidak ditemukan.");
			return;
		}
		const formattedDate = dayjs(formData.startDateCredit).format("YYYY-MM-DD");

		const errors = {};

		if (!formData.penyebabKlaim) {
			errors.penyebabKlaim = "Penyebab klaim wajib diisi.";
		}

		if (!formData.nomorPengajuan) {
			errors.nomorPengajuan = "Nomor pengajuan wajib diisi.";
		}

		if (!valueTunggakan) {
			errors.valueTunggakan = "Tunggakan wajib diisi.";
		}

		if (!valueDenda || Number(valueDenda) === 0) {
			errors.valueDenda = "Denda wajib diisi.";
		}

		if (!formData.no_rek) {
			errors.no_rek = "Nomor rekening wajib diisi.";
		}

		if (!formData.bank) {
			errors.bank = "Bank wajib diisi.";
		}

		if (!formData.total) {
			errors.total = "Total klaim wajib diisi.";
		}

		if (Object.keys(errors).length > 0) {
			setErrors(errors);
			alert("Mohon lengkapi data yang wajib diisi.");
			return;
		}
		const cleanedTotal = parseInt(String(formData.total).replace(/[^\d]/g, ""), 10);

		const newDocumentKeys = lampiranClaim.map(doc => doc.key);
		const missingUploadIndex = lampiranForm.findIndex(upload => !newDocumentKeys.includes(upload.value));
		if(missingUploadIndex !== -1) {
			alert(`Lampiran ${lampiranForm[missingUploadIndex].label} wajib diupload`);
			return;
		}

		const lampiranSubmit = lampiranClaim.map((data) => {
			let dataLampiran = {
				file: null,
				lampiran_id: data.key
			};
			asyncConvertFileToBase64(data.data).then(res => {
				dataLampiran.file = res;
			}).catch(err => {
				console.log("convert err", err);
			});
			return dataLampiran;
		})

		const payload = {
			claim_no: generatedClaimNo,
			mitra_id: dataLogin.data.mitra_id,
			penjaminan_no: formData.nomorPengajuan,
			plafon: formData.plafonKredit,
			no_surat_pengajuan: formData.nomorSuratPengajuan,
			tgl_surat_pengajuan: formattedDate,
			penyebab_claim: formData.penyebabKlaim,
			kolektabilitas: formData.kolektabilitas,
			no_rek: formData.no_rek,
			code_bank: formData.bank,
			tunggakan: valueTunggakan,
			denda: valueDenda,
			suku_bunga: formData.bunga,
			total_klaim: cleanedTotal,
			lampiran: lampiranSubmit,
			//hardcode value coverage 
			coverage : 70
		};

		store.dispatch(setShowLoadingScreen(true));
		setTimeout(() => {
			fnSubmitClaim(payload);
		}, 1000);
	};



	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	useEffect(() => {
		fnGetList();
		fnResetLampiranMitra();
	}, []);

	useEffect(() => {
		const dataLoginString = localStorage.getItem('dataLogin');
		const dataLogin = dataLoginString ? JSON.parse(dataLoginString) : null;
		
		if (listPenjaminan?.data?.length > 0 && dataLogin?.data?.mitra_id) {
			const dropdownNoPengajuan = listPenjaminan.data
				.filter(item => item.mitra_id === dataLogin.data.mitra_id)
				.map(item => ({
					value: item.trx_no,
					label: item.trx_no
				}));
			
			setFilteredDataPengajuan(dropdownNoPengajuan);
		}
	}, [listPenjaminan]);

	useEffect(() => {
		fnResetLampiranMitra();
		store.dispatch(resetNewDocumentClaim());
		store.dispatch(setShowLoadingScreen(true));
		if (
			formData.nomorPengajuan &&
			showPenjaminan &&
			Object.keys(showPenjaminan).length > 0
		) {

			setFormData(prev => ({
				...prev,
				nik: showPenjaminan.nik || "",
				name: showPenjaminan.nama || "",
				alamat: showPenjaminan.alamat || "",
				provinsi: showPenjaminan.provinsi || "",
				kota: showPenjaminan.kota || "",
				kecamatan: showPenjaminan.kecamatan || "",
				kelurahan: showPenjaminan.kelurahan || "",
				npwp: showPenjaminan.npwp || "",
				noTelp: showPenjaminan.no_telp || "",
				tempatLahir: showPenjaminan.tmp_lahir || "",
				birthDate: showPenjaminan.tgl_lahir || "",
				jenis_produk_name: showPenjaminan.jenis_produk_name || "",
				jenisProduk: showPenjaminan.jenis_produk,
				plafonKredit: showPenjaminan.plafon_kredit || "",
				bunga: showPenjaminan.suku_bunga || "",
				nomorSuratPengajuan: generateNomorSurat(showPenjaminan.trx_no || prev.nomorPengajuan),
			}));
			setPenjaminanMitra(showPenjaminan.mitra_id);
		}
		store.dispatch(setShowLoadingScreen(false));
	}, [showPenjaminan, formData.nomorPengajuan]);

	const generateNomorSurat = nomor => {
		return `SURAT-${nomor}`;
	};

	const formatPersen = (value) => {
		if (!value) return "";
		return `${parseFloat(value).toFixed(2)}%`;
	};

	const totalBungaRupiah = (parseFloat(formData.bunga || 0) / 100) * parseFloat(valueTunggakan || 0);

	// logo
	const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
	const mitra_id = dataLogin.data.mitra_id;

	const logoPath = getLogoPath(mitra_id);
	const mitraName = getMitraName(mitra_id);

	return (
		<>
			<Container fluid id="create-claim-page">
				<Row>
					<CardComponent title="Create Claim" type="create" needFooter>
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
							<Row>
								<Col>
									<InputDropdownComponent
										disabled={false}
										listDropdown={
											!filteredDataPengajuan
												? []
												: [{ value: "", label: "-- Pilih Nomor Pengajuan --" }, ...filteredDataPengajuan]
										}
										valueIndex
										label="Nomor Pengajuan"
										labelXl="3"
										value={formData.nomorPengajuan}
										name="nomorPengajuan"
										onChange={e => handleChange("nomorPengajuan", e.target.value)}
										formGroupClassName="gx-3"
										isInvalid={!!errors.nomorPengajuan}
									/>
								</Col>
							</Row>
							<hr />
							<Row>
								<Col xs={12}>
									<h5 className="section-title mb-4 text-dark fw-bold">Data Pemohon</h5>
								</Col>
							</Row>
							<br />
							<Row>
								<Col lg={3}>
									<label>NIK</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.nik || "-"}</strong>
									</label>
								</Col>
								<Col lg={3}>
									<label>Alamat</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.alamat || "-"}</strong>
									</label>
								</Col>
							</Row>
							<br />
							<Row>
								<Col lg={3}>
									<label>Nama</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.name || "-"}</strong>
									</label>
								</Col>
								<Col lg={3}>
									<label>Provinsi</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.provinsi || "-"}</strong>
									</label>
								</Col>
							</Row>
							<br />
							<Row>
								<Col lg={3}>
									<label>No.NPWP</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.npwp || "-"}</strong>
									</label>
								</Col>
								<Col lg={3}>
									<label>Kota</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.kota || "-"}</strong>
									</label>
								</Col>
							</Row>
							<br />
							<Row>
								<Col lg={3}>
									<label>No.Telp</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.noTelp || "-"}</strong>
									</label>
								</Col>
								<Col lg={3}>
									<label>Kecamatan</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.kecamatan || "-"}</strong>
									</label>
								</Col>
							</Row>
							<br />
							<Row>
								<Col lg={3}>
									<label>Tempat / Tgl Lahir</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong> {formData.tempatLahir && formData.birthDate ? `${formData.tempatLahir}, ${new Date(formData.birthDate).toLocaleDateString("id-ID")}` : "-"}</strong>
									</label>
								</Col>
								<Col lg={3}>
									<label>Kelurahan</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.kelurahan || "-"}</strong>
									</label>
								</Col>
							</Row>
							<br />
							<br />
							<Row>
								<Col xs={12}>
									<h5 className="section-title mb-4 text-dark fw-bold">Klaim</h5>
								</Col>
							</Row>
							<br />
							<Row>
								<Col lg={6}>
									<InputComponent
										type="text"
										label="No.Surat Pengajuan"
										labelXl="6"
										value={formData.nomorSuratPengajuan}
										name="nomorSuratPengajuan"
										onChange={e => handleChange("nomorSuratPengajuan", e.target.value)}
										formGroupClassName="gx-4"
										disabled
									/>
								</Col>
								<Col lg={3}>
									<label>Jenis Produk</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{formData.jenis_produk_name || "-"}</strong>
									</label>
								</Col>
							</Row>
							<Row className="align-items-center mb-3">
								<Col xs={12} sm={6} md={4} lg={3} className="mb-2 mb-lg-0">
									<label className="form-label">Tgl Surat Pengajuan</label>
								</Col>
								<Col xs={12} sm={6} md={4} lg={3} className="mb-2 mb-lg-0 mr">
									<InputDateComponent labelXl="12" customLabelFrom="" formGroupClassName="startDateCredit" onChangeStartDate={e => handleChange(objectName[1], e)} value={formData.startDateCredit} />
								</Col>
								<Col xs={12} sm={1} md={4} lg={3} className="mb-2 mb-lg-0 ml-lg-">
									<label className="form-label">Plafon Kredit</label>
								</Col>
								<Col xs={12} sm={6} md={12} lg={3} className="text-end text-sm-start text-lg-end">
									<label className="form-label">
										<strong>Rp.{formatNoRupiah(formData.plafonKredit) || 0}</strong>
									</label>
								</Col>
							</Row>
							<Row>
								<Col lg={6}>
									<InputDropdownComponent
										disabled={!formData.penyebabKlaim}
										listDropdown={!listDataPenyebabKlaim ? [] : [{ value: "", label: "-- Pilih Penyebab Klaim --" }, ...listDataPenyebabKlaim]}
										valueIndex
										label="Penyebab Klaim"
										labelXl="6"
										value={formData.penyebabKlaim}
										name="penyebabKlaim"
										onChange={e => handleChange("penyebabKlaim", e.target.value)}
										formGroupClassName="gx-4"
										isInvalid={!!errors.penyebabKlaim}
									/>
								</Col>
								<Col lg={3}>
									<label>Coverage</label>
								</Col>
								<Col lg={3} className="text-end">
									<label>70 %</label>
								</Col>
							</Row>
							<Row>
								<Col lg={6}>
									<InputComponent
										type="number"
										inputClassName="text-end"
										label="Kolektabilitas"
										labelXl="6"
										value={formData.kolektabilitas}
										name="koletabilitas"
										onChange={e => handleChange("kolektabilitas", e.target.value)}
										formGroupClassName="gx-4"
										placeholder="0"
									/>
								</Col>
								<Col lg={3}>
									<label>Batas Max.Klaim</label>
								</Col>
								<Col lg={3} className="text-end">
									<label>
										<strong>Rp. 14.000.000.000</strong>
									</label>
								</Col>
							</Row>

							<Row>
								<Col lg={6}>
									<InputComponent
										type="number"
										inputClassName="text-end"
										label="Nomor Rekening"
										labelXl="6"
										value={formData.no_rek}
										name="koletabilitas"
										onChange={e => handleChange("no_rek", e.target.value)}
										formGroupClassName="gx-4"
										placeholder="0"
										isInvalid={!!errors.no_rek}
										errorMessage={errors.no_rek}
									/>
								</Col>
							</Row>
							<Row>
								<Col lg={6}>
									<InputDropdownComponent
										disabled={!formData.bank}
										listDropdown={!BankData ? [] : [{ value: "", label: "-- Pilih Bank --" }, ...BankData]}
										valueIndex
										label="Bank"
										labelXl="6"
										value={formData.bank}
										name="bank"
										onChange={e => handleChange("bank", e.target.value)}
										formGroupClassName="gx-4"
										isInvalid={!!errors.bank}
									/>
								</Col>
							</Row>
							<div className="bg-warning p-3 rounded-4">
								<Row>
									<Col lg={6}>
										<InputComponent
											type="text"
											inputClassName="text-end"
											label="Tunggakan"
											labelXl="6"
											value={formatRupiah(valueTunggakan)}
											name="tunggakan"
											onChange={handleChangeTunggakan}
											formGroupClassName="gx-2"
											isInvalid={!!errors.valueTunggakan}
											errorMessage={errors.valueTunggakan}
										/>
									</Col>
									<Col lg={3}>
										<label></label>
									</Col>
									<Col lg={3} className="text-end">
										<label>
											<strong>Rp. {formatNoRupiah(valueTunggakan)}</strong>
										</label>
									</Col>
								</Row>
								<Row>
									<Col lg={6}>
										<InputComponent
											type="text"
											inputClassName="text-end"
											label="Bunga"
											labelXl="6"
											value={formatPersen(formData.bunga)}
											name="bunga"
											// onChange={handleChangeBunga}
											disabled
											formGroupClassName="gx-2"
										/>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										<label>
											<strong>Rp.{formatNoRupiah(totalBungaRupiah)}</strong>
										</label>
									</Col>
								</Row>
								<Row>
									<Col lg={6}>
										<InputComponent
											type="text"
											inputClassName="text-end"
											label="Denda"
											labelXl="6"
											value={formatRupiah(valueDenda)}
											name="denda"
											onChange={handleChangeDenda}
											formGroupClassName="gx-2"
											isInvalid={!!errors.valueDenda}
											errorMessage={errors.valueDenda}
										/>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										<label>
											<strong>Rp.{formatNoRupiah(valueDenda)}</strong>
										</label>
									</Col>
								</Row>
								<Row>
									<Col lg={6}>
										<label>Total</label>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										<label>
											<strong>Rp.{formatNoRupiah(formData.total) || 0}</strong>
										</label>
									</Col>
								</Row>
								<br />
								<Row>
									<Col lg={6}>
										<label>Coverage</label>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										<label>
											<strong>Rp.{formData.coverage || 0} %</strong>
										</label>
									</Col>
								</Row>
								<br />
								<Row>
									<Col lg={6}>
										<label>Total x Coverage</label>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										<label>
											<strong> Rp.{formatNoRupiah(formData.totalXCoverage)}</strong>
										</label>
									</Col>
								</Row>
							</div>
							<br />
							{formData.nomorPengajuan && formData.jenisProduk && penjaminanMitra && (
								<div className="form-section my-4">
									<Row>
										<Col xs={12}>
											<h5 className="section-title mb-4 text-dark fw-bold">
												Lampiran Dokumen
											</h5>
										</Col>
									</Row>
									<InputLampiranGroupComponent
										key="lampiranClaimNew"
										mitra={penjaminanMitra}
										page="claim"
										jenisProduk={formData.jenisProduk}
									/>
								</div>
							)}
							<br />
							<div className="form-section mb-4">
								<Row>
									<Col xs={12}>
										<div className="d-flex align-items-start gap-3 p-3 bg-light rounded">
											<Form.Check type="checkbox" className="mt-1" checked={formData.menyetujuiSK === true} onChange={() => handleCheckMenyetujuiSnk(!formData.menyetujuiSK)} />
											<div className="flex-grow-1">
												<p className="m-0 text-muted">
													Saya setuju dengan{" "}
													<b>
														<Link onClick={handleShow} className="text-primary">
															Syarat dan Ketentuan
														</Link>
													</b>{" "}
													yang berlaku.
												</p>
											</div>
										</div>
									</Col>
								</Row>
							</div>
							<div className="form-actions">
								<Row>
									<Col xs={12}>
										<Stack direction="horizontal" className="justify-content-end flex-wrap" gap={3}>
											<ButtonComponent
												className="px-4 py-2 fw-semibold order-2 order-sm-1"
												variant="outline-danger"
												onClick={() => History.navigate(objectRouter.ClaimMitraPage.path)}
												title="Cancel"
											/>
											<ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="warning" title="Submit" type="submit" disabled={!formData.menyetujuiSK} />
										</Stack>
									</Col>
								</Row>
							</div>
						</Form>
					</CardComponent>
				</Row>
			</Container>

			<Modal show={show}>
				<Modal.Header>
					<Modal.Title>Syarat dan Ketentuan</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Image src={imageSK} className="h-100" role="button" />
				</Modal.Body>
				<Modal.Footer>
					<ButtonComponent onClick={handleClose} title={"Saya Mengerti"} />
				</Modal.Footer>
			</Modal>
		</>
	);
}
