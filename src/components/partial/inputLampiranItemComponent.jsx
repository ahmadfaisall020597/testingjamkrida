import { Row, Col } from "react-bootstrap";
import InputImageComponent from "src/components/partial/inputImageComponent";
import InputFileComponent from "src/components/partial/InputFileComponent";
import { setDocumentPenjaminan } from "src/pages/mitra/penjaminan/penjaminanSlice";
import srtpFile from "src/assets/file/Formulir_Permohonan_Penjaminan_Kredit.docx";
import { store } from "src/utils/store/combineReducers"
import { useSelector } from "react-redux";
import { setDocumentClaim } from "../../pages/mitra/claim/claimSlice";

const InputLampiranItemComponent = ({
	key,
	page="penjaminan",
    documentName="KTP",
	fileType="image",
    placeholder,
    documentLabel,
    background="",
	additionalStatus="",
	existingLampiran=[]
}) => {
	const penjaminanDocList = useSelector(state => state.penjaminan.newDocument);
	const claimDocList = useSelector(state => state.claim.newDocument);

	const changeDocument = (event, key) => {
		if(page === "penjaminan"){
			const file = event;
			if(file && !event.name.startsWith("NO_IMAGE")) {
				store.dispatch(setDocumentPenjaminan({key: key, data: file}));
			}
			else {
				store.dispatch(setDocumentPenjaminan({key: key, data: null}));
			}
		}
		else if(page === "claim"){
			const file = event;
			if(file && !event.name.startsWith("NO_IMAGE")) {
				store.dispatch(setDocumentClaim({key: key, data: file}));
			}
			else {
				store.dispatch(setDocumentClaim({key: key, data: null}));
			}
		}
	}

    return (
			<Row className="mb-3">
				<Col xs={12}>
					<div className="card border-0 shadow-sm">
						<div className={"card-header text-white py-2 " + (background === "blue" ? "bg-info" : background === "green" ? "bg-success" : "bg-secondary")}>
							<div className="d-flex align-items=center">
								<strong>{additionalStatus ? (placeholder + " (" + additionalStatus + ")") : placeholder}</strong>
							</div>
						</div>
						<div className="card-body">
							{fileType === "image" && (additionalStatus === "" || additionalStatus.toLowerCase() === "rejected") && (
								<InputImageComponent
									type="file"
									label={documentLabel}
									labelX1="12"
									value={page === "penjaminan" ?
										(penjaminanDocList.find(value => value.key === documentName) ?
											penjaminanDocList.find(value => value.key === documentName).data :
											null)
										: page ==="claim" ?
											(claimDocList.find(value => value.key === documentName) ?
												claimDocList.find(value => value.key === documentName).data
												: null)
										: null
									}
									name={("image" + documentName.toUpperCase())}
									onChange={(event) => changeDocument(event, documentName)}
									formGroupClassName="gx-2"
									showImagePreview
									controlId={("formImage"+ documentName.toUpperCase() + "CreatePenjaminan")}
								/>
							)}
							{fileType === "file" && (additionalStatus === "" || additionalStatus.toLowerCase() === "rejected") && (
								<InputFileComponent
									type="file"
									label={documentLabel}
									labelX1="12"
									value={page === "penjaminan" ?
										(penjaminanDocList.find(value => value.key === documentName) ?
											penjaminanDocList.find(value => value.key === documentName).data :
											null)
										: page === "claim" ?
											(claimDocList.find(value => value.key === documentName) ?
												claimDocList.find(value => value.key === documentName).data :
												null)
										: null
									}
									name={("file" + documentName.toUpperCase())}
									onChange={(event) => changeDocument(event, documentName)}
									formGroupClassName="gx-2"
									downloadTemplate={srtpFile}
									showImagePreview
									controlId={("formFile"+ documentName.toUpperCase() + "CreatePenjaminan")}
								/>
							)}
						</div>
						{/* existing lampiran to show previous version of files */}
						{Array.isArray(existingLampiran) && existingLampiran.length > 0 && (
							<div className="card-body" key="existing-lampiran">
								{existingLampiran.sort((a, b) => b.version - a.version).map((existing) => {
									const fileLabel = "File " + existing.label + " versi " + existing.version;
									const lampiranFileType = existing.file_info?.startsWith("data:image") ? "image" : "file";

									if(lampiranFileType === "image") {
										return (
											<InputImageComponent
												type="file"
												label=""
												termsConditionText={fileLabel}
												labelX1="12"
												value={existing.file_info}
												fileBase64Name={existing.file_name}
												readOnly
												formGroupClassName="gx-2"
												showImagePreview
												fileIsBase64
											/>
										);
									}
									else if(lampiranFileType === "file") {
										return (
											<InputFileComponent
												type="file"
												label=""
												hideBrowseButton
												termsConditionText={fileLabel}
												labelX1="12"
												value={existing.file_info}
												fileBase64Name={existing.file_name}
												readOnly
												formGroupClassName="gx-2"
												fileIsBase64
											/>
										);
									}
									else return null;
								})}
							</div>
						)}
					</div>
				</Col>
			</Row>
		);
};

export default InputLampiranItemComponent;
