import { Col, Row } from "react-bootstrap";
import { objectRoomSelection } from "src/pages/transaction/newFunctionRequest/newFunctionRequestFn";

const OrderDetails = ({roomSelectionData}) => {
  // Pengecekan apakah objectRoomSelection[13] ada dan apakah roomSelectionData memiliki nilai untuk index tersebut
  const selectedRoom = roomSelectionData?.[objectRoomSelection[13]] || {}; 
  const { ROOM_NAME, CAPACITY } = selectedRoom;
  
  return (
    <>
      <div className="my-1 px-3 py-2 header-title fw-bold fs-5">Order Preview</div>
      <div className="py-3 border-bottom border-2">
        <Row className="mb-2">
          <Col sm={4}>{ROOM_NAME || "-"}</Col>
          <Col sm={8}>Capacity : {CAPACITY || 0}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4}>Event Name</Col>
          <Col sm={8} className="fw-normal">: {roomSelectionData?.[objectRoomSelection[5]]}</Col>
        </Row>
        <Row className="mb-2">
          <Col sm={4}>Purpose Request</Col>
          <Col sm={8} className="fw-normal">: {roomSelectionData?.[objectRoomSelection[6]]}</Col>
        </Row>
        <Row>
          <Col sm={4}>Phone Number</Col>
          <Col sm={8} className="fw-normal">: {roomSelectionData?.[objectRoomSelection[14]]}</Col>
        </Row>
      </div>
    </>
  );
};

export default OrderDetails;
