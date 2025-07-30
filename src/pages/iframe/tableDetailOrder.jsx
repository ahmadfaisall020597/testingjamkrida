import moment from "moment";
import { Button, Stack } from "react-bootstrap";
import TableComponent from "src/components/partial/tableComponent";
import { formatDateTime, formatNumber } from "src/utils/helpersFunction";

const TableDetailOrder = ({data, onViewDetail}) =>{

  const columnConfig = [
    {
      name: "Request Status",
      selector: row => row.STATUS_DESC,
      width: "250px",
    },
    {
      name: "Request Date",
      selector: row => row.REQUEST_DATE,
      format: row => moment(row.REQUEST_DATE).format("DD MMM YYYY"),
      width: "150px",
    },
    {
      name: "Request Delivery",
      selector: row => row.DELIVERY_DATE,
      format: row => moment(row.DELIVERY_DATE).format("DD MMM YYYY HH:mm"),
      width: "180px",
    },
    {
      name: "Function Item",
      selector: row => row.FUNCTION_ITEM,
      width: "200px",
      wrap: true
    },
    {
      name: "Tenant Name",
      selector: row => row.TENANT_NAME,
      width: "180px",
    },
    {
      name: "Room Name",
      selector: row => row.ROOM_NAME,
      width: "180px",
      wrap: true
    },
    {
      name: "Room Book by",
      selector: row => row.ROOM_BOOK_BY || "-",
      width: "180px",

    },
    {
      name: "Range Booking Room Date",
      selector: row => row.BOOK_DATE && row.BOOK_TO ?
      `${formatDateTime(row.BOOK_DATE)} - ${formatDateTime(row.BOOK_TO)}`
      : "-",
      width: "350px"
    },
    {
      name: "Delivery Type",
      selector: row => row.DELIVERY_TYPE_DESC,
      width: "160px",
    },
    {
      name: "Items",
      selector: row => row.ITEMS,
      width: "100px",
    },
    {
      name: "Total price",
      selector: row => formatNumber(row.TOTAL_PRICE),
      width: "140px",
    },
    {
      name: "Total price after discount",
      selector: row => formatNumber(row.TOTAL_PRICE_DISCOUNT),
      width: "250px",
      wrap: true
    },
    {
      name: "Price Updated",
      selector: row => formatNumber(row.PRICE_ADMIN),
      width: "200px",
    },
    {
      name: "Actions",
      cell: row => (
        <Stack direction="horizontal">
          <Button variant="link" onClick={() => onViewDetail(row)} className="me-2">
            View Detail
          </Button>
        </Stack>
      ),
      width: "150px",
    },
  ]

  return(
    <div>
      <TableComponent
        columns={columnConfig}
        data={data || []}
        pagination
        persistTableHead
        responsive
        striped
        paginationComponentOptions={{noRowsPerPage: true}}
      />
    </div>
  )
}

export default TableDetailOrder;