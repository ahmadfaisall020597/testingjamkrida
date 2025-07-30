/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { Badge, CloseButton, Col, FormControl, Image, InputGroup, Nav, Offcanvas, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
//import logo from "src/assets/image/logo.png";
import logos from "src/assets/image/logo-jamkrida-jkt-tittle.png";
import { History } from "src/utils/router";
import { setShowOffCanvasSideMenu } from "src/utils/store/globalSlice";
import { FaSearch, FaCaretUp, FaCaretDown } from "react-icons/fa";
import LoadingSpinner from "../partial/spinnerComponent";
import { store } from "src/utils/store/combineReducers";
import objectRouter from "../../utils/router/objectRouter";
import { setListMenu } from "../../utils/store/globalSlice";
import fullMenu from "../../utils/dummy/menu.json";
// scss sidebar inside style sidebar.scss


const checkActiveLink = (currentPath, item, isParent = false) => {
  if (!item.path) return false;
  if (isParent) {
    return item.path === currentPath;
  }
  const itemPathWithSlash = item.path.endsWith('/') ? item.path : `${item.path}/`;
  return currentPath === item.path || currentPath.startsWith(itemPathWithSlash);
};

const translationData = JSON.parse(localStorage.getItem('translation_data')) || {};
const translationId = (translationData.id || translationData.en) || {};

const normalizedTranslations = {};
Object.keys(translationId).forEach(key => {
  normalizedTranslations[key.toLowerCase()] = translationId[key];
});

const getTranslatedText = (key) => {
  const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
  return normalizedTranslations[normalizedKey]?.text1 || key;
};

const translatedMenu = fullMenu.map(menu => {
  if (menu.children) {
    menu.children = menu.children.map(child => ({
      ...child,
      name: getTranslatedText(child.name)
    }));
  } else {
    menu.name = getTranslatedText(menu.name);
  }
  return menu;
});

console.log("Translated Menu:", translatedMenu);

const renderNavItems = (items, collapsedItems, handleToggleCollapse, searchTerm = "", isParent = false, location) => {
  const currentPath = location.pathname;

  const filterItems = (items) => {
    return items.filter(item => {
      if (item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return true;
      }
      if (item.children) {
        return item.children.some(child => filterItems([child]).length > 0);
      }
      return false;
    });
  };

  const filteredItems = filterItems(items);

  const handleNav = (path) => {
    History.navigate(path)
    store.dispatch(setShowOffCanvasSideMenu(false))
  }

  return filteredItems.map((item, index) => (
    <React.Fragment key={index}>
      <Nav.Link
        className={`ps-3 link-dark py-1 ${item.children?.length > 0 ? '' : 'me-3'}`}
        active={checkActiveLink(currentPath, item, isParent)}
        onClick={() => item.children?.length > 0 ? handleToggleCollapse(item.path) : item.path && handleNav(item.path)}
      >
        <Stack direction="horizontal" gap={3}>
          <p className={`m-0 ${item.children?.length > 0 ? 'fw-bold' : ''}`}>{item.name}</p>
          {item.badge && <Badge bg="secondary" className="ms-auto">{item.badge}</Badge>}
          {item.children?.length > 0 && (
            collapsedItems.includes(item.path) ? <FaCaretUp className="ms-auto" /> : <FaCaretDown className="ms-auto" />
          )}
        </Stack>
      </Nav.Link>
      {item.children && !collapsedItems.includes(item.path) && (
        <Nav className={`flex-column ps-3`}>
          {renderNavItems(item.children, collapsedItems, handleToggleCollapse, searchTerm, false, location)}
        </Nav>
      )}
    </React.Fragment>
  ));
};

const globalSidebarRender = (data, searchTerm, setSearchTerm, collapsedItems, handleToggleCollapse, location, keycloak) => {

  return (
    <div className="d-flex flex-column align-items-center align-items-sm-start text-black h-100">
      <div className="d-flex flex-column w-100">
        <div className="d-flex align-items-center justify-content-center py-3 mb-md-0 me-md-auto text-decoration-none bg-secondary text-white w-100 px-sm-3 px-2 header-layout position-relative">
          <Image
            src={logos}
            style={{
              objectFit: "contain",
              objectPosition: "center"
            }}
            alt="logo-jamkrida-jkt-tittle"
            width={"150px"}
            height={"150px"}
            role="button"
            onClick={() => History.navigate(objectRouter.dashboard.path)}
          />
          <CloseButton className="d-block d-lg-none bg-light position-absolute" onClick={() => store.dispatch(setShowOffCanvasSideMenu(false))} />
        </div>
        <div>
          <InputGroup className="bg-dark text-white">
            <InputGroup.Text className="bg-dark text-white" id="search-icon">
              <FaSearch />
            </InputGroup.Text>
            <FormControl
              type="search"
              className="text-white"
              placeholder="Search menu..."
              aria-label="Search"
              aria-describedby="search-icon"
              onChange={e => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
          </InputGroup>
        </div>
      </div>
      <div className="py-sm-3 py-2 w-100 overflow-y-auto">
        {data.loading ? (
          <LoadingSpinner color="dark" />
        ) : (
          <Nav variant="pills" className="flex-column">
            {renderNavItems(data.listmenu, collapsedItems, handleToggleCollapse, searchTerm, true, location)}
          </Nav>
        )}
      </div>
    </div>
  );
};

const Sidebar = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { showOffCanvasSideMenu, listMenu, loadingMenu } = useSelector(state => state.global);
  const [searchTerm, setSearchTerm] = useState("");
  const [collapsedItems, setCollapsedItems] = useState([]);

  const handleToggleCollapse = (path) => {
    setCollapsedItems(collapsedItems.includes(path) ? collapsedItems.filter(item => item !== path) : [...collapsedItems, path]);
  };

  useEffect(() => {
    const loginDataRaw = localStorage.getItem("dataLogin");

    if (loginDataRaw) {
      try {
        const parsed = JSON.parse(loginDataRaw);
        const role = parsed?.data?.role?.toLowerCase() || parsed?.role?.toLowerCase(); // ✅ ambil dari .data
        const path = window.location.pathname;

        console.log("DEBUG | Role:", role);
        console.log("DEBUG | Pathname:", path);

        let selectedMenuGroup;

        if (path.includes("portal-admin") && (role === "admin" || role === "pusat")) {
          selectedMenuGroup = fullMenu.find(menu => menu.name === "Portal Admin");
        } else if (["mitra", "cabang", "pusat"].includes(role)) {
          selectedMenuGroup = fullMenu.find(menu => menu.name === "Mitra");
        }

        const finalMenu = selectedMenuGroup ? [selectedMenuGroup] : [];
        console.log("DEBUG | Menu dipilih:", finalMenu);
        dispatch(setListMenu(finalMenu));
      } catch (error) {
        console.error("Gagal parsing login data:", error);
      }
    }
  }, []);



  useEffect(() => {
    const loginData = localStorage.getItem("dataLogin");
    if (!loginData) {
      History.navigate(objectRouter.loginPage.path);
    }
  }, []);
  useEffect(() => {
    console.log("listMenu setelah filter:", listMenu);
  }, [listMenu]);

  return (
    <>
      <Col id="sidebar" className="d-none d-lg-block col-auto col-md-3 col-xl-2 p-0 vh-100 overflow-hidden shadow z-index-3">
        {globalSidebarRender(
          {
            listmenu: listMenu,
            property: props,
            loading: loadingMenu
          },
          searchTerm,
          setSearchTerm,
          collapsedItems,
          handleToggleCollapse,
          location,
          null
        )}
      </Col>
      <Offcanvas id="sidebar" show={showOffCanvasSideMenu} onHide={() => dispatch(setShowOffCanvasSideMenu(false))}>
        <Offcanvas.Body className="p-0">
          {globalSidebarRender(
            {
              listmenu: listMenu,
              property: props,
              loading: loadingMenu
            },
            searchTerm,
            setSearchTerm,
            collapsedItems,
            handleToggleCollapse,
            location,
            null
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
