/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Card, Container, Stack } from "react-bootstrap";
// import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CardComponent from "src/components/partial/cardComponent";

const RegisterSubmitSuccessPage = () => {
	return (
		<Container fluid id="register-mitra-page">
			<div className="content custom-style text-center py-4">
				<h2 className="mb-4">Thank You</h2>
				<p className="mb-4" style={{ backgroundColor: "#c4efc4", fontWeight: "normal" }}>
					Your account registration has been submitted.
					<br />
					We will inform you ASAP by email, once your account is completed.
				</p>
				{/* <div className="mt-5 pt-3">
					<a href="/login" style={{ fontStyle: "italic", textDecoration: "none" }}>
						Login
					</a>
				</div> */}
			</div>
		</Container>
	);
};

export default RegisterSubmitSuccessPage;
