import { Col, Row, Stack } from "react-bootstrap"

const HeaderOrder = ({data}) =>{
  return (
    <>
      <div className="px-3 py-2 header-title fw-bold fs-5 mb-4">
        Admin - New Request Status / Detail
      </div>
      <Stack gap={2}>
        {
          [
            { label1: "Request Number", value1: data.ORDER_ID},
            { label1: "Request By", value1: data.REQUEST_BY_NAME, label2: "Request By ID", value2: data.REQUEST_BY_HEADER},
            { label1: "Department", value1: data.DEPARTMENT, label2: "Company", value2: data.COMPANY},
            { label1: "Request Type", value1: data.REQUEST_TYPE_DESC, label2: "Cost Center", value2: data.COST_CENTER_ID},
            { label1: "Phone Number", value1: data.PHONE_NUMBER, label2: "Total Attendees", value2: data.TOTAL_ATTENDANCE},
            { label1: "Event Name", value1: data.EVENT_NAME},
            { label1: "Description", value1: data.DESCRIPTION}
          ].map((v, idx)=>
            <Row key={idx}>
              <Col xl={6}>
                <p className="m-0 fw-bold">{v.label1}</p>
                <p className="m-0 text-value">{v.value1}</p>
              </Col>
              <Col xl={6}>
                <p className="m-0 fw-bold">{v.label2}</p>
                <p className="m-0 text-value">{v.value2}</p>
              </Col>
            </Row>
          )
        }
      </Stack>
    </>
  )
}

export default HeaderOrder