import moment from "moment";
import { Button, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import TableComponent from "src/components/partial/tableComponent";
import { formatDateTime, formatNumber, formatNumberWithThousandSeparator } from "src/utils/helpersFunction";

const TableDetailOrder = ({data, canEdit, onChangePrice, onChangeStatus, onViewDetail, currentParamValue}) =>{
  const { statusOrder } = useSelector(state => state.newFunctionRequest)

  const getReadOnlyDropDown = (row)=>{
    if(currentParamValue == "edit"){
      if(["SO_002","SO_007","SO_009", "SO_010"].includes(row.STATUS)){
        return true
      }
    }
    return !canEdit
  }

  const columnConfig = [
    {
      name: "Request Status",
      cell: (row) => (
        <InputDropdownComponent
          onChange={(e) => onChangeStatus(row, e.target.value)}
          value={row.STATUS}
          label=""
          listDropdown={statusOrder.filter(item=>item.value !== "")}
          labelXl="0"
          valueIndex
          marginBottom="0"
          readOnly={getReadOnlyDropDown(row)}
          disabledListOption={["SO_001","SO_002","SO_003","SO_007","SO_008","SO_009","SO_010"]}
        />
      ),
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
      cell: (row, index) => (
        <InputComponent
          type={"text"}
          label=""
          labelXl="0"
          value={formatNumberWithThousandSeparator(row.PRICE_ADMIN)}
          name={"PRICE_ADMIN"}
          onChange={(e)=>onChangePrice(row, e.target.value, index)}
          marginBottom="0"
          disabled={!canEdit}
        />
      ),
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