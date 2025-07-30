import { useEffect, useState } from "react";
import { Badge, Button, FormControl, InputGroup, Stack } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

const SearchListComponent = ({ ListDataStatus, onChange }) => {
	const [filterList, setFilterList] = useState([]);
	const [keyword, setKeyword] = useState("");
	const [field, setField] = useState(ListDataStatus.length > 0 ? ListDataStatus[0].value : "");

	useEffect(() => {
		onChange(filterList);
	}, [filterList]);

	const handleChangeField = e => {
		setField(e.target.value);
	};

	const handleKeyDown = e => {
		if (e.key === "Enter") {
			// setFilterList([...filterList, { [field]: keyword }])
			setFilterList([...filterList, { field: field, value: keyword }]);
			setKeyword("");
		}
	};

	const removeFilterItem = targetItem => {
		setFilterList(filterList.filter(item => !(item.field === targetItem.field && item.value === targetItem.value)));
	};

	return (
		<>
			<div className="col-sm-8">
				<InputGroup>
					<select className="form-select" style={{ width: "40%" }} onChange={handleChangeField} value={field}>
						{ListDataStatus.map((item, idx) => (
							<option key={idx} value={item.value}>
								{item.label}
							</option>
						))}
					</select>
					<FormControl
						type="text"
						placeholder="Filter"
						aria-label="Search"
						className="form-control"
						style={{ width: "auto" }}
						onKeyDown={handleKeyDown}
						onChange={e => setKeyword(e.target.value)}
						value={keyword}
					/>
				</InputGroup>
			</div>
			<div className="col-sm-12 mb-2">
				{filterList.map((item, index) => (
					<Badge pill bg="dark" className="m-1" onClick={() => removeFilterItem(item)}>
						{ListDataStatus.find(x => x.value === item.field)?.label}: {item.value}
						<FaTimes key={index} size={14} style={{ marginLeft: 5, marginTop: -1, cursor: "pointer" }} />
					</Badge>
				))}
			</div>
		</>
	);
};

export default SearchListComponent;
