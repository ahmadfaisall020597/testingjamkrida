/* eslint-disable no-unused-vars */
import { Button, Card, Col, Container, Row, Nav, Tab, Form } from "react-bootstrap";
import CardComponent from "src/components/partial/cardComponent";
import React, { useEffect, useState } from "react";
import tabsConfig from "./Module/tabsConfig";
import { getMitraName } from "../../../utils/getLogoByEmail";
import { fnGetlistSettingGeneral } from "./redux/settingsFn";
import { useDispatch, useSelector } from "react-redux";

const SettingsPage = () => {
	const dispatch = useDispatch();
	const [activeTab, setActiveTab] = useState(tabsConfig[0]?.key || "");
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);
	console.log('translate bahasa : ', translationData[code_lang]);

	useEffect(() => {
		fnGetlistSettingGeneral(dispatch);
	}, []);

	return (
		<Container fluid id="settings-page">
			<CardComponent type="index" title={translationData[code_lang]?.settings?.manage}>
				<Tab.Container id="settings-tabs" activeKey={activeTab} onSelect={k => setActiveTab(k)}>
					<Nav variant="tabs" className="my-3">
						{tabsConfig.map(tab => (
							<Nav.Item key={tab.key}>
								<Nav.Link eventKey={tab.key} className={activeTab === tab.key ? "active" : ""}>
									<i className={`${tab.icon} me-2`}></i>
									{/* {tab.label} */}
									{translationData[code_lang]?.settings?.[tab.label.toLowerCase()]?.text1}
								</Nav.Link>
							</Nav.Item>
						))}
					</Nav>

					<Tab.Content>
						{tabsConfig.map(tab => (
							<Tab.Pane key={tab.key} eventKey={tab.key}>
								{React.cloneElement(tab.component, {
									moduleKey: tab.key,
									isActive: activeTab === tab.key
								})}
							</Tab.Pane>
						))}
					</Tab.Content>
				</Tab.Container>
			</CardComponent>
		</Container>
	);
};

export default SettingsPage;
