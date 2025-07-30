import { Container, Stack } from "react-bootstrap";

const Footer = () =>{
  return(
    <div className="mt-auto p-sm-3 p-2">
      <Container fluid id="footer">
        <Stack className="align-items-center">
          AMMAN FUNCTION REQUEST ©{new Date().getFullYear()}
        </Stack>
      </Container>
    </div>
  )
}

export default Footer;