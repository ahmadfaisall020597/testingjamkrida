/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from "react";
import { Card, Container, Stack } from "react-bootstrap";
// import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";

const RegisterMitraPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { listData } = useSelector(state => state.default);

	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = () => {
		setIsSubmitted(true);
	};

	if (isSubmitted) {
		return (
			<Container fluid id="register-mitra-page">
				<CardComponent title={`Register Mitra`} type="index">
					<div className="content custom-style text-center py-4">
						<h2 className="mb-4">Thank You</h2>
						<p className="mb-4" style={{ backgroundColor: "#c4efc4" }}>
							Your account registration has been submitted.
							<br />
							We will inform you ASAP by email, once your account is completed.
						</p>
						<div className="mt-4 pt-3">
							<a href="" style={{ fontStyle: "italic", textDecoration: "none" }}>
								Login
							</a>
						</div>
					</div>
				</CardComponent>
			</Container>
		);
	}

	return (
		<Container fluid id="register-mitra-page">
			<CardComponent title={`Register Mitra`} type="index">
				<div className="content custom-style">here content</div>
				<div className="content custom-style">
					<ButtonComponent onClick={handleSubmit}>Submit</ButtonComponent>
				</div>
			</CardComponent>
		</Container>
	);
};

export default RegisterMitraPage;
