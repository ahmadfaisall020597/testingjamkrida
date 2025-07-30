/* eslint-disable no-unused-vars */
import React, { useState, useImperativeHandle, forwardRef, useEffect } from "react";
import { Table, Form, Col, Row, Button } from "react-bootstrap";
import { getlistlampiran, getlistproduct, getlistreasonclaim, getSettingPerykeyAndMitra } from "../../utils/api/apiSettings";
import LoadingComponent from "./loadingComponent";
import { FaBoxOpen, FaCheck, FaCube, FaExclamationTriangle, FaFile, FaList, FaPaperclip } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { handleItemsChange, mergeDataWithExisting, getExistingDataFromRedux, submitAllPendingData } from "../../pages/portalAdmin/settings/redux/settingsFn";

const TableSettingComponent = forwardRef(({ module = "default", tableProps = {}, selectedMitra }, ref) => {
	const [selectedItems1, setSelectedItems1] = useState(null);
	const [selectedItems2, setSelectedItems2] = useState([]);

	const [tableData1, setTableData1] = useState([]);
	const [tableData2, setTableData2] = useState([]);
	const [loading, setLoading] = useState(false);
	const [tableLoading, setTableLoading] = useState(false);
	const [error, setError] = useState(null);

	const [selectedItems3, setSelectedItems3] = useState([]);
	const [tableData3, setTableData3] = useState([]);

	const dispatch = useDispatch();
	const settingsState = useSelector(state => state.settings);
	const isLoading = useSelector(state => state.isLoading);

	// ini redux untuk ambil data dari state
	useEffect(() => {
		if (selectedMitra && selectedItems1) {
			const currentModuleState = settingsState.modules[module];
			const key = `${selectedMitra}_${selectedItems1}`;

			if (module === "KLAIM_SETTINGS") {
				if (currentModuleState && currentModuleState.dataLampiran[key]) {
					setSelectedItems2(currentModuleState.dataLampiran[key].items);
				} else {
					setSelectedItems2([]);
				}

				if (currentModuleState && currentModuleState.dataReasonClaim[key]) {
					setSelectedItems3(currentModuleState.dataReasonClaim[key].items);
				} else {
					setSelectedItems3([]);
				}
			} else {
				if (currentModuleState && currentModuleState.data[key]) {
					setSelectedItems2(currentModuleState.data[key].items);
				} else {
					setSelectedItems2([]);
				}
			}
		}
	}, [settingsState.modules, module, selectedMitra, selectedItems1]);

	//ini Use Effect buat ambild data yang udah di ceklist dari redux
	useEffect(() => {
		if (selectedMitra && selectedItems1) {
			if (module === "KLAIM_SETTINGS") {
				const existingDataLampiran = getExistingDataFromRedux(settingsState, module, selectedMitra, selectedItems1, "lampiran");
				setSelectedItems2(existingDataLampiran?.items || []);

				const existingDataReasonClaim = getExistingDataFromRedux(settingsState, module, selectedMitra, selectedItems1, "reason_claim");
				setSelectedItems3(existingDataReasonClaim?.items || []);
			} else {
				const existingDataLampiran = getExistingDataFromRedux(settingsState, module, selectedMitra, selectedItems1, "lampiran");
				setSelectedItems2(existingDataLampiran?.items || []);
			}
		}
	}, [settingsState.modules, module, selectedMitra, selectedItems1]);

	const fetchListProduct = async () => {
		setLoading(true);
		setError(null);
		try {
			const response = await getlistproduct();
			setTableData1(response.data.data || []);
		} catch (err) {
			console.error("Error fetching product data:", err);
			setError("Gagal memuat data produk");
			setTableData1([]);
		} finally {
			setLoading(false);
		}
	};

	const fetchListLampiran = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getlistlampiran();
			setTableData2(response.data.data || []);
		} catch (err) {
			console.error("Error fetching lampiran data:", err);
			setError("Gagal memuat data lampiran");
			if (module === "default") {
				setTableData2([]);
			}
		} finally {
			setLoading(false);
		}
	};

	const fetchListReasonClaim = async () => {
		setLoading(true);
		setError(null);

		try {
			const response = await getlistreasonclaim();
			if (module === "KLAIM_SETTINGS") {
				setTableData3(response.data.data || []);
			}
		} catch (err) {
			console.error("Error fetching reason claim data:", err);
			setError("Gagal memuat data reason claim");
			if (module === "KLAIM_SETTINGS") {
				setTableData3([]);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchListProduct();

		if (module === "KLAIM_SETTINGS") {
			fetchListLampiran();
			fetchListReasonClaim();
		} else {
			fetchListLampiran();
		}
	}, [module]);

	const handleRowClick = itemId => {
		setSelectedItems1(itemId);
		if (!selectedMitra) {
			setSelectedItems1([]);
			toast.error("Pilih Mitra Terlebih dahulu");
			return;
		}

		const fetchingData = async () => {
			setError(null);
			try {
				const response = await getSettingPerykeyAndMitra(module, selectedMitra, itemId);
				const apiData = response.data.data || [];

				if (module === "KLAIM_SETTINGS") {
					// Handle Lampiran
					const existingDataLampiran = getExistingDataFromRedux(settingsState, module, selectedMitra, itemId, "lampiran");
					const autoCheckedLampiran = apiData
						.filter(setting => setting.is_mandatory === 1 && setting.lampiran)
						.map(setting => setting.lampiran)
						.filter(lampiran => tableData2.some(item => item.value === lampiran));

					const finalSelectionLampiran = existingDataLampiran?.hasUserChanges ? existingDataLampiran.items : [...new Set([...autoCheckedLampiran, ...(existingDataLampiran?.items || [])])];

					setSelectedItems2(finalSelectionLampiran);
					handleItemsChange(dispatch, module, finalSelectionLampiran, tableData2, selectedMitra, itemId, false, "lampiran");

					// Handle Reason Claim
					const existingDataReasonClaim = getExistingDataFromRedux(settingsState, module, selectedMitra, itemId, "reason_claim");
					const autoCheckedReasonClaim = apiData
						.filter(setting => setting.is_mandatory === 1 && setting.reason_claim)
						.map(setting => setting.reason_claim)
						.filter(reasonClaim => tableData3.some(item => item.value === reasonClaim));

					const finalSelectionReasonClaim = existingDataReasonClaim?.hasUserChanges
						? existingDataReasonClaim.items
						: [...new Set([...autoCheckedReasonClaim, ...(existingDataReasonClaim?.items || [])])];

					setSelectedItems3(finalSelectionReasonClaim);
					handleItemsChange(dispatch, module, finalSelectionReasonClaim, tableData3, selectedMitra, itemId, false, "reason_claim");
				} else {
					const existingDataLampiran = getExistingDataFromRedux(settingsState, module, selectedMitra, itemId, "lampiran");
					const autoChecked = apiData
						.filter(setting => setting.is_mandatory === 1 && setting.lampiran)
						.map(setting => setting.lampiran)
						.filter(lampiran => tableData2.some(item => item.value === lampiran));

					const finalSelection = existingDataLampiran?.hasUserChanges ? existingDataLampiran.items : [...new Set([...autoChecked, ...(existingDataLampiran?.items || [])])];

					setSelectedItems2(finalSelection);
					handleItemsChange(dispatch, module, finalSelection, tableData2, selectedMitra, itemId, false, "lampiran");
				}
			} catch (err) {
				console.error("❌ Error fetching existing data settings:", err);
				setError("Gagal memuat data pengaturan");
				setSelectedItems2([]);
				if (module === "KLAIM_SETTINGS") {
					setSelectedItems3([]);
				}
			}
		};

		fetchingData();
	};

	const handleCheckboxChange2 = (itemId, isChecked) => {
		console.log("selectedItems1:", selectedItems1);
		if (!selectedItems1 || selectedItems1 === "" || (Array.isArray(selectedItems1) && selectedItems1.length === 0)) {
			console.error("Pilih Product Terlebih dahulu");
			toast.error("Pilih Product Terlebih dahulu");
		} else {
			const newSelection = isChecked ? [...selectedItems2, itemId] : selectedItems2.filter(id => id !== itemId);

			setSelectedItems2(newSelection);

			if (selectedMitra && selectedItems1) {
				handleItemsChange(dispatch, module, newSelection, tableData2, selectedMitra, selectedItems1, true, "lampiran");
			}
		}
	};

	const handleSelectAll2 = isChecked => {
		if (!selectedItems1 || selectedItems1 === "" || (Array.isArray(selectedItems1) && selectedItems1.length === 0)) {
			console.error("Pilih Product Terlebih dahulu");
			toast.error("Pilih Product Terlebih dahulu");
		} else {
			const newSelection = isChecked ? tableData2.map(item => item.value) : [];
			setSelectedItems2(newSelection);

			if (selectedMitra && selectedItems1) {
				handleItemsChange(dispatch, module, newSelection, tableData2, selectedMitra, selectedItems1, true, "lampiran");
			}
		}
	};

	const handleCheckboxChange3 = (itemId, isChecked) => {
		if (!selectedItems1 || selectedItems1 === "" || (Array.isArray(selectedItems1) && selectedItems1.length === 0)) {
			console.error("Pilih Product Terlebih dahulu");
			toast.error("Pilih Product Terlebih dahulu");
		} else {
			const newSelection = isChecked ? [...selectedItems3, itemId] : selectedItems3.filter(id => id !== itemId);

			setSelectedItems3(newSelection);

			if (selectedMitra && selectedItems1) {
				handleItemsChange(dispatch, module, newSelection, tableData3, selectedMitra, selectedItems1, true, "reason_claim");
			}
		}
	};

	const handleSelectAll3 = isChecked => {
		if (!selectedItems1 || selectedItems1 === "" || (Array.isArray(selectedItems1) && selectedItems1.length === 0)) {
			console.error("Pilih Product Terlebih dahulu");
			toast.error("Pilih Product Terlebih dahulu");
		} else {
			const newSelection = isChecked ? tableData3.map(item => item.value) : [];
			setSelectedItems3(newSelection);

			if (selectedMitra && selectedItems1) {
				handleItemsChange(dispatch, module, newSelection, tableData3, selectedMitra, selectedItems1, true, "reason_claim");
			}
		}
	};

	const handleSubmit = () => {
		submitAllPendingData(dispatch, settingsState);
	};

	console.log("selectedItems3:", selectedItems3);

	if (loading) {
		return (
			<div className="text-center py-5">
				<div className="loading-container">
					<div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
						<span className="visually-hidden">Loading...</span>
					</div>
					<h6 className="text-muted mb-2">Memuat data...</h6>
					<p className="text-muted small">Mohon tunggu sebentar</p>
				</div>
			</div>
		);
	}

	return (
		<div className="checkbox-table-container">
			<Row className="g-4">
				<Col md={6}>
					<div className="card shadow-sm border-0">
						<div className="card-header bg-gradient-primary text-white d-flex justify-content-between align-items-center">
							<h6 className="mb-0 fw-bold">
								<FaCube className="me-2" />
								Produk
							</h6>
							<span className="badge bg-light text-primary fw-bold">{tableData1.length} item</span>
						</div>
						<div className="card-body p-0">
							<div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
								<Table hover className="mb-0 modern-table">
									<thead className="sticky-top">
										<tr className="bg-light">
											<th className="border-0 py-3 px-4 text-muted fw-semibold">
												<FaFile className="me-2" />
												Label
											</th>
										</tr>
									</thead>
									<tbody>
										{tableData1.length > 0 ? (
											tableData1.map((item, index) => (
												<tr
													key={`table1-${item.id}`}
													onClick={() => handleRowClick(item.value)}
													className={`table-row-hover ${selectedItems1 === item.value ? "selected-row" : ""}`}
													style={{
														cursor: "pointer",
														backgroundColor: selectedItems1 === item.value ? "#e8f4fd" : "transparent",
														transition: "all 0.3s ease",
														borderLeft: selectedItems1 === item.value ? "4px solid #0d6efd" : "4px solid transparent"
													}}
												>
													<td className="py-3 px-4 border-0">
														<div className="d-flex align-items-center">
															{selectedItems1 === item.value && (
																<div className="selected-indicator me-3">
																	<FaCheck className="text-primary fs-5" />
																</div>
															)}
															<div className="item-content">
																<span className="fw-medium text-dark">{item.label}</span>
															</div>
														</div>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td className="text-center text-muted py-5 border-0">
													<div className="empty-state">
														<FaBoxOpen className="fs-1 text-muted mb-3" />
														<p className="mb-0 fw-medium">Tidak ada data produk</p>
														<small className="text-muted">Data produk akan muncul di sini</small>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</Table>
							</div>
						</div>
					</div>
				</Col>

				<Col md={6}>
					<div className="card shadow-sm border-0">
						<div className="card-header bg-gradient-success text-white d-flex justify-content-between align-items-center">
							<h6 className="mb-0 fw-bold">
								{module === "claim" ? <FaExclamationTriangle className="me-2" /> : <FaPaperclip className="me-2" />}
								{module === "claim" ? "Reason Claim" : "Lampiran"}
							</h6>
							<span className="badge bg-light text-success fw-bold">
								{selectedItems2.length}/{tableData2.length} dipilih
							</span>
						</div>
						<div className="card-body p-0">
							<div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
								<Table hover className="mb-0 modern-table">
									<thead className="sticky-top">
										<tr className="bg-light">
											<th className="border-0 py-3 px-4" width="60">
												<Form.Check
													type="checkbox"
													checked={selectedItems2.length === tableData2.length && tableData2.length > 0}
													onChange={e => handleSelectAll2(e.target.checked)}
													aria-label="Select all items table 2"
													className="custom-checkbox"
												/>
											</th>
											<th className="border-0 py-3 px-4 text-muted fw-semibold">
												<FaList className="me-2" />
												Label
											</th>
										</tr>
									</thead>
									<tbody>
										{tableData2.length > 0 ? (
											tableData2.map((item, index) => (
												<tr
													key={`table2-${item.value}`}
													className={`table-row-hover ${selectedItems2.includes(item.value) ? "selected-row-multi" : ""}`}
													style={{
														backgroundColor: selectedItems2.includes(item.value) ? "#e8f5e8" : "transparent",
														transition: "all 0.3s ease",
														borderLeft: selectedItems2.includes(item.value) ? "4px solid #198754" : "4px solid transparent"
													}}
												>
													<td className="py-3 px-4 border-0">
														<Form.Check
															type="checkbox"
															checked={selectedItems2.includes(item.value)}
															onChange={e => handleCheckboxChange2(item.value, e.target.checked)}
															aria-label={`Select ${item.label}`}
															className="custom-checkbox"
														/>
													</td>
													<td className="py-3 px-4 border-0">
														<div className="item-content">
															<span className="fw-medium text-dark">{item.label}</span>
														</div>
													</td>
												</tr>
											))
										) : (
											<tr>
												<td colSpan="2" className="text-center text-muted py-5 border-0">
													<div className="empty-state">
														{module === "claim" ? <FaExclamationTriangle className="fs-1 text-muted mb-3" /> : <FaPaperclip className="fs-1 text-muted mb-3" />}
														<p className="mb-0 fw-medium">{module === "claim" ? "Tidak ada data reason claim" : "Tidak ada data lampiran"}</p>
														<small className="text-muted">Data akan muncul di sini</small>
													</div>
												</td>
											</tr>
										)}
									</tbody>
								</Table>
							</div>
						</div>
					</div>
					{module === "KLAIM_SETTINGS" && (
						<div className="card shadow-sm border-0 mt-3">
							<div className="card-header bg-gradient-danger text-white d-flex justify-content-between align-items-center">
								<h6 className="mb-0 fw-bold">
									<FaExclamationTriangle className="me-2" />
									Reason Claim
								</h6>
								<span className="badge bg-light text-danger fw-bold">
									{selectedItems3.length}/{tableData3.length} dipilih
								</span>
							</div>
							<div className="card-body p-0">
								<div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
									<Table hover className="mb-0 modern-table">
										<thead className="sticky-top">
											<tr className="bg-light">
												<th className="border-0 py-3 px-4" width="60">
													<Form.Check
														type="checkbox"
														checked={selectedItems3.length === tableData3.length && tableData3.length > 0}
														onChange={e => handleSelectAll3(e.target.checked)}
														aria-label="Select all reason claims"
														className="custom-checkbox"
													/>
												</th>
												<th className="border-0 py-3 px-4 text-muted fw-semibold">
													<FaList className="me-2" />
													Label
												</th>
											</tr>
										</thead>
										<tbody>
											{tableData3.length > 0 ? (
												tableData3.map((item, index) => (
													<tr
														key={`table3-${item.value}`}
														className={`table-row-hover ${selectedItems3.includes(item.value) ? "selected-row-multi" : ""}`}
														style={{
															backgroundColor: selectedItems3.includes(item.value) ? "#fff3cd" : "transparent",
															transition: "all 0.3s ease",
															borderLeft: selectedItems3.includes(item.value) ? "4px solid #ffc107" : "4px solid transparent"
														}}
													>
														<td className="py-3 px-4 border-0">
															<Form.Check
																type="checkbox"
																checked={selectedItems3.includes(item.value)}
																onChange={e => handleCheckboxChange3(item.value, e.target.checked)}
																aria-label={`Select ${item.label}`}
																className="custom-checkbox"
															/>
														</td>
														<td className="py-3 px-4 border-0">
															<div className="item-content">
																<span className="fw-medium text-dark">{item.label}</span>
															</div>
														</td>
													</tr>
												))
											) : (
												<tr>
													<td colSpan="2" className="text-center text-muted py-5 border-0">
														<div className="empty-state">
															<FaExclamationTriangle className="fs-1 text-muted mb-3" />
															<p className="mb-0 fw-medium">Tidak ada data reason claim</p>
															<small className="text-muted">Data akan muncul di sini</small>
														</div>
													</td>
												</tr>
											)}
										</tbody>
									</Table>
								</div>
							</div>
						</div>
					)}
				</Col>
			</Row>
			<Row>
				<Col md={12} className="text-end">
					<Button variant="primary" outline className="text-white mx-2 my-3" disabled={loading} onClick={handleSubmit}>
						<i className="fas fa-save me-2"></i>
						{loading ? "Loading..." : "Simpan Pengaturan"}
					</Button>
				</Col>
			</Row>
		</div>
	);
});

TableSettingComponent.displayName = "TableSettingComponent";

export default TableSettingComponent;
