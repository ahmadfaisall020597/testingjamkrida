import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Badge, ProgressBar, Modal, Button, Form, Stack, Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CardComponent from "src/components/partial/cardComponent";
import ButtonComponent from "src/components/partial/buttonComponent";
import { FaShieldAlt, FaFileInvoiceDollar, FaChartLine, FaEye, FaExchangeAlt, FaHandshake } from "react-icons/fa";
import StatCard from "src/components/partial/statCardComponent";
import QuickActionCard from "src/components/partial/quickActionCard";
// import logos from "src/assets/image/logo-jamkrida-jkt.png";
import { getLogoPath } from "src/utils/getLogoByEmail";
import dayjs from "dayjs";
import { fnGetForceNotif } from "../login/loginFn";
import { IoMdCloseCircle } from "react-icons/io";

const DashboardPageMitra = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { profileUsers, count, notifPopupCloseDisabled } = useSelector(state => state.global);

	const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
	const mitra_id = dataLogin.data.mitra_id;
	// const count = useSelector(state => state.global.count);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const toggleChat = () => setIsChatOpen(prev => !prev);
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState([
		{
			sender: "admin",
			name: "Admin",
			text: "Selamat datang! Ada yang bisa kami bantu?",
			timestamp: new Date()
		}
	]);
	const [replyTo, setReplyTo] = useState(null);
	const [pendingAttachment, setPendingAttachment] = useState(null);

	//sementara
	const fullName = dataLogin.data.name || profileUsers?.fullName || "Mitra";
	const logoPath = getLogoPath(mitra_id);

	//
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);
	console.log('translate bahasa : ', translationData[code_lang]);


	// const [show, setShow] = useState(() => localStorage.getItem("showPopUpNotif") === "true");
	const [show, setShow] = useState(true);

	const handleClose = () => {
		localStorage.setItem("showPopUpNotif", false);
		setShow(false);
		navigate('/mitra/notification')
	}

	const dismissPopup = () => {
		localStorage.setItem("showPopUpNotif", false);
		setShow(false);
	}

	const dashboardData = {
		penjaminan: {
			total: 8750,
			approved: 7200,
			pending: 1100,
			rejected: 450,
			growth: 8.3,
			totalValue: 125000000000,
			avgProcessingTime: 5.2
		},
		claim: {
			total: 2340,
			processed: 1890,
			pending: 320,
			rejected: 130,
			growth: -2.1,
			totalValue: 45000000000,
			avgSettlementTime: 12.8
		},
		subrogasi: {
			total: 456,
			active: 287,
			completed: 123,
			pending: 46,
			growth: 15.7,
			totalRecovery: 8500000000,
			recoveryRate: 68.5
		}
	};

	const handleSend = () => {
		if (!message.trim() && !pendingAttachment) return;

		const newMessage = {
			sender: "mitra",
			name: fullName,
			text: message,
			file: pendingAttachment || null,
			replyTo: replyTo || null,
			timestamp: new Date()
		};

		setMessages(prev => [...prev, newMessage]);
		setMessage("");
		setPendingAttachment(null);
		setReplyTo(null);
	};

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (!file) return;

		const isImage = file.type.startsWith("image/");
		const reader = new FileReader();

		reader.onload = () => {
			setPendingAttachment({
				name: file.name,
				type: file.type,
				url: reader.result,
				isImage
			});
		};

		reader.readAsDataURL(file);
	};

	const handleReply = (msg) => {
		setReplyTo(msg);
	};

	useEffect(() =>{
		fnGetForceNotif();
	}, []);

	return (
		<Container fluid className="py-4">
			<CardComponent type="index">
				<div className="content custom-style">
					<Row className="mb-4">
						<Col>
							<div className="welcome-section p-4 bg-gradient-primary text-white rounded d-flex justify-content-between align-items-center">
								<div>
									<h4 className="mb-2">{translationData[code_lang]?.home?.welcome}, {fullName}</h4>
									<a className="btn btn-outline-light">{translationData[code_lang]?.home?.akun}</a>
								</div>
								<div className="logo-container">
									<img src={logoPath} alt="Company Logo" className="img-fluid" style={{ maxHeight: "60px", maxWidth: "120px" }} />
								</div>
							</div>
						</Col>
					</Row>

					<Row className="g-3 align-items-center justify-content-center">
						<Col lg={4} md={6}>
							<QuickActionCard title={translationData[code_lang]?.home?.penjaminan} icon={<FaShieldAlt size={20} />} color="primary" onClick={() => navigate("/mitra/penjaminan-mitra")} />
						</Col>
						<Col lg={4} md={6}>
							<QuickActionCard title={translationData[code_lang]?.home?.claim} icon={<FaFileInvoiceDollar size={20} />} color="success" onClick={() => navigate("/mitra/claim")} />
						</Col>
						<Col lg={4} md={6}>
							<QuickActionCard
								title="Subrogasi"
								icon={<FaHandshake size={20} />}
								color="info"
								onClick={() => navigate("/mitra/subrogasi")}
							/>
						</Col>
					</Row>
				</div>
			</CardComponent>

			<Button
				variant="primary"
				onClick={toggleChat}
				className="d-flex align-items-center gap-2"
				style={{ height: "60px", position: "fixed", bottom: "20px", right: "20px", zIndex: 1050, borderRadius: "30px", padding: "0 16px" }}
			>
				<i className="bi bi-chat-dots-fill fs-4" />
				<span className="text-white fw-bold">Live Chat</span>
			</Button>

			{isChatOpen && (
				<Card
					style={{
						height: "500px",
						width: "500px",
						display: "flex",
						flexDirection: "column",
						position: "fixed",
						bottom: "90px",
						right: "20px",
						zIndex: 1050,
					}}
				>
					<Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
						<span>Live Chat</span>
						<Button variant="link" className="text-white text-decoration-none p-0 fs-4" onClick={toggleChat}>
							&times;
						</Button>
					</Card.Header>

					<Card.Body className="overflow-auto">
						{messages.map((msg, index) => {
							const isAdmin = msg.sender === "admin";

							return (
								<Stack
									key={index}
									direction="vertical"
									className={`mb-2 ${isAdmin ? "align-items-start" : "align-items-end"}`}
								>
									<div className="text-muted small mb-1">
										<strong>{msg.name}</strong> • {dayjs(msg.timestamp).format("HH:mm, DD MMM YYYY")}
									</div>

									<Stack
										direction="horizontal"
										className={isAdmin ? "" : "justify-content-end"}
										style={{ width: "100%" }}
									>
										{/* Tombol balas untuk mitra */}
										{!isAdmin && (
											<Button
												variant="link"
												size="sm"
												className="me-2 p-0 text-muted align-self-center"
												onClick={() => handleReply(msg)}
												title="Balas"
											>
												<i className="bi bi-reply" /> Reply
											</Button>
										)}

										<Card
											className={`p-2 ${isAdmin ? "bg-light" : "bg-primary text-white"}`}
											style={{ maxWidth: "70%" }}
										>
											{msg.replyTo && (
												<div className="mb-2 p-2 border-start border-3 bg-white text-dark rounded small">
													<small><strong>{msg.replyTo.name}</strong>: {msg.replyTo.text}</small>
												</div>
											)}
											{msg.text && <div>{msg.text}</div>}
											{msg.file && (
												<div className="mt-2">
													{msg.file.isImage ? (
														<Image
															src={msg.file.url}
															alt={msg.file.name}
															style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px" }}
														/>
													) : (
														<a
															href={msg.file.url}
															target="_blank"
															rel="noopener noreferrer"
															className={isAdmin ? "text-dark" : "text-white"}
														>
															{msg.file.name}
														</a>
													)}
												</div>
											)}
										</Card>

										{/* Tombol balas untuk admin */}
										{isAdmin && (
											<Button
												variant="link"
												size="sm"
												className="ms-2 p-0 text-muted align-self-center"
												onClick={() => handleReply(msg)}
												title="Balas"
											>
												<i className="bi bi-reply" /> Reply
											</Button>
										)}
									</Stack>
								</Stack>
							);
						})}
					</Card.Body>

					<Card.Footer>
						{replyTo && (
							<div className="border rounded p-2 mb-2 bg-light position-relative">
								<small className="text-muted">
									Membalas ke: <strong>{replyTo.name}</strong><br />
									{replyTo.text}
								</small>
								<Button
									variant="link"
									size="sm"
									className="position-absolute top-0 end-0 me-1 mt-1"
									onClick={() => setReplyTo(null)}
								>
									&times;
								</Button>
							</div>
						)}

						{pendingAttachment && (
							<div className="border rounded p-2 mb-2">
								<div className="d-flex justify-content-between align-items-center mb-2">
									<small className="text-muted">Lampiran: {pendingAttachment.name}</small>
									<Button variant="link" size="sm" onClick={() => setPendingAttachment(null)}>Hapus</Button>
								</div>
								{pendingAttachment.isImage ? (
									<div style={{ maxHeight: "150px", overflow: "hidden", display: "flex", justifyContent: "center" }}>
										<img src={pendingAttachment.url} alt={pendingAttachment.name} style={{ maxWidth: "100%", maxHeight: "150px", borderRadius: "8px", objectFit: "cover" }} />
									</div>
								) : (
									<a href={pendingAttachment.url} target="_blank" rel="noreferrer">{pendingAttachment.name}</a>
								)}
							</div>
						)}

						<div style={{ position: "relative", maxWidth: "600px", margin: "auto", display: "flex", alignItems: "flex-end" }}>
							<div style={{ position: "relative", flexGrow: 1 }}>
								<Form.Control
									as="textarea"
									rows={1}
									placeholder="Ketik pesan..."
									value={message}
									onChange={(e) => {
										setMessage(e.target.value);
										e.target.style.height = "auto";
										e.target.style.height = `${e.target.scrollHeight}px`;
									}}
									style={{ resize: "none", overflow: "hidden", maxHeight: "150px", minHeight: "40px", paddingRight: "40px", paddingLeft: "15px", borderRadius: "20px" }}
								/>
								<Form.Label
									htmlFor="file-upload"
									style={{
										position: "absolute",
										right: "10px",
										bottom: "0px",
										cursor: "pointer",
										zIndex: 1,
										width: "25px",
										height: "25px",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
										backgroundColor: "#f8f9fa",
										borderRadius: "50%",
									}}
									className="text-muted"
								>
									<i className="bi bi-paperclip fs-6" />
								</Form.Label>
								<Form.Control id="file-upload" type="file" onChange={handleFileUpload} style={{ display: "none" }} />
							</div>
							<Button variant="primary" onClick={handleSend} style={{ marginLeft: "10px", width: "40px", height: "40px", borderRadius: "50%", padding: 0 }} className="d-flex justify-content-center align-items-center">
								<i className="bi bi-send-fill fs-5" />
							</Button>
						</div>
					</Card.Footer>
				</Card>
			)}

			<Modal show={show && count > 0}>
				<Modal.Header>
					<Modal.Title>Notifikasi</Modal.Title>
					<div className="w-100 text-danger text-end">
						{!notifPopupCloseDisabled && (
							<IoMdCloseCircle onClick={dismissPopup} style={{ fontSize: 'xx-large', cursor: 'pointer' }}/>
						)}
					</div>
				</Modal.Header>
				<Modal.Body>Terdapat {count} notifikasi</Modal.Body>
				<Modal.Footer>
					<ButtonComponent onClick={handleClose} title="Go to Notification" />
				</Modal.Footer>
			</Modal>
		</Container>
	);
};

export default DashboardPageMitra;
