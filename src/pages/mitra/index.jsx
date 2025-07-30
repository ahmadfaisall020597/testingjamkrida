import { useEffect, useState } from "react";
import { Card, Container, Row, Col, Modal, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CardComponent from "src/components/partial/cardComponent";
import ButtonComponent from "src/components/partial/buttonComponent";
import { FaShieldAlt, FaFileInvoiceDollar, FaHandshake } from "react-icons/fa";
import QuickActionCard from "src/components/partial/quickActionCard";
import { getLogoPath } from "src/utils/getLogoByEmail";
import { fnGetForceNotif } from "../login/loginFn";
import { IoMdCloseCircle } from "react-icons/io";

const DashboardPageMitra = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { profileUsers, count, notifPopupCloseDisabled } = useSelector(state => state.global);
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);

	const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
	const mitra_id = dataLogin.data.mitra_id;
	const fullName = dataLogin.data.name || profileUsers?.fullName || "Mitra";
	const logoPath = getLogoPath(mitra_id);

	const [show, setShow] = useState(true);
	const [isChatOpen, setIsChatOpen] = useState(false);

	const toggleChat = () => {
		if (window.Tawk_API && typeof window.Tawk_API.toggle === "function") {
			window.Tawk_API.toggle();
			setIsChatOpen(prev => !prev);
		}
	};

	useEffect(() => {
		fnGetForceNotif();

		const script = document.createElement("script");
		script.src = "https://embed.tawk.to/68898e8228cbba1927608cad/1j1cl9bhl";
		script.async = true;
		script.charset = "UTF-8";
		script.setAttribute("crossorigin", "*");
		document.body.appendChild(script);

		script.onload = () => {
			// Polling untuk menunggu elemen muncul
			const interval = setInterval(() => {
				const chatContainer = document.querySelector("#tawkchat-container");
				if (chatContainer) {
					chatContainer.style.maxWidth = "350px";
					chatContainer.style.maxHeight = "500px";
					chatContainer.style.bottom = "20px";
					chatContainer.style.right = "20px";
					chatContainer.style.borderRadius = "16px";
					chatContainer.style.overflow = "hidden";
					chatContainer.style.zIndex = "9999";

					clearInterval(interval); // Stop polling setelah sukses
				}
			}, 500); // Cek setiap 500ms
		};

		// Cleanup
		return () => {
			document.body.removeChild(script);
		};
	}, []);

	const handleClose = () => {
		localStorage.setItem("showPopUpNotif", false);
		setShow(false);
		navigate("/mitra/notification");
	};

	const dismissPopup = () => {
		localStorage.setItem("showPopUpNotif", false);
		setShow(false);
	};

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
							<QuickActionCard title="Subrogasi" icon={<FaHandshake size={20} />} color="info" onClick={() => navigate("/mitra/subrogasi")} />
						</Col>
					</Row>
				</div>
			</CardComponent>

			<Button
				variant="primary"
				onClick={toggleChat}
				className="d-flex align-items-center gap-2"
				style={{
					height: "60px",
					position: "fixed",
					bottom: "20px",
					right: "20px",
					zIndex: 1050,
					borderRadius: "30px",
					padding: "0 16px",
				}}
			>
				<i className="bi bi-chat-dots-fill fs-4" />
				{/* <span className="text-white fw-bold">Live Chat</span> */}
			</Button>

			<Modal show={show && count > 0}>
				<Modal.Header>
					<Modal.Title>Notifikasi</Modal.Title>
					<div className="w-100 text-danger text-end">
						{!notifPopupCloseDisabled && (
							<IoMdCloseCircle onClick={dismissPopup} style={{ fontSize: 'xx-large', cursor: 'pointer' }} />
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
