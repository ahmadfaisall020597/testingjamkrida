/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useRef } from "react";
import { Card, Container, Row, Col, Button, Alert, Badge, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CardComponent from "src/components/partial/cardComponent";

// React Icons imports
import { FaUser, FaUserTie, FaFileAlt, FaPaperclip, FaFolder, FaTimes, FaRocket, FaClock, FaDownload, FaInfoCircle } from "react-icons/fa";

const ClaimBandingPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { listData } = useSelector(state => state.default);

	const [editorValue, setEditorValue] = useState("");
	const [attachments, setAttachments] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const fileInputRef = useRef(null);

	const [chatHistory, setChatHistory] = useState([
		{
			id: 1,
			sender: "Admin Claim",
			message: "Permohonan banding Anda telah diterima dengan nomor referensi #CB-2024-001. Tim reviewer akan memproses dalam 3-5 hari kerja.",
			timestamp: "2024-01-15 10:30:00",
			type: "received",
			attachments: [{ name: "claim_reference_CB-2024-001.pdf", size: "245 KB" }]
		},
		{
			id: 2,
			sender: "Anda",
			message: "Terima kasih atas konfirmasinya. Saya lampirkan dokumen pendukung tambahan untuk memperkuat permohonan banding ini.",
			timestamp: "2024-01-15 14:20:00",
			type: "sent",
			attachments: [
				{ name: "dokumen_pendukung_1.pdf", size: "1.2 MB" },
				{ name: "bukti_transaksi.jpg", size: "856 KB" }
			]
		},
		{
			id: 3,
			sender: "Tim Reviewer",
			message: "Dokumen telah kami terima dan sedang dalam tahap review. Kami membutuhkan klarifikasi tambahan terkait dokumen yang Anda kirimkan.",
			timestamp: "2024-01-17 09:15:00",
			type: "received",
			attachments: []
		},
		{
			id: 4,
			sender: "Anda",
			message: "Baik, saya siap memberikan klarifikasi yang diperlukan. Mohon informasikan detail apa saja yang perlu dijelaskan lebih lanjut.",
			timestamp: "2024-01-17 11:45:00",
			type: "sent",
			attachments: []
		}
	]);

	const modules = {
		toolbar: [[{ header: [1, 2, 3, false] }], ["bold", "italic", "underline", "strike"], [{ color: [] }, { background: [] }], [{ list: "ordered" }, { list: "bullet" }], ["blockquote"]]
	};

	const formats = ["header", "bold", "italic", "underline", "strike", "color", "background", "list", "bullet", "blockquote"];

	const handleFileAttachment = event => {
		const files = Array.from(event.target.files);

		// Validate file types and sizes
		const allowedTypes = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".gif", ".zip", ".rar"];
		const maxFileSize = 10 * 1024 * 1024; 

		const validFiles = files.filter(file => {
			const fileExtension = "." + file.name.split(".").pop().toLowerCase();
			const isValidType = allowedTypes.includes(fileExtension);
			const isValidSize = file.size <= maxFileSize;

			if (!isValidType) {
				alert(`File ${file.name} memiliki format yang tidak didukung`);
				return false;
			}
			if (!isValidSize) {
				alert(`File ${file.name} melebihi batas ukuran maksimal 10MB`);
				return false;
			}
			return true;
		});

		const newAttachments = validFiles.map(file => ({
			id: Date.now() + Math.random(),
			file: file,
			name: file.name,
			size: formatFileSize(file.size),
			type: file.type,
			lastModified: file.lastModified
		}));

		setAttachments(prevAttachments => [...prevAttachments, ...newAttachments]);

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}

		console.log("📎 New attachments added:", newAttachments);
	};

	const formatFileSize = bytes => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const removeAttachment = id => {
		setAttachments(prevAttachments => prevAttachments.filter(att => att.id !== id));
		console.log("🗑️ Attachment removed, ID:", id);
	};

	const handleSubmit = async () => {
		if (!editorValue.trim()) {
			alert("Mohon isi pesan terlebih dahulu");
			return;
		}

		setIsSubmitting(true);

		//  **Prepare Data for API**
		const messageData = {
			id: Date.now(),
			message: editorValue,
			messageHtml: editorValue, 
			messagePlain: editorValue.replace(/<[^>]*>/g, ""), 
			timestamp: new Date().toISOString(),
			sender: "Anda", // Ganti ke user Mitra nanti
			type: "sent",
			attachments: attachments.map(att => ({
				id: att.id,
				name: att.name,
				size: att.size,
				type: att.type,
				lastModified: att.lastModified
			}))
		};

		// **Prepare FormData for API Call**
		const formData = new FormData();
		formData.append("message", messageData.messageHtml);
		formData.append("messagePlain", messageData.messagePlain);
		formData.append("timestamp", messageData.timestamp);
		formData.append("sender", messageData.sender);
		formData.append("type", messageData.type);

		// Append each file to FormData
		attachments.forEach((attachment, index) => {
			formData.append(`attachments[${index}]`, attachment.file);
			formData.append(`attachmentNames[${index}]`, attachment.name);
		});

		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value);
		}

		try {

			//  **Simulate API call for demo**
			await new Promise(resolve => setTimeout(resolve, 2000));

			//  **Update chat history with new message**
			const newChatEntry = {
				...messageData,
				attachments: attachments.map(att => ({
					name: att.name,
					size: att.size
				}))
			};

			setChatHistory(prevHistory => [...prevHistory, newChatEntry]);

			// 🧹 **Reset form**
			setEditorValue("");
			setAttachments([]);

			console.log(" Message submitted successfully!");
			alert("Pesan berhasil dikirim!");
		} catch (error) {
			console.error("Submit Error:", error);
			alert("Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDownload = fileName => {
		alert(`Mengunduh file: ${fileName}`);
	};

	const formatTimestamp = timestamp => {
		const date = new Date(timestamp);
		return date.toLocaleString("id-ID", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit"
		});
	};

	return (
		<Container fluid id="claim-banding-page">
			<CardComponent title={`Claim Banding Management`} type="create">
				<div className="content">
					<Row>
						<Col lg={12} className="mb-4">
							<Card className="shadow-sm border-0">
								<Card.Header className="bg-primary text-white">
									<h5 className="mb-0 fw-bold">
									
										History Banding
									</h5>
								</Card.Header>
								<Card.Body style={{ maxHeight: "500px", overflowY: "auto" }}>
									{chatHistory.map((chat, index) => (
										<div key={chat.id} className="mb-4">
											<div className={`d-flex ${chat.type === "sent" ? "justify-content-end" : "justify-content-start"}`}>
												<div style={{ maxWidth: "75%" }}>
													<div className={`p-3 rounded-3 ${chat.type === "sent" ? "bg-primary text-white" : "bg-light border"}`}>
														<div className="d-flex align-items-center mb-2">
															<strong className="me-2">
																{chat.type === "sent" ? <FaUser className="me-1" /> : <FaUserTie className="me-1" />}
																{chat.sender}
															</strong>
															<Badge bg={chat.type === "sent" ? "light" : "secondary"} text={chat.type === "sent" ? "dark" : "light"}>
																{formatTimestamp(chat.timestamp)}
															</Badge>
														</div>
														<div className="mb-0" dangerouslySetInnerHTML={{ __html: chat.message }} />

														{/* Attachments */}
														{chat.attachments && chat.attachments.length > 0 && (
															<div className="mt-3">
																<small className="text-muted">
																	<FaPaperclip className="me-1" />
																	Lampiran ({chat.attachments.length}):
																</small>
																{chat.attachments.map((file, idx) => (
																	<div key={idx} className="mt-2">
																		<Button size="sm" variant={chat.type === "sent" ? "light" : "outline-primary"} onClick={() => handleDownload(file.name)} className="me-2">
																			<FaFileAlt className="me-1" />
																			{file.name} ({file.size})
																		</Button>
																	</div>
																))}
															</div>
														)}
													</div>
												</div>
											</div>
										</div>
									))}
								</Card.Body>
							</Card>
						</Col>

						<Col lg={12}>
							<Card className="shadow-sm border-0">
								<Card.Header className="bg-success text-white">
									<h5 className="mb-0 fw-bold">
										Input Banding
									</h5>
								</Card.Header>
								<Card.Body>
									<div className="mb-3">
										<label className="form-label fw-bold">
											<FaFileAlt className="me-2" />
											Pesan
										</label>
										<ReactQuill
											theme="snow"
											value={editorValue}
											onChange={setEditorValue}
											modules={modules}
											formats={formats}
											placeholder="Tulis pesan Anda di sini..."
											style={{ height: "200px", marginBottom: "50px" }}
										/>
									</div>

									<div className="mb-4">
										<label className="form-label fw-bold">
											<FaPaperclip className="me-2" />
											Lampiran File
											<Badge bg="info" className="ms-2">
												{attachments.length} file(s)
											</Badge>
										</label>

										<div className="d-flex align-items-center gap-2 mb-2">
											<Form.Control type="file" multiple ref={fileInputRef} onChange={handleFileAttachment} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.zip,.rar" className="flex-grow-1" />
											<Button variant="outline-secondary" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
												<FaFolder className="me-1" />
												Pilih File
											</Button>
										</div>

										<small className="text-muted">
											<FaInfoCircle className="me-1" />
											Format yang didukung: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF, ZIP, RAR (Maks. 10MB per file)
										</small>

										{attachments.length > 0 && (
											<div className="mt-3">
												<small className="text-muted mb-2 d-block fw-bold"><FaPaperclip className="me-1" /> File yang akan dilampirkan ({attachments.length}):</small>
												{attachments.map(file => (
													<Alert key={file.id} variant="info" className="py-2 d-flex justify-content-between align-items-center">
														<span>
															<FaFileAlt className="me-2" />
															<strong>{file.name}</strong> ({file.size})
														</span>
														<Button variant="outline-danger" size="sm" onClick={() => removeAttachment(file.id)} disabled={isSubmitting}>
															<FaTimes />
														</Button>
													</Alert>
												))}
											</div>
										)}
									</div>

									<div className="d-flex justify-content-end gap-2">
										<Button
											variant="outline-secondary"
											onClick={() => {
												setEditorValue("");
												setAttachments([]);
											}}
											disabled={isSubmitting}
										>
											<FaTimes className="me-1" />
											Reset
										</Button>
										<Button variant="success" onClick={handleSubmit} disabled={isSubmitting || (!editorValue.trim() && attachments.length === 0)}>
											{isSubmitting ? (
												<>
													<div className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></div>
													Mengirim...
												</>
											) : (
												<>
													<FaRocket className="me-1" />
													Kirim Pesan
												</>
											)}
										</Button>
									</div>
								</Card.Body>
							</Card>
						</Col>
					</Row>
				</div>
			</CardComponent>
		</Container>
	);
};

export default ClaimBandingPage;
