/* eslint-disable no-unused-vars */
import { Card, Col, Row } from "react-bootstrap";
import TableSettingComponent from "../../../components/partial/tableSettingComponent";
import InputDropdownComponent from "../../../components/partial/inputDropdownComponent";
import { getlistmitra, getSettingPerykeyAndMitra } from "../../../utils/api/apiSettings";
import { useEffect, useRef, useState } from "react";

const PenjaminanSettings = ({ moduleKey = "PENJAMINAN_SETTINGS", isActive = false }) => {
	const [mitraList, setMitraList] = useState([]);
	const [selectedMitra, setSelectedMitra] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const tableRef = useRef(null);

	useEffect(() => {
		if (isActive) {
			fetchMitraData();
		} 
	}, [isActive]);

	const toLowerStringMitra = selectedMitra.toLowerCase();


	const fetchMitraData = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getlistmitra();

			if (Array.isArray(response.data)) {
				setMitraList(response.data);
			} else {
				console.error("Response data is not an array:", response.data);
				setError("Format data tidak valid");
				setMitraList([]);
			}
		} catch (err) {
			console.error("Error fetching mitra data:", err);
			setError("Gagal memuat data mitra");
		} finally {
			setLoading(false);
		}
	};

	const transformedMitraList = mitraList.map(mitra => ({
		value: mitra.bank_code,
		label: mitra.bank_name
	}));

	const handleMitraChange = e => {
		setSelectedMitra(e.target.value);
		if (tableRef.current) {
			tableRef.current.resetSelection();
		}
	};

	const handleSaveSettings = async () => {
		console.log(`Saving settings for module: ${moduleKey}, mitra: ${selectedMitra}`);
	};

	return (
		<Card className="border-0 shadow-sm">
			<Card.Header className="bg-primary text-white">
				<h6 className="mb-0">
					<i className="fas fa-shield-alt me-2"></i>
					Pengaturan Penjaminan
				</h6>
			</Card.Header>
			<Card.Body>
				<div className="settings-content-area">
					<Row>
						<Col>
							<InputDropdownComponent
								listDropdown={!transformedMitraList ? [] : [{ value: "", label: "-- Pilih Mitra --" }, ...transformedMitraList]}
								value={selectedMitra}
								onChange={handleMitraChange}
								label="Pilih Mitra"
								valueIndex={true}
								required={true}
								disabled={loading}
							/>
						</Col>
					</Row>
					<TableSettingComponent
						module={moduleKey}
						selectedMitra={toLowerStringMitra}
						ref={tableRef}
					/>
				</div>
			</Card.Body>
			
		</Card>
	);
};

export default PenjaminanSettings;
