/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import { Badge, Card, Col, Container, Row, Stack } from "react-bootstrap";
import "./style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import AuthHelpers from "../../../utils/api/apiV2";
import { setNotifCount } from "../../../utils/store/globalSlice";
import { getCountNotif, getDataNotif, updateDataNotif } from "../../../utils/api/apiNotif";

const NotifMitraPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [notifData, setNotifData] = useState([]);
	const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
	const userID = dataLogin.data.user_id

	//
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);
	console.log('translate bahasa : ', translationData[code_lang]);

	// const [notifications, setNotifications] = useState([
	// {
	// 	id: 1,
	// 	title: "Judul Notifikasi (New)",
	// 	content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	// 	date: "11 Jul 2025 15:20",
	// 	isRead: false,
	// },
	// {
	// 	id: 2,
	// 	title: "Judul Notifikasi (Read)",
	// 	content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	// 	date: "11 Jul 2025 15:20",
	// 	isRead: true,
	// },
	// {
	// 	id: 3,
	// 	title: "Judul Notifikasi (Read)",
	// 	content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	// 	date: "11 Jul 2025 15:20",
	// 	isRead: true,
	// },
	// ]);

	const handleCardClick = (id) => {
		const updated = notifData.map((notif) =>
			notif.id === id ? { ...notif, is_read: 1 } : notif
		);

		setNotifData(updated);
		updateData(id);
		fetchCountNotif();
	};

	const fetchCountNotif = async () => {
		try {
			const response = await getCountNotif(
				{ id: userID }
			);

			const tempCount = response?.data?.data?.count;
			dispatch(setNotifCount(tempCount));

		} catch (err) {
			console.error("Error fetching count notif data:", err);
		}

	};

	const fetchDataNotif = async () => {
		try {
			const response = await getDataNotif(
				{ id: userID }
			);

			if (response.data.success) {
				setNotifData(response.data.data);
			}

		} catch (err) {
			console.error("Error fetching notif data:", err);
		}

	};

	const updateData = async (id) => {
		try {
			const response = await updateDataNotif(
				{ dataId: id }
			);

			if (response.data.success) {
				console.log("success");
			} else {
				console.error("failed, ", response.data.data);
			}

		} catch (err) {
			console.error("Error update notif data:", err);
		}
	};

	useEffect(() => {
		fetchDataNotif();
		fetchCountNotif();
	}, []);

	return (
		<Container fluid id="notifikasi-mitra" className="py-4">
			<CardComponent>

				{notifData.length === 0 ?
					<h5>{translationData[code_lang]?.notifikasi?.null}</h5>
					:
					notifData.map((notif) => (
						<Card
							key={notif.id}
							className="mb-3"
							border="dark"
							bg={notif.is_read == 1 ? "light" : "warning"}
							text="dark"
							onClick={() => handleCardClick(notif.id)}
							style={{ cursor: "pointer" }}
						>
							<Card.Body>
								<Row className="justify-content-between">
									<Col xs="auto">
										<Card.Title className="mb-1 fw-bold">
											{notif.title}{' '}
											{notif.is_read == 0 ? (
												<span className="text-success">(New)</span>
											) : (
												<span className="text-danger">(Read)</span>
											)}
										</Card.Title>
									</Col>
									<Col xs="auto">
										<small className="text-muted fst-italic">{notif.created_at}</small>
									</Col>
								</Row>
								<Card.Text className="mt-2">{notif.message}</Card.Text>
							</Card.Body>
						</Card>
					))
				}

			</CardComponent>
		</Container>

	);

};

export default NotifMitraPage;
