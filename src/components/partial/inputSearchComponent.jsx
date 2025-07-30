import { Button, Col, Form, FormControl, InputGroup, Row } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const InputSearchComponent = ({
	value,
	onChange,
	buttonOnclick,
	componentButton = <FaSearch />,
	label = "Search Data",
	placeholder = "Search...",
	formGroupClassName,
	labelXl = "3",
	required,
	marginBottom = "3",
	disabled
}) => {
	const handleCLick = () => {
		if (disabled) {
			return;
		}
		buttonOnclick();
	};
	return (
		<Form.Group as={Row} className={`mb-${marginBottom} ${formGroupClassName}`}>
			{label && (
				<Form.Label column xl={labelXl}>
					{label}
					{required && <span className="text-danger">*</span>}
				</Form.Label>
			)}
			<Col xl={12 - Number(labelXl)}>
				<InputGroup>
					<FormControl type="text" placeholder={placeholder} aria-label="Search" aria-describedby="search-icon" onChange={onChange} value={value} required={required} disabled={disabled} />
					{/* <Button variant="dark" onClick={handleCLick}>{componentButton}</Button> */}
				</InputGroup>
			</Col>
		</Form.Group>
	);
};

export default InputSearchComponent;
