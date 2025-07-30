import { useNavigate, useParams } from "react-router";
import { Container, Row, Col, Image, Form, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { store } from "src/utils/store/combineReducers";
import { fnGetRejectedLampiranClaim } from "./claimFn";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputLampiranGroupComponent from "src/components/partial/inputLampiranGroupComponent";
import { getLogoPath, getMitraName } from "src/utils/getLogoByEmail";
import objectRouter from "src/utils/router/objectRouter";
import { resetLampiranList } from "src/pages/mitra/penjaminan/penjaminanSlice";
import { resetDetailLampiranClaim, resetNewDocumentClaim } from "./claimSlice";
import { asyncConvertFileToBase64 } from "../../../utils/helpersFunction";
import { setShowLoadingScreen } from "../../../utils/store/globalSlice";
import { uploadRevisiLampiranClaimApi } from "../../../utils/api/apiClaim";

const ClaimRevisiLampiranPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
	const [canSubmit, setCanSubmit] = useState(false);
    const listFormLampiran = useSelector(state => state.penjaminan.uploadLampiranList);
    const lampiranBaruClaim = useSelector(state => state.claim.newDocument);
    const existingLampiranFiles = useSelector(state => state.claim.detailLampiran);

    useEffect(() => {
		store.dispatch(resetNewDocumentClaim());
        store.dispatch(resetLampiranList());
        store.dispatch(resetDetailLampiranClaim());
    }, []);

    useEffect(() => {
        if(id) {
            fnGetRejectedLampiranClaim(id);
        }
    }, [id]);

	useEffect(() => {
		let isFilledAll = false;
		const rejectedFill = listFormLampiran.filter(form => form.status_doc === 'R');
		console.log("lampiran wajib", rejectedFill);
		if(rejectedFill.length > 0) {
			const filledLampiranCode = lampiranBaruClaim.map(lmp => lmp.key);
			console.log("lampiran code filled", filledLampiranCode);
			isFilledAll = rejectedFill.findIndex(obj => !filledLampiranCode.includes(obj.value)) === -1;
		}
		setCanSubmit(isFilledAll);
	}, [listFormLampiran, lampiranBaruClaim]);

    const handleSubmit = (e) => {
        e.preventDefault();
		const formRevisiEntry = {
			claim_no: id,
			lampiran: lampiranBaruClaim.map((data) => {
				let dataLampiran = {
					lampiran_id: data.key,
					file: null
				};
				asyncConvertFileToBase64(data.data).then(res => {
					dataLampiran.file = res;
				}).catch(err => {
					console.log("convert err", err);
				});
				return dataLampiran;
			})
		};
		console.log("entry revisi", formRevisiEntry);
		store.dispatch(setShowLoadingScreen(true));
			setTimeout(() => {
			uploadRevisiLampiranClaimApi(formRevisiEntry).then(res => {
				console.log("res revisi lampiran", res);
				store.dispatch(setShowLoadingScreen(false));
				toast.success("Data berhasil diterima");
				setTimeout(() => {
					navigate("/mitra/claim");
				}, 1000);
			}).catch(err => {
				console.log("revisi lampiran err", err);
				store.dispatch(setShowLoadingScreen(false));
			});
		}, 1000);
    };

    // logo
    const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
    const mitra_id  = dataLogin.data.mitra_id;
    
    const logoPath = getLogoPath(mitra_id);
    const mitraName = getMitraName(mitra_id);

    return (
			<>
				<Container fluid id="revisi-lampiran-claim-page">
					<Row>
						<CardComponent title="Revisi Lampiran Claim">
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
										<InputComponent type="text" label="Nomor Claim" labelXl="3" value={id} readOnly disabled={true} />
									</Col>
								</Row>
								<br />
								<div className="form-section my-4">
									<Row>
										<Col xs={12}>
											<h5 className="section-title mb-4 text-dark fw-bold">Lampiran Dokumen</h5>
										</Col>
									</Row>
									<InputLampiranGroupComponent
										key="lampiranClaimRevisi"
										mitra=""
										page="claim"
										jenisProduk=""
										subPage="revisi-lampiran"
										existingLampiran={existingLampiranFiles}
									/>
								</div>
								<div className="form-actions">
									<Row>
										<Col xs={12}>
											<Stack direction="horizontal" className="justify-content-end flex-wrap" gap={3}>
												<ButtonComponent
													className="px-4 py-2 fw-semibold order-2 order-sm-1"
													variant="outline-danger"
													onClick={() => navigate(objectRouter.ClaimMitraPage.path)}
													title="Cancel"
												/>
												<ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="warning" title="Submit" type="submit" disabled={!canSubmit} />
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
};

export default ClaimRevisiLampiranPage;
