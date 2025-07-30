import { useCallback, useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputImageComponent from "src/components/partial/inputImageComponent";
import InputSwitchComponent from "src/components/partial/inputSwitchComponent";
import { fnGetTenantDetails, fnStoreEditTenant, ModalParent } from "./TenantFn";
import { useDispatch, useSelector } from "react-redux";
import { setListRegisteredCourier, setListRegisteredUser, setShowModal } from "./TenantSlice";
import { typeModalMasterTenant } from "src/utils/variableGlobal/var";
import "./style.scss"
import { useLocation, useSearchParams } from "react-router";

const EditTenant = () => {
  const dispatch = useDispatch()
  let [searchParams] = useSearchParams()
  const location = useLocation()
  const { listRegisteredUser, listRegisteredCourier } = useSelector(state => state.tenant)
  const [canEdit, setCanEdit] = useState(false);
  const [dataFooter, setDataFooter] = useState([]);
  const [formData, setFormData] = useState({
    TENANT_ID: "",
    TENANT_NAME: "",
    COMPANY_NAME: "",
    ADDRESS: "",
    CONTACT_PERSON: "",
    CONTACT_NUMBER: "",
    EMAIL_ADDRESS: "",
    ADD_PACKAGE: null,
    TENANT_IMAGE: null,
    STATUS: true,
  });

  const [dataModal, setDataModal] = useState({
    title: "",
    type: "",
    id: ""
  });

  const fetchData = useCallback(() => {
    if (searchParams.get("q") === null) {
      History.navigate(objectRouterMasterPage.tenant.path)
    } else {
      fnGetTenantDetails(searchParams.get("q")).then(async (res) => {
        if (res) {
          handleChange("TENANT_ID", res.TENANT_ID)
          handleChange("TENANT_NAME", res.TENANT_NAME)
          handleChange("COMPANY_NAME", res.COMPANY_NAME)
          handleChange("ADDRESS", res.ADDRESS)
          handleChange("CONTACT_PERSON", res.CONTACT_NAME)
          handleChange("CONTACT_NUMBER", res.CONTACT_PHONE)
          handleChange("EMAIL_ADDRESS", res.EMAIL_ADDRESS)
          handleChange("ADD_PACKAGE", res.ADD_PACKAGE)
          handleChange("TENANT_IMAGE", res.TENANT_IMAGE)
          handleChange("STATUS", res.STATUS)
          setDataFooter(res.LOGS)
          if(res.USERS?.length > 0) {
            dispatch(setListRegisteredUser(res.USERS))
          }else{
            dispatch(setListRegisteredUser([]))
          }
          if(res.COURIER?.length > 0) {
            dispatch(setListRegisteredCourier(res.COURIER))
          }else{
            dispatch(setListRegisteredCourier([]))
          }
        }
      })
    }
  }, [searchParams, dispatch])

  useEffect(() => {
    if (location.pathname.includes("edit")) {
      setCanEdit(true)
    } else {
      setCanEdit(false)
    }
    fetchData()
  }, [location, fetchData])

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleFileChange = (fileData) => {
    handleChange("TENANT_IMAGE", fileData || null);
  };

  // Validasi form sebelum submit
  const validateForm = () => {
    const { TENANT_NAME, COMPANY_NAME, ADDRESS, CONTACT_PERSON, CONTACT_NUMBER } = formData;

    if (!TENANT_NAME || !COMPANY_NAME || !ADDRESS || !CONTACT_PERSON || !CONTACT_NUMBER) {
      toast.error("Please fill out all required fields.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const bodyFormData = new FormData();

    bodyFormData.append("TENANT_ID", formData.TENANT_ID);
    bodyFormData.append("TENANT_NAME", formData.TENANT_NAME);
    bodyFormData.append("COMPANY_NAME", formData.COMPANY_NAME);
    bodyFormData.append("ADDRESS", formData.ADDRESS);
    bodyFormData.append("CONTACT_NAME", formData.CONTACT_PERSON);
    bodyFormData.append("CONTACT_PHONE", formData.CONTACT_NUMBER);
    bodyFormData.append("EMAIL_ADDRESS", formData.EMAIL_ADDRESS);
    bodyFormData.append("ADD_PACKAGE", formData.ADD_PACKAGE);
    bodyFormData.append("STATUS", Boolean(formData.STATUS));

    if (formData.TENANT_IMAGE) {
      bodyFormData.append("TenantImageFile", formData.TENANT_IMAGE);
      bodyFormData.append("TENANT_IMAGE", formData.TENANT_IMAGE.name);
    }

    if (listRegisteredUser?.length > 0) {
      bodyFormData.append("USERS_JSON", JSON.stringify(listRegisteredUser));
    }

    if(listRegisteredCourier?.length > 0){
      bodyFormData.append("COURIER_JSON", JSON.stringify(listRegisteredCourier));
    }

    // TODO: Implement submit request using bodyFormData
    fnStoreEditTenant(bodyFormData, formData.TENANT_ID)
  };

  const handleShowModals = (index) => {
    setDataModal({
      title: typeModalMasterTenant[index].title,
      id: formData.TENANT_ID,
      type: typeModalMasterTenant[index].type
    })
    dispatch(setShowModal(true))
  }

  return (
    <Container fluid id="edit-tenant-page">
      <Row>
        <Col>
          <CardComponent 
            title={canEdit ? "Edit Tenant" : "View Tenant"} 
            type="create" 
            needFooter
            dataFooter={dataFooter}
          >
            {/* Navigation buttons */}
            <Stack className="flex-wrap mb-5 mt-2" direction="horizontal" gap={4}>
              <ButtonComponent className="px-sm-5 pt-2 pb-2 fw-semibold" variant="warning" title="View Menu List" onClick={() => handleShowModals(0)} />
              <ButtonComponent className="px-sm-5 pt-2 pb-2 fw-semibold" variant="warning" title="View Package List" onClick={() => handleShowModals(1)} />
              <ButtonComponent className="px-sm-5 pt-2 pb-2 fw-semibold" variant="warning" title="Register User" onClick={() => handleShowModals(2)} />
              <ButtonComponent className="px-sm-5 pt-2 pb-2 fw-semibold" variant="warning" title="Register Courier" onClick={()=>handleShowModals(3)} />
            </Stack>
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Left Column */}
                <Col xl={6} className="pe-xl-4 create-col border-end border-3">
                  <Row>
                    <Col>
                      <InputComponent
                        type="text"
                        label="Tenant Name"
                        labelXl="4"
                        value={formData.TENANT_NAME}
                        name="TENANT_NAME"
                        onChange={(e) => handleChange("TENANT_NAME", e.target.value)}
                        required
                        formGroupClassName="gx-2"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <InputComponent
                        type="text"
                        label="Company Name"
                        labelXl="4"
                        value={formData.COMPANY_NAME}
                        name="COMPANY_NAME"
                        onChange={(e) => handleChange("COMPANY_NAME", e.target.value)}
                        required
                        formGroupClassName="gx-2"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        type="text"
                        label="Address/Location"
                        labelXl="4"
                        value={formData.ADDRESS}
                        name="ADDRESS"
                        onChange={(e) => handleChange("ADDRESS", e.target.value)}
                        required
                        formGroupClassName="gx-2"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        type="text"
                        label="Contact Person"
                        labelXl="4"
                        value={formData.CONTACT_PERSON}
                        name="CONTACT_PERSON"
                        onChange={(e) => handleChange("CONTACT_PERSON", e.target.value)}
                        required
                        formGroupClassName="gx-2"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        type="text"
                        label="Contact Number"
                        labelXl="4"
                        value={formData.CONTACT_NUMBER}
                        name="CONTACT_NUMBER"
                        onChange={(e) => handleChange("CONTACT_NUMBER", e.target.value)}
                        required
                        formGroupClassName="gx-2"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputComponent
                        type="text"
                        label="Email Address"
                        labelXl="4"
                        value={formData.EMAIL_ADDRESS}
                        name="EMAIL_ADDRESS"
                        onChange={(e) => handleChange("EMAIL_ADDRESS", e.target.value)}
                        formGroupClassName="gx-2"
                        disabled={!canEdit}
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col>
                      <InputSwitchComponent
                        label={"Available Add Package"}
                        value={formData.ADD_PACKAGE}
                        formGroupClassName="gx-2"
                        reverse
                        readOnly={!canEdit}
                        onClick={(e)=> handleChange("ADD_PACKAGE", e)}
                      />
                    </Col>
                  </Row>
                </Col>

                {/* Right Column */}
                <Col className="ps-xl-4">
                  <Row>
                    <Col>
                      <InputImageComponent
                        type="file"
                        label="Upload Picture"
                        labelXl="12"
                        value={formData.TENANT_IMAGE}
                        name="TENANT_IMAGE"
                        onChange={handleFileChange}
                        formGroupClassName="gx-2"
                        showImagePreview
                        readOnly={!canEdit}
                        controlId="formImageEditTenant"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col xl={6}>
                      <InputDropdownComponent
                        listDropdown={[
                          { value: true, label: "Active" },
                          { value: false, label: "Inactive" },
                        ]}
                        valueIndex
                        label="Status"
                        labelXl="4"
                        value={formData.STATUS}
                        name="STATUS"
                        onChange={(e) => handleChange("STATUS", e.target.value === "true")}
                        formGroupClassName="gx-3"
                        readOnly={!canEdit}
                      />
                    </Col>
                  </Row>

                  {/* Submit & Cancel Buttons */}
                  {
                    canEdit && (
                      <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
                        <ButtonComponent className="px-sm-5 fw-semibold" variant="warning" title="Submit" type="submit" />
                        <ButtonComponent
                          className="px-sm-5 fw-semibold"
                          variant="outline-danger"
                          onClick={() => History.navigate(objectRouterMasterPage.tenant.path)}
                          title="Cancel"
                        />
                      </Stack>
                    )
                  }
                </Col>
              </Row>
            </Form>
          </CardComponent>
        </Col>
      </Row>
      <ModalParent data={dataModal} canEdit={canEdit} />
    </Container>
  );
};

export default EditTenant;
