/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import TableSettingComponent from "../../../components/partial/tableSettingComponent";
import { Button, Card, Col, Container, Row, Nav, Tab, Form } from "react-bootstrap";
import InputComponent from "src/components/partial/inputComponent";
import { useDispatch, useSelector } from "react-redux";
import { submitAllPendingData, updateGeneralSettingsValue } from "./redux/settingsFn";
import { use } from "react";

const GeneralSettings = () => {
	const dispatch = useDispatch();

	const [formData, setFormData] = useState({
		OTP_DURATION_GENERAL_SETTINGS: 0,
		RESENT_OTP_INTERVAL_GENERAL_SETTINGS: 0,
		MAX_FAILED_LOGIN_ATTEMP_GENERAL_SETTINGS: 0,
		FAILED_LOGIN_SUSPENDED_GENERAL_SETTINGS: 0,
		FORCE_NOTIVE_SHOW_GENERAL_SETTINGS: true
	});


	const generalSettings = useSelector(state => state.settings.modules.GENERAL_SETTINGS.dataAPI);
	const allSettings = useSelector(state => state.settings);
	const testingSettiongs = useSelector(state => state.settings.modules.GENERAL_SETTINGS);

	//
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);
	console.log('translate bahasa : ', translationData[code_lang]);

	useEffect(() => {
		setFormData(generalSettings);
	}, [generalSettings]);

	const handleChange = (field, value) => {
		setFormData({
			...formData,
			[field]: value
		});
	};

	useEffect(() => {
		updateGeneralSettingsValue(dispatch, formData)
	}, [formData]);


	const handleSubmit = () => {
		console.log("generalSettings", allSettings);
		submitAllPendingData(dispatch, allSettings);
	};

	return (
		<Card className="border-0 shadow-sm">
			<Card.Header className="bg-info text-white">
				<h6 className="mb-0">
					<i className="fas fa-cog me-2"></i>
					{translationData[code_lang]?.settings?.general?.text2}
				</h6>
			</Card.Header>
			<Card.Body>
				<Row className="mb-3">
					<Col xs={12} md={8} lg={6}>
						<InputComponent
							type="number"
							label={translationData[code_lang]?.settings?.general?.gen1}
							labelXl="6"
							value={formData.OTP_DURATION_GENERAL_SETTINGS}
							name="OTP_DURATION_GENERAL_SETTINGS"
							onChange={e => handleChange("OTP_DURATION_GENERAL_SETTINGS", e.target.value)}
							formGroupClassName="gx-4"
							placeholder="0"
						/>
					</Col>
				</Row>

				<Row className="mb-3">
					<Col xs={12} md={8} lg={6}>
						<InputComponent
							type="number"
							label={translationData[code_lang]?.settings?.general?.gen2}
							labelXl="6"
							value={formData.RESENT_OTP_INTERVAL_GENERAL_SETTINGS}
							name="RESENT_OTP_INTERVAL_GENERAL_SETTINGS"
							onChange={e => handleChange("RESENT_OTP_INTERVAL_GENERAL_SETTINGS", e.target.value)}
							formGroupClassName="gx-4"
							placeholder="0"
						/>
					</Col>
				</Row>

				<Row className="mb-3">
					<Col xs={12} md={8} lg={6}>
						<InputComponent
							type="number"
							label={translationData[code_lang]?.settings?.general?.gen3}
							labelXl="6"
							value={formData.MAX_FAILED_LOGIN_ATTEMP_GENERAL_SETTINGS}
							name="MAX_FAILED_LOGIN_ATTEMP_GENERAL_SETTINGS"
							onChange={e => handleChange("MAX_FAILED_LOGIN_ATTEMP_GENERAL_SETTINGS", e.target.value)}
							formGroupClassName="gx-4"
							placeholder="0"
						/>
					</Col>
				</Row>

				<Row className="mb-3">
					<Col xs={12} md={8} lg={6}>
						<InputComponent
							type="number"
							label={translationData[code_lang]?.settings?.general?.gen4}
							labelXl="6"
							value={formData.FAILED_LOGIN_SUSPENDED_GENERAL_SETTINGS}
							name="FAILED_LOGIN_SUSPENDED_GENERAL_SETTINGS"
							onChange={e => handleChange("FAILED_LOGIN_SUSPENDED_GENERAL_SETTINGS", e.target.value)}
							formGroupClassName="gx-4"
							placeholder="0"
						/>
					</Col>
				</Row>

				<Row className="mb-3">
					<Col xs={12} md={8} lg={6}>
						<div className="d-flex align-items-center">
							<Form.Check type="checkbox" id="FORCE_NOTIVE_SHOW_GENERAL_SETTINGS" className="d-flex align-items-center">
								<Form.Check.Input
									type="checkbox"
									className="me-2"
									checked={formData.FORCE_NOTIVE_SHOW_GENERAL_SETTINGS}
									onChange={e => handleChange("FORCE_NOTIVE_SHOW_GENERAL_SETTINGS", e.target.checked)}
								/>
								<Form.Check.Label htmlFor="FORCE_NOTIVE_SHOW_GENERAL_SETTINGS" className="mb-0" style={{ cursor: "pointer" }}>
									{translationData[code_lang]?.settings?.general?.gen5}
								</Form.Check.Label>
							</Form.Check>
						</div>
					</Col>
				</Row>
			</Card.Body>
			<Col md={12} className="text-end">
				<Button variant="primary" outline className="text-white mx-2 my-3" onClick={handleSubmit}>
					<i className="fas fa-save me-2"></i>
					{translationData[code_lang]?.settings?.general?.confirm}
				</Button>
			</Col>
		</Card>
	);
};

export default GeneralSettings;
