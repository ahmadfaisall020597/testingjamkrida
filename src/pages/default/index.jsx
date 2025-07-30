/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Card, Container, Stack } from "react-bootstrap";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CardComponent from "src/components/partial/cardComponent";


const DefaultPage = () => {
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { listData } = useSelector(state => state.default);

	return (
		<Container fluid id="default-page">
			<CardComponent
				title={`default Management`}
				type="index"
			>
				<div className="content custom-style">
					here content
				</div>
			</CardComponent>
		</Container>
	);
};

export default DefaultPage;
