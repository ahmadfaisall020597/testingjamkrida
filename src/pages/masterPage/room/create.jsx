import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputImageComponent from "src/components/partial/inputImageComponent";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import { fnStoreRoom } from "./roomFn";
import { History } from "src/utils/router";
import { toast } from "react-toastify";
import { formatNumberWithThousandSeparator, removeThousandSeparator } from "src/utils/helpersFunction";

/**
 * The CreateRoom component allows users to create a new room with specific attributes.
 * It initializes form data state and populates room type options from the redux store.
 * Users can input room details such as name, location, capacity, type, status, and upload an image.
 * The component validates form inputs before submission and handles form data submission to the server.
 * React hooks are utilized for managing form state and fetching room type data.
 */
export default function CreateRoom() {
  const { typeRoom } = useSelector((state) => state.room);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    capacity: 0,
    valTypeRoom: "",
    image: null,
    status: true,
  });

  useEffect(()=>{
    if(typeRoom?.length > 0){
      handleChange("valTypeRoom", typeRoom[0].value)
    }
  },[typeRoom])

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
    if (formData.image) {
      bodyFormData.append("RoomImageFile", formData.image);
      bodyFormData.append("ROOM_IMAGE", formData.image.name);
    }

    // Submit room data
    fnStoreRoom(bodyFormData)
  };

  return (
    <Container fluid id="create-room-page">
      <Row>
        <Col sm={7}>
          <CardComponent
            title="Add New Room"
            type="create"
            needFooter
          >
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col>
                  <InputComponent
                    type="text"
                    label="Name"
                    labelXl="2"
                    value={formData.name}
                    name="ROOM_NAME"
                    onChange={(e) => handleChange("name", e.target.value)}
                    required
                    formGroupClassName="gx-2"
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
                  />
                </Col>
              </Row>
              <Row>
                <Col xl={6}>
                  <InputComponent
                    type="text"
                    label="Capacity"
                    labelXl="4"
                    value={formatNumberWithThousandSeparator(formData.capacity)}
                    name="CAPACITY"
                    onChange={(e) => handleChange("capacity", Number(removeThousandSeparator(e.target.value)))}
                    formGroupClassName="gx-3"
                    min={1}
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
                    formGroupClassName="gx-1"
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
                    controlId="formImageCreateRoom"
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
                  />
                </Col>
              </Row>
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
            </Form>
          </CardComponent>
        </Col>
      </Row>
    </Container>
  );
}
