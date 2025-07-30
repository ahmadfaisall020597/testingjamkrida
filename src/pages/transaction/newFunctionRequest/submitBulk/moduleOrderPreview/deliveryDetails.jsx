import { Col, Row } from "react-bootstrap"
import { objectRoomSelection } from "../../newFunctionRequestFn"
import moment from "moment"

const DeliveryDetails = ({roomSelectionData}) =>{
  return(
    <div className="py-3">
      <Row className="mb-2">
        <Col sm={4}>
          Function Delivery Location
        </Col>
        <Col sm={8} className="fw-normal">
          : {roomSelectionData?.[objectRoomSelection[13]]?.ROOM_LOCATION}
        </Col>
      </Row>

      <Row className="mb-2">
        <Col sm={4}>
          Delivery to
        </Col>
        <Col sm={8} className="fw-normal">
          : {roomSelectionData[objectRoomSelection[9]]}
        </Col>
      </Row>

      <Row className="mb-2">
        <Col sm={4}>
          Delivery Date
        </Col>
        <Col sm={8} className="fw-normal">
          : {moment(roomSelectionData[objectRoomSelection[8]]).format("DD MMM YYYY")}
        </Col>
      </Row>
      <Row className="mb-2">
        <Col sm={4}>
          Delivery Time
        </Col>
        <Col sm={8} className="fw-normal">
          : {moment(roomSelectionData[objectRoomSelection[8]]).format("HH:mm")}
        </Col>
      </Row>
    </div>
  )
}

export default DeliveryDetails;