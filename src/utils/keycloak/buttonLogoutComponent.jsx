/* eslint-disable no-unused-vars */
import { Dropdown, Image, NavItem, NavLink, Stack, Badge } from "react-bootstrap";
import { useNavigate } from "react-router";
import { IoMdNotificationsOutline } from "react-icons/io";
import imageProfile from "src/assets/image/blank_profile_picture.png";
import logoutImage from "src/assets/image/Logout.png";
import AuthHelpers from "../api/apiV2";
import { useEffect, useState } from "react";
import { setNotifCount } from "../store/globalSlice";
import { useDispatch, useSelector } from "react-redux";

import { getCountNotif } from "../api/apiNotif";

const ButtonKeycloakLogout = ({
  keycloak,
  from,
  profile
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dataLoginRaw = localStorage.getItem("dataLogin");
  let dataLogin = {};

  try {
    dataLogin = dataLoginRaw ? JSON.parse(dataLoginRaw) : {};
  } catch (err) {
    console.error("Invalid dataLogin in localStorage", err);
    dataLogin = {};
  }

  const { role } = dataLogin || {};
  const fullName = dataLogin?.data?.name || profile?.fullName || "Guest";

  //const fullName = profile?.fullName || ""
  // const imageUrl = profile?.profilePictureLink || ""
  const imageUrl = null
  //const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
  //const { role } = dataLogin;  

  const countNotif = useSelector(state => state.global.count)

  const fetchCountNotif = async () => {
    try {
      const userID = dataLogin.data.user_id;
      const response = await getCountNotif(
        { id: userID }
      );

      const tempCount = response?.data?.data?.count;
      dispatch(setNotifCount(tempCount));

    } catch (err) {
      console.error("Error fetching count notif data:", err);
    }

  };



  useEffect(() => {
    fetchCountNotif()
  }, []);



  // const handleLogout = () => {
  //   localStorage.removeItem("dataLogin");
  //   // window.location.reload(); 
  //   navigate('/login')
  // }

  const handleLogout = () => {
    const dataLoginRaw = localStorage.getItem("dataLogin");
    let role = null;

    if (dataLoginRaw) {
      try {
        const dataLogin = JSON.parse(dataLoginRaw);
        role = dataLogin?.data?.role || null;
      } catch {
        role = null;
      }
    }

    // Clear local storage
    // localStorage.removeItem("dataLogin");
    localStorage.clear();

    // Navigate based on role
    if (role === "admin") {
      navigate("/login");
    } else if (role === "pusat" || role === "cabang" || role === "mitra") {
      navigate("/login-mitra");
    } else {
      // fallback, if role unknown or null
      navigate("/login");
    }
  };


  const handleNotif = () => {
    navigate('/mitra/notification')
  }

  return (
    <div>
      <div className="d-none d-lg-block">
        <Dropdown as={NavItem} align={"end"}>
          <Dropdown.Toggle as={NavLink} className="d-flex align-items-center fs-4">
            <Stack className={`align-items-end justify-content-between py-1 me-3`}>
              <p className="m-0 lh-1 fw-light fs-6">welcome,</p>
              <p className="m-0 lh-1 fw-bold text-capitalize fs-6">{fullName}</p>
            </Stack>
            <div className="position-relative d-inline-block">
              <Image className="me-2" roundedCircle src={imageUrl || imageProfile} width={38} height={38} />
              {role?.toLowerCase() !== 'admin' && countNotif > 0 && (
                <Badge
                  bg="danger"
                  pill
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{
                    fontSize: "10px",
                    padding: "4px 6px",
                    minWidth: "18px",
                    height: "18px",
                    lineHeight: "10px"
                  }}
                >
                  {countNotif}
                </Badge>
              )}

            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-2 w-100 p-1 rounded-3">
            {role?.toLowerCase() !== 'admin' && (
              <Dropdown.Item onClick={handleNotif}>
                <Stack direction="horizontal" className="justify-content-between">
                  <div>Notification</div>
                  <div className="position-relative d-inline-block">
                    <IoMdNotificationsOutline size={30} />
                    {countNotif > 0 && (
                      <Badge
                        bg="danger"
                        pill
                        className="position-absolute top-0 start-100 translate-middle"
                        style={{
                          fontSize: "8px",
                          padding: "2px 4px",
                          minWidth: "14px",
                          height: "14px",
                          lineHeight: "10px"
                        }}
                      >
                        {countNotif}
                      </Badge>
                    )}
                  </div>
                </Stack>
              </Dropdown.Item>

            )}

            <Dropdown.Item onClick={handleLogout}>
              <Stack direction="horizontal" className="justify-content-between">
                <div>Logout</div>
                <Image src={logoutImage} />
              </Stack>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="d-block d-lg-none">
        <Dropdown as={NavItem} align={"end"}>
          <Dropdown.Toggle as={NavLink} className="d-flex align-items-center fs-4">
            <Image className="me-2" roundedCircle src={imageUrl || imageProfile} width={38} height={38} />
          </Dropdown.Toggle>
          <Dropdown.Menu className="mt-2 w-100 rounded-3">
            <Dropdown.ItemText>
              <p className="m-0 lh-1 fw-bold text-capitalize fs-6">{fullName}</p>
            </Dropdown.ItemText>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => { console.log('klik logout') }}>
              <Stack direction="horizontal" className="justify-content-between">
                <div>Logout</div>
                <Image src={logoutImage} />
              </Stack>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  )
}

export default ButtonKeycloakLogout;