import { useCallback, useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputImageComponent from "src/components/partial/inputImageComponent";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import { fnGetRoomDetails, fnStoreEditRoom } from "./roomFn";
import { History } from "src/utils/router";
import { toast } from "react-toastify";
import { useLocation, useSearchParams } from "react-router";
import { formatNumberWithThousandSeparator, removeThousandSeparator } from "src/utils/helpersFunction";

/**
 * The EditRoom component allows users to edit or view room details.
 * It fetches room data based on query parameters and populates the form fields.
 * Users can edit room attributes such as name, location, capacity, type, status, and image.
 * Form submission is validated, and changes are submitted to the server.
 * React hooks are used to manage form state and fetch data.
 */
export default function EditRoom() {
  let [searchParams] = useSearchParams()
  const location = useLocation()
  const { typeRoom } = useSelector((state) => state.room);

  const [canEdit, setCanEdit] = useState(false);
  const [dataFooter, setDataFooter] = useState([]);

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    location: "",
    capacity: "",
    valTypeRoom: "",
    image: null,
    status: true,
    imageUrl: "",
  });

  useEffect(()=>{
    if(typeRoom?.length > 0){
      handleChange("valTypeRoom", typeRoom[0].value)
    }
  },[typeRoom])

   const fetchData =useCallback(() => {
    if(searchParams.get("q") === null){
      History.navigate(objectRouterMasterPage.room.path)
    }else{
      fnGetRoomDetails(searchParams.get("q")).then(async (res) => {
        if(res){
          handleChange("id", res.ROOM_ID)
          handleChange("name", res.ROOM_NAME)
          handleChange("location", res.ROOM_LOCATION)
          handleChange("capacity", Number(res.CAPACITY))
          handleChange("valTypeRoom", res.ROOM_TYPE)
          handleChange("status", res.ROOM_STATUS)
          handleChange("image", res.ROOM_IMAGE)
          setDataFooter(res.LOGS)
        }
      })
    }
   },[searchParams])

  useEffect(()=>{
		if(location.pathname.includes("edit")){
			setCanEdit(true)
		}else{
			setCanEdit(false)
		}
    fetchData()
  },[location, fetchData])

  // Handle change for form inputs
  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle file input changes
  const handleFileChange = (fileData) => {
    if (fileData) {
      handleChange("image", fileData);
    } else {
      handleChange("image", null);
    }
  };

  // Validate the form before submitting
  const validateForm = () => {
    const { name, location, capacity, valTypeRoom } = formData;

    if (!name || !location || !valTypeRoom) {
      toast.error("Please fill out all required fields.");
      return false;
    }

    if (capacity <= 0) {
      toast.error("Capacity must be greater than zero.");
      return false;
    }

    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const bodyFormData = new FormData();
    bodyFormData.append("ROOM_NAME", formData.name);
    bodyFormData.append("ROOM_LOCATION", formData.location);
    bodyFormData.append("CAPACITY", formData.capacity);
    bodyFormData.append("ROOM_TYPE", formData.valTypeRoom);
    bodyFormData.append("ROOM_STATUS", formData.status);
    if (typeof formData.image !== "string" && formData.image) {
      bodyFormData.append("RoomImageFile", formData.image);
      bodyFormData.append("ROOM_IMAGE", formData.image.name);
    }

    // Submit room data
    fnStoreEditRoom(bodyFormData, formData.id)
  };

  return (
    <Container fluid id="edit-room-page">
      <Row>
        <Col sm={7}>
          <CardComponent
            title={canEdit? "Edit Room": "View Room"}
            type="create"
            needFooter
            dataFooter={dataFooter}
          >
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <InputComponent
                    type="text"
                    label="Name"
                    labelXl="3"
                    value={formData.name}
                    name="ROOM_NAME"
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    formGroupClassName="gx-3"
                    disabled={!canEdit}
                  />
                </Col>
                <Col xl={4}>
                  <InputComponent
                    type="text"
                    label=""
                    labelXl="0"
                    placeholder={`Room ID: ${formData.id}`}
                    value={""}
                    name="ROOM_ID"
                    disabled={true}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputComponent
                    type="text"
                    label="Location"
                    labelXl="2"
                    value={formData.location}
                    name="LOCATION"
                    onChange={(e) => handleChange("location", e.target.value)}
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
                    label="Capacity"
                    labelXl="4"
                    value={formatNumberWithThousandSeparator(formData.capacity)}
                    name="CAPACITY"
                    onChange={(e) => handleChange("capacity",Number(removeThousandSeparator(e.target.value)))}
                    formGroupClassName="gx-3"
                    min={1}
                    disabled={!canEdit}
                  />
                </Col>
                <Col xl={6}>
                  <InputDropdownComponent
                    listDropdown={typeRoom}
                    valueIndex
                    label="Type"
                    required
                    labelXl="3"
                    value={formData.valTypeRoom}
                    name="TYPE_ROOM"
                    onChange={(e) => handleChange("valTypeRoom", e.target.value)}
                    readOnly={!canEdit}
                    formGroupClassName="gx-2"
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <InputImageComponent
                    type="file"
                    label="Upload Picture"
                    labelXl="12"
                    value={formData.image}
                    name="ROOM_IMAGE"
                    onChange={handleFileChange}
                    formGroupClassName="gx-2"
                    showImagePreview
                    readOnly={!canEdit}
                    controlId="formImageEditRoom"
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
                    required
                    labelXl="4"
                    value={formData.status}
                    name="STATUS"
                    onChange={(e) => handleChange("status", e.target.value === "true")}
                    formGroupClassName="gx-3"
                    readOnly={!canEdit}
                  />
                </Col>
              </Row>
              {canEdit &&
                <div>
                  <Stack direction="horizontal" className="mt-3 justify-content-end" gap={3}>
                    <ButtonComponent
                      className="px-sm-5 fw-semibold"
                      variant="warning"
                      title="Submit"
                      type="submit"
                    />
                    <ButtonComponent
                      className="px-sm-5 fw-semibold"
                      variant="outline-danger"
                      onClick={() => History.navigate(objectRouterMasterPage.room.path)}
                      title="Cancel"
                    />
                  </Stack>
                </div>
              }

            </Form>
          </CardComponent>
        </Col>
      </Row>
    </Container>
  );
}