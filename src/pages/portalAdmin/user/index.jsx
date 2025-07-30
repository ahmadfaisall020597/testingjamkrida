/* eslint-disable no-unused-vars */
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import CardComponent from "src/components/partial/cardComponent";
import logoJamkrida from "src/assets/image/logo-jamkrida-jkt.png";

const UserPage = () => {
	return (
		<Container fluid id="maintenance-page" className="maintenance-container">
			<div className="maintenance-content">
				<div className="logo-section">
					<div className="logo-container">
						<div className="gear gear-1">⚙️</div>
						<div className="gear gear-2">🔧</div>
						<div className="main-logo">
							<img src={logoJamkrida} alt="Jamkrida" className="logo-img" />
						</div>
					</div>
				</div>

				<div className="title-section">
					<h1 className="maintenance-title">🚧 Under Maintenance 🚧</h1>
					<div className="loading-dots">
						<span></span>
						<span></span>
						<span></span>
					</div>
				</div>

				<div className="message-section">
					<Card className="message-card">
						<Card.Body>
							<h3 className="message-title">Kami Sedang Melakukan Perbaikan</h3>
						</Card.Body>
					</Card>
				</div>
			</div>
		</Container>
	);
};

export default UserPage;
