import { Card, Stack } from "react-bootstrap"

const CardStatus = ({name, count, color}) => {
  return(
    <Card className="border-dark m-0 rounded-4 fs-5 flex-fill">
      <Card.Body className="px-3 py-2">
        <Stack direction="horizontal" className="justify-content-center" gap={3}>
          <p className="m-0">
            {name}
          </p>
          <div className="p-1 fw-bold rounded-1 text-center" style={{backgroundColor:color, minWidth:"35px"}}>
            {count}
          </div>
        </Stack>
      </Card.Body>
    </Card>
  )
}

export default CardStatus