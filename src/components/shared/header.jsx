import { Container, Stack } from "react-bootstrap";
import { BsList } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
// import { onMessageListener, requestPermission } from "src/utils/firebaseNotification/notificationHandler";
import ButtonKeycloakLogout from "src/utils/keycloak/buttonLogoutComponent";
import { setShowOffCanvasSideMenu } from "src/utils/store/globalSlice";

const Header = props =>{
  const dispatch = useDispatch();
  const {profileUsers} = useSelector(state=>state.global)

  return (
    <div className="d-flex align-items-center py-3 mb-md-0 me-md-auto text-black w-100 px-sm-3 px-2 header-layout header-background">
      <Container fluid id="header">
        <Stack direction="horizontal" className="h-100 align-items-center" gap={3}>
          <div className="d-block d-lg-none" onClick={()=> dispatch(setShowOffCanvasSideMenu(true))}>
            <BsList size={35} className="m-0 p-0"/>
          </div>
          <div className="">
            <p className="fs-4 m-0 text-capitalize fw-bold text-truncate title">{props.title?.toLowerCase()}</p>
          </div>
          <div className="ms-auto me-sm-2">
            {/* <div className="position-relative notification-icon" onClick={handleShow} role="button">
              <MdNotifications size={35}/>
              {
                notification?.length > 0 && (
                  <span className="position-absolute p-2 bg-danger border border-light rounded-circle">
                    <span className="visually-hidden">New alerts</span>
                  </span>
                )
              }
            </div> */}
          </div>
          <ButtonKeycloakLogout keycloak={null} profile={profileUsers} from="header"/>
        </Stack>
      </Container>
    </div>
  )
}

export default Header;