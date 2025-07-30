import moment from "moment";
import { Card, Col, Row, Stack } from "react-bootstrap";

const CardFooterComponent = ({ data, needFooter }) => {
  if (!needFooter) return null;
  if(data?.length == 0) return null
  return (
    <Card.Footer className="border-0 m-0 px-1">
      {data?.length > 0 ? (
        <div className="footer-history-update overflow-y-auto px-3">
          {data.map((item, index) => (
            <Stack key={index} className="fs-7 py-2">
              <p className="m-0 fw-bold">{item.USER_BY_NAME}, {moment(moment.utc(item.LAST_UPDATED_DATE).local()).format('DD MMMM YYYY, HH:mm')}</p>
              <p className="m-0 fw-light">{item.DESCRIPTION}</p>
            </Stack>
          ))}
        </div>
      ) : null}
    </Card.Footer>
  );
};

const CardComponent = ({ children, type = "index", title, sideComponent, addonClassName, dataFooter, needFooter, addonBodyClassName, children2 }) => {
  const renderIndexCard = () => (
    <Card className={`shadow border-0 rounded-4 ${addonClassName}`}>
      <Card.Body className={`${addonBodyClassName} px-4 pt-4 pb-2 overflow-y-auto`}>
        <Row className="g-3 align-items-center">
          <Col sm={6}>
            <Card.Title className="m-0 fw-bold">{title}</Card.Title>
          </Col>
          <Col sm={6} className="text-sm-end">
            {sideComponent}
          </Col>
        </Row>
        {children}
      </Card.Body>
      {children2}
      <CardFooterComponent data={dataFooter} needFooter={needFooter} />
    </Card>
  );

  const renderCreateCard = () => (
    <div>
      <Stack direction="horizontal">
        <div className="d-none d-md-block bg-warning py-4 px-1 fs-3 fw-bold align-self-start" style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          marginTop: '4rem'
        }}>
          {title}
        </div>
        <Stack className="w-75">
          <div className="bg-warning py-1 px-4 ms-4 fs-3 fw-bold align-self-start d-block d-md-none">
            {title}
          </div>
          <Card className={`shadow border-0 rounded-4 ${addonClassName} ${type}`}>
            <Card.Body className={`${addonBodyClassName} px-4 pt-4 overflow-y-auto`}>
              <Row>
                <Col className="text-end">
                  {sideComponent}
                </Col>
              </Row>
              {children}
            </Card.Body>
            {children2}
            <CardFooterComponent data={dataFooter} needFooter={needFooter} />
          </Card>
        </Stack>
      </Stack>
    </div>
  );

  return type === "index" ? renderIndexCard() : renderCreateCard();
};

export default CardComponent;
