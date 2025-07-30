import { Row, Col, Card, Badge, Button } from "react-bootstrap";
import InputImageComponent from "src/components/partial/inputImageComponent";
import InputFileComponent from "src/components/partial/InputFileComponent";
import { useEffect, useState } from "react";

const PreviewLampiranClaimGroupComponent = ({ listData = [] }) => {
	const [groupedData, setGroupedData] = useState({});

	useEffect(() => {
		console.log("preview mapval Claim", listData);
		processGroupedData();
	}, [listData]);

	const processGroupedData = () => {
		const grouped = {};

		listData.forEach(item => {
			const key = item.value;
			if (!grouped[key]) {
				grouped[key] = [];
			}
			grouped[key].push(item);
		});

		console.log("grouped", grouped);

		const latestVersionData = {};
		Object.keys(grouped).forEach(key => {
			grouped[key].sort((a, b) => a.version - b.version);

			const latestVersion = grouped[key][grouped[key].length - 1];
			latestVersionData[key] = [latestVersion];
		});

		console.log("latestVersionData", latestVersionData);
		setGroupedData(latestVersionData);
	};

	const getBgColor = value => {
		if (value === "ktp" || value === "srtp") {
			return "primary";
		}
		switch (value) {
			case "npwp":
				return "success";
			default:
				return "secondary";
		}
	};

	const isImageFile = fileInfo => {
		try {
			if (typeof fileInfo === 'string') {
				if (fileInfo.startsWith('data:image')) {
					return true;
				}
			}

			const parsedInfo = JSON.parse(fileInfo);
			
			if (parsedInfo.file_type?.startsWith("data:image")) {
				return true;
			}
			
			if (parsedInfo.data?.startsWith("data:image")) {
				return true;
			}
			
			if (typeof parsedInfo === 'string' && parsedInfo.startsWith('data:image')) {
				return true;
			}

			return false;
		} catch (error) {
			console.error("Error parsing JSON:", error);
			
			if (typeof fileInfo === 'string' && fileInfo.startsWith('data:image')) {
				return true;
			}
			
			return false;
		}
	};

	const getStatusBadge = status => {
		switch (status) {
			case "R":
				return (
					<Badge bg="danger" className="ms-2">
						Rejected
					</Badge>
				);
			case "N":
				return (
					<Badge bg="success" className="ms-2">
						Approved
					</Badge>
				);
			default:
				return null;
		}
	};

	return (
		<div className="preview-lampiran-container">
			{Object.keys(groupedData).map((documentType, index) => {
				const documents = groupedData[documentType];
				const bgColor = getBgColor(documentType);
				const mainLabel = documents[0]?.label || documentType.toUpperCase();

				return (
					<Card key={`${documentType}-${index}`} className="border-0 shadow-sm mb-3">
						<Card.Header className={`text-white py-2 bg-${bgColor}`}>
							<div className="d-flex align-items-center">
								<strong>{mainLabel}</strong>
							</div>
						</Card.Header>
						<Card.Body>
							<Row>
								{documents.map((document, docIndex) => {
									const isImage = isImageFile(document.file_info);
									
									return (
										<Col key={`${document.file_name}-${docIndex}`} md={12} className="mb-3">
											<div className="document-item border rounded p-3">
												<div className="mb-2">
													<strong className="text-muted small">{document.label}</strong>
													{getStatusBadge(document.status_doc)}
													<Badge bg="info" className="ms-2 small">
														Versi {document.version}
													</Badge>
												</div>

												{isImage ? (
													<InputImageComponent
														value={document.file_info}
														fileBase64Name={document.file_name}
														type="file"
														termsConditionText=""
														labelX1="12"
														readOnly
														formGroupClassName="gx-2"
														showImagePreview
														fileIsBase64
													/>
												) : (
													<div className="file-download-container">
														<InputFileComponent
															className="mb-2"
															hideBrowseButton
															readOnly
															value={document.file_info}
															fileBase64Name={document.file_name}
															fileIsBase64
															termsConditionText=""
															label=""
															type="file"
															labelX1="12"
															formGroupClassName="gx-2"
														/>
													</div>
												)}
											</div>
										</Col>
									);
								})}
							</Row>
						</Card.Body>
					</Card>
				);
			})}
		</div>
	);
};

export default PreviewLampiranClaimGroupComponent;