/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Col, Form, Row, FormControl } from "react-bootstrap";
import { FaCalendarAlt } from "react-icons/fa";

// Komponen input tanggal manual
const DateFieldManual = ({ value, onChange, disabled, placeholder = "dd/mm/yyyy", min, max, inputStyle }) => {
	const hiddenInputRef = useRef();

	const handleOpenPicker = () => {
		if (!disabled && hiddenInputRef.current) {
			if (hiddenInputRef.current?.showPicker) {
				hiddenInputRef.current.showPicker();
			}
		}
	};

	const handleDateChange = e => {
		const val = e.target.value; // format yyyy-mm-dd
		if (val) {
			const [y, m, d] = val.split("-");
			const formattedDisplay = `${d}/${m}/${y}`; // untuk tampilan
			onChange(val); // ✅ kirim yyyy-mm-dd ke parent
		} else {
			onChange("");
		}
	};

	// 🔁 Convert yyyy-mm-dd → dd/mm/yyyy (untuk display)
	const displayValue = value && value.includes("-") ? value.split("-").reverse().join("/") : value;

	return (
		<div style={{ position: "relative", cursor: disabled ? "not-allowed" : "pointer" }}>
			<FormControl type="text" value={displayValue} readOnly disabled={disabled} placeholder={placeholder} onClick={handleOpenPicker} style={{ paddingRight: "2rem", ...inputStyle }} />
			<FaCalendarAlt
				onClick={handleOpenPicker}
				style={{
					position: "absolute",
					right: "10px",
					top: "50%",
					transform: "translateY(-50%)",
					pointerEvents: disabled ? "none" : "auto",
					color: "#495057"
				}}
			/>
			<input
				type="date"
				ref={hiddenInputRef}
				onChange={handleDateChange}
				style={{
					position: "absolute",
					opacity: 0,
					pointerEvents: "none",
					width: 0,
					height: 0
				}}
				disabled={disabled}
				min={min}
				max={max}
			/>
		</div>
	);
};

const InputDateComponent = ({
	labelXl = "3",
	labelXs = "4",
	ColXl = 12 - Number(labelXl),
	formGroupClassName,
	startDate: initialStartDate,
	onChangeStartDate,
	inputStyle,
	// endDate: initialEndDate,
	// onChangeEndDate,
	required,
	readOnly,
	label,
	//colEndDateClassName,
	colStartDateClassName,
	rowClassName,
	customLabelFrom
	//customLabelTo,
}) => {
	const getTodayDate = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const [startDate, setStartDate] = useState(initialStartDate || getTodayDate());
	// const [endDate, setEndDate] = useState(initialEndDate || "");
	const [error, setError] = useState("");

	useEffect(() => {
		setStartDate(initialStartDate || getTodayDate());
	}, [initialStartDate]);

	return (
		<Row className={`${rowClassName}`}>
			{label && (
				<Col md={labelXs}>
					<Form.Label>
						{label}
						{required && <span className="text-danger">*</span>}
					</Form.Label>
				</Col>
			)}

			<Col lg={12}>
				<Form.Group as={Row} className={`mb-3 ${formGroupClassName}`}>
					<Col xl={ColXl} className="position-relative">
						<DateFieldManual
							value={startDate}
							onChange={val => {
								setStartDate(val);
								onChangeStartDate(val);
							}}
							// max={startDate}
							required={required}
							disabled={readOnly}
							inputStyle={inputStyle}
						/>
					</Col>
				</Form.Group>
			</Col>
		</Row>
	);
};

export default InputDateComponent;
