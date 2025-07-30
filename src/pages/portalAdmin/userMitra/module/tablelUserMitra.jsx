/* eslint-disable no-unused-vars */
import moment from "moment";
import { Badge, Button, Stack } from "react-bootstrap";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import TableComponent from "src/components/partial/tableComponent";

const TablelUserMitra = ({ data, canEdit, onChangePrice, onChangeStatus, onViewDetail, currentParamValue }) => {
	const columnConfig = [
		{
			name: "Mitra",
			selector: row => row.ID,
			// width: "100%",
			sortable: true
		},
		{
			name: "Name",
			selector: row => row.NAME,
			// width: "100%",
			sortable: true
		},
		{
			name: "Email",
			selector: row => row.EMAIL,
			// width: "100%",
			sortable: true,
			wrap: true
		},
		{
			name: "Status",
			selector: row => row.STATUS,
			// width: "180px",
			sortable: true,
			cell: row => {
				// Default badge color
				let badgeColor = "secondary";
				let badgeText = row.STATUS;

				if (row.STATUS === "Inactive") {
					badgeColor = "danger";
				} else if (row.STATUS === "Active") {
					badgeColor = "success";
				}

				return (
					<Badge pill bg={badgeColor} style={{ fontSize: "12px", padding: "5px 10px", color: "#fff" }}>
						{badgeText}
					</Badge>
				);
			}
		},

		// {
		// 	name: "Action",
		// 	cell: row => (
		// 		<Stack direction="horizontal">
		// 			<Button variant="link" onClick={() => onViewDetail(row)} className="me-2 text-decoration-none">
		// 				View
		// 			</Button>
		// 			<div>|</div>
		// 			<Button variant="link" onClick={() => onViewDetail(row)} className="me-2 text-decoration-none">
		// 				{row.STATUS}
		// 			</Button>
		// 		</Stack>
		// 	)
		// 	// width: "100%",
		// },
		{
			name: "Action",
			cell: row => (
				<div style={{ display: "flex", gap: 10, justifyContent: "flex-start", minWidth: 80 }}>
					{/* <FaEye style={{ cursor: "pointer", color: "blue", width: 20, height: 20 }} title="View" onClick={() => onViewDetail(row)} /> */}
					<FaEdit style={{ cursor: "pointer", color: "orange", width: 20, height: 20 }} title="View" onClick={() => onViewDetail(row)} />
					<FaTrash style={{ cursor: "pointer", color: "red", width: 20, height: 20 }} title="View" onClick={()=> onViewDetail(row)} />
				</div>
			),
			ignoreRowClick: true,
			allowOverflow: true,
			button: true,
			Alignment: "center"
		}
	];

	const customStyles = {
		// header: {
		//   style: {
		//     background: '#EBF451',
		//     color: '#333333',
		//     fontSize: '18px',
		//     fontWeight: 'bold',
		//     textAlign: 'center'
		//   },
		// },
		headCells: {
			style: {
				textAlign: "center",
				background: "#EBF451",
				color: "#333333",
				fontWeight: "bold"
			}
		},
		rows: {
			style: {
				textAlign: "center",
				backgroundColor: "#f1f1f1"
			}
		},
		cells: {
			style: {
				textAlign: "center"
			}
		}
	};

	return (
		<div>
			<TableComponent columns={columnConfig} data={data || []} pagination persistTableHead responsive striped paginationComponentOptions={{ noRowsPerPage: true }} customStyles={customStyles} />
		</div>
	);
};

export default TablelUserMitra;
