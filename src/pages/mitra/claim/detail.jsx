import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack, Image, Modal, Button, Card } from "react-bootstrap";
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
import { fnStoreClaim } from "./claimFn";
import logoMitra from "src/assets/image/logo-bank-bsi.png";
import imageSK from "src/assets/image/syarat-dan-ketentuan-bsi.webp";
import InputDateComponent from "src/components/partial/inputDateComponent";
import { Link, useNavigate, useParams } from "react-router";
import objectRouter from "src/utils/router/objectRouter";
import { dataDummyClaim } from "./dataDummyClaim";
import { getLogoPath } from "src/utils/getLogoByEmail";
// import { dataDummyDetailPenjaminan } from "../penjaminan/dataDummyDetailPenjaminan";
import { getDetailClaim } from "../../../utils/api/apiClaim";
import axios from "axios";
import { setDetailClaim, setLoading } from "./claimSlice";
import { show } from "../../../utils/api/apiPenjaminan";
import { fnGetClaimDetail } from "./penjaminanFn";
import { useLocation } from "react-router";
import { dataBank } from "../../../utils/dummy/dataBank";
import PreviewLampiranClaimGroupComponent from "../../../components/partial/previewLampiranClaimGroupComponent";

export default function DetailClaim() {
	const location = useLocation();
	const { claimNo } = location.state || {};
	// console.log('claim no : ', claimNo);
	const dispatch = useDispatch();
	const isLoading = useSelector(state => state.claim.isLoading);
	const detailClaim = useSelector(state => state.claim.listData);
	// console.log('detail claim : ', detailClaim);

	// const listDataPenyebabKlaim = [
	// 	{ value: "Kredit Macet", label: "Kredit Macet" },
	// 	{ value: "Meninggal Dunia", label: "Meninggal Dunia" },
	// 	{ value: "PHK", label: "PHK" },
	// 	{ value: "PAW", label: "PAW" }
	// ];

	useEffect(() => {
		if (claimNo) {
			fnGetClaimDetail(claimNo);
		}
	}, [claimNo]);

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
	const mitra_id = dataLogin.data.mitra_id;

	const logoPath = getLogoPath(mitra_id);

	const formatNoRupiah = value => {
		const strValue = String(value);
		const numericOnly = strValue.replace(/[^0-9]/g, "");
		const numericValue = Number(numericOnly);
		if (!numericValue) return "0";
		const formatted = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		return `${formatted}`;
	};

	const formatRupiah = value => {
		const strValue = String(value);
		const numericOnly = strValue.replace(/[^0-9]/g, "");
		const numericValue = Number(numericOnly);
		if (!numericValue) return "Rp 0";
		const formatted = numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		return `Rp ${formatted}`;
	};

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


	//  Format as Rupiah
	const tunggakan = parseFloat(detailClaim.tunggakan) || 0;
	const suku_bunga = parseFloat(detailClaim.suku_bunga) || 0;
	const total_bunga = tunggakan * (suku_bunga / 100);
	const denda = parseFloat(detailClaim.denda) || 0;
	const max_claim = parseFloat(detailClaim.max_claim) || 0;
	const plafon = parseFloat(detailClaim.plafon) || 0;

	// calculate
	const total = Number(tunggakan + total_bunga + denda);

	const coverage = detailClaim.coverage || 0;
	const totalXCoverage = total * (coverage / 100);

	console.log("total", total);
	console.log("total cove", totalXCoverage);

	const totalBungaRupiah = (parseFloat(detailClaim.suku_bunga || 0) / 100) * tunggakan;

	const selectedBank = dataBank.find(bank => detailClaim.code_bank === bank.bank_code);
	const labelBank = selectedBank?.nama_bank;

	const formatRupiahs = number => {
		return "Rp." + number.toLocaleString("id-ID");
	};
	return (
		<>
			<Container fluid id="create-claim-page">
				<Row>
					<CardComponent title="Create Claim" type="create" needFooter>
						<Form>
							<div className="form-header mb-4">
								<Row className="align-items-center">
									<Col xs={12} md={6} className="mb-3 mb-md-0">
										<div className="company-info">
											<h4 className="mb-2 text-primary">PT Bank Syariah Indonesia Tbk</h4>
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
										readOnly
										valueIndex
										label="Nomor Pengajuan"
										labelXl="3"
										value={detailClaim.penjaminan_no}
										name="penjaminan_no"
										formGroupClassName="gx-3"
										listDropdown={[{ value: detailClaim.penjaminan_no, label: detailClaim.penjaminan_no }]}
									/>
								</Col>
							</Row>
							{/* <Row>
								<Col lg={3}>
									<label>Lampiran</label>
								</Col>
								<Col lg={3} className="text-end">
									<div className="download-surat-link" onClick={downloadFormExcelTemplate}>
										<p>
											<u>Surat Pembatalan</u>
										</p>
									</div>
								</Col>
								<Col lg={3} className="text-end">
									<div className="download-surat-link" onClick={downloadFormExcelTemplate}>
										<p>
											<u>Surat Persetujuan</u>
										</p>
									</div>
								</Col>
							</Row> */}
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
										<strong>{detailClaim.nik || "-"}</strong>
									</label>
								</Col>
								<Col lg={3}>
									<label>Alamat</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{detailClaim.alamat || "-"}</strong>
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
										<strong>{detailClaim.nama || "-"}</strong>
									</label>
								</Col>
								<Col lg={3}>
									<label>Provinsi</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{detailClaim.provinsi || "-"}</strong>
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
										<strong>{detailClaim.npwp || "-"}</strong>
									</label>
								</Col>
								<Col lg={3}>
									<label>Kota</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{detailClaim.kota || "-"}</strong>
									</label>
								</Col>
							</Row>
							{/* Klaim */}
							<br />
							<Row>
								<Col lg={6}>
									<InputComponent type="text" label="No.Surat Pengajuan" labelXl="6" value={detailClaim.no_surat_pengajuan} name="no_surat_pengajuan" disabled />
								</Col>
								<Col lg={3}>
									<label>Jenis Produk</label>
								</Col>
								<Col lg={3}>
									<label>
										<strong>{detailClaim.jenis_produk || "-"}</strong>
									</label>
								</Col>
							</Row>
							<Row className="align-items-center mb-3">
								<Col xs={12} sm={6} md={4} lg={3} className="mb-2 mb-lg-0">
									<label className="form-label">Tanggal Surat Pengajuan</label>
								</Col>
								<Col xs={12} sm={6} md={4} lg={3} className="mb-2 mb-lg-0">
									<InputDateComponent
										labelXl="12"
										customLabelFrom=""
										formGroupClassName="startDateCredit"
										// startDate={detailClaim[objectName[1]]}
										// onChangeStartDate={e => handleChange(objectName[1], e)}
										value={detailClaim.tgl_surat_pengajuan}
										readOnly
									/>
								</Col>
								<Col xs={12} sm={1} md={4} lg={3} className="mb-2 mb-lg-0 ml-lg-">
									<label className="form-label">Plafon Kredit</label>
								</Col>
								<Col xs={12} sm={6} md={12} lg={3} className="text-end text-sm-start text-lg-end">
									<label className="form-label">
										<strong>Rp.{formatNoRupiah(detailClaim.plafon) || 0}</strong>
									</label>
								</Col>
							</Row>
							<Row>
								<Col lg={6}>
									<InputComponent type="text" label="Penyebab Klaim" labelXl="6" value={detailClaim.penyebab_claim} name="penyebab_klaim" disabled />
								</Col>
								<Col lg={3}>
									<label>Coverage</label>
								</Col>
								<Col lg={3} className="text-end">
									<label>
										<strong>{detailClaim.coverage || "0"} %</strong>
									</label>
								</Col>
							</Row>
							<Row>
								<Col lg={6}>
									<InputComponent type="text" label="Kolektabilitas" labelXl="6" value={detailClaim.kolektabilitas} name="kolektabilitas" disabled />
								</Col>
								<Col lg={3}>
									<label>Batas Max.Klaim</label>
								</Col>
								<Col lg={3} className="text-end">
									<label>
										<strong>{formatRupiah(detailClaim.max_claim)}</strong>
									</label>
								</Col>
							</Row>
							<Row>
								<Col lg={6}>
									<InputComponent type="text" label="No. Rekening" labelXl="6" value={detailClaim.no_rek} name="no_rek" disabled />
								</Col>
							</Row>
							<Row>
								<Col lg={6}>
									<InputComponent type="text" label="Bank" labelXl="6" value={labelBank || "-"} name="code_bank" disabled />
								</Col>
							</Row>
							<div className="bg-warning p-3 rounded-4">
								<Row>
									<Col lg={6}>
										<InputComponent
											type="text"
											// inputClassName="text-end"
											label="Nilai Pokok"
											labelXl="6"
											value={formatRupiahs(Number(detailClaim.tunggakan))}
											name="tunggakan"
											formGroupClassName="gx-2"
											disabled
										/>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										<label>
											<strong>Rp. {formatNoRupiah(Number(detailClaim.tunggakan))}</strong>
										</label>
									</Col>
								</Row>
								<Row>
									<Col lg={6}>
										<InputComponent
											type="text"
											// inputClassName="text-end"
											label="Bunga"
											labelXl="6"
											value={formatRupiah(Number(detailClaim.tunggakan) * (detailClaim.suku_bunga / 100)) || 0}
											name="bunga"
											formGroupClassName="gx-2"
											disabled
										/>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										<label>
											<strong>Rp.{formatNoRupiah(Number(detailClaim.tunggakan) * (detailClaim.suku_bunga / 100)) || 0}</strong>
										</label>
									</Col>
								</Row>
								<Row>
									<Col lg={6}>
										<InputComponent
											type="text"
											// inputClassName="text-end"
											label="Denda"
											labelXl="6"
											value={formatRupiah(detailClaim.denda) || 0}
											name="denda"
											// onChange={handleChangeDenda}
											formGroupClassName="gx-2"
											disabled
										/>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										<label>
											<strong>Rp.{formatNoRupiah(detailClaim.denda) || 0}</strong>
										</label>
									</Col>
								</Row>
								<Row>
									<Col lg={6}>
										<label>Total</label>
									</Col>
									<Col lg={3}></Col>
									<Col lg={3} className="text-end">
										{/* <label><strong>{formatNoRupiah(Number(valueTunggakan || 0) + Number(valueBunga || 0) + Number(valueDenda || 0))}</strong></label> */}
										<label>
											<strong>Rp.{formatNoRupiah(Number(detailClaim.total_klaim)) || 0}</strong>
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
											<strong>{detailClaim.coverage || 0} %</strong>
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
											<strong> {formatRupiahs(totalXCoverage)}</strong>
										</label>
									</Col>
								</Row>
							</div>
							<hr />
							<Row>
								<Col xs={12}>
									<h5 className="section-title mb-4 text-dark fw-bold">Lampiran File</h5>
								</Col>
							</Row>
							{/* <Row>
								{detailClaim.lampiran_details &&
									detailClaim.lampiran_details.map((item, index) => (
										<Col key={index} xs={4} className="mb-4">
											<CardComponent>
												<Card.Body>
													<Card.Title>{item.trx_no}</Card.Title>
												</Card.Body>
											</CardComponent>
										</Col>
									))}
							</Row> */}
							<Row className="mb-3">
								<Col xs={12}>
									<PreviewLampiranClaimGroupComponent 
									key="penjaminanPreview" 
									// mitra={entityName} 
									page="claim" 
									// jenisProduk={formData.jenisProduk} 
									listData={detailClaim.lampiran_details} 
									/>
								</Col>
							</Row>

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
						</Form>
					</CardComponent>
				</Row>
			</Container>
		</>
	);
}
