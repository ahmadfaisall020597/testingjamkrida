import { useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import "./style.scss";
import ButtonComponent from "src/components/partial/buttonComponent";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import TableComponent from "src/components/partial/tableComponent";
import { fnStoreLookupValue, validateCodeIds } from "./lookupValueSetupFn";
import { toast } from "react-toastify";


const CreateLookupValue = ()=>{

  const [valueId, setValueId] = useState();
  const [valueName, setValueName] = useState("");
  const [status, setStatus] = useState(true);
  const [listData, setListData] = useState([{
    step: 1,
    CODE_ID:"",
    SHORT_DESC: "",
    DESC:""
  }]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }else{
      const body = {
        LOOKUP_ID: valueId,
        LOOKUP_NAME: valueName,
        STATUS: status,
        DETAILS:listData.filter(value=> value.done)
      }
      fnStoreLookupValue(body)
    }
  };

  const columnsConfig = [
    {
      name: "Step",
      cell: (row, index) =>(
        <div>{Number(index) + 1}</div>
      ),
      sortable: false,
      width: "80px"
    },
    {
      name: "Code",
      cell: (row, index) =>(
        <InputComponent
          type={"text"}
          label=""
          labelXl="0"
          value={row.CODE_ID}
          name={"CODE_ID"}
          onChange={(e)=>handleCellChange(e, index)}
          marginBottom="0"
        />
      ),
      sortable: false,
      width: "150px"
    },
		{
      name: "Short Description",
      cell: (row, index) =>(
        <InputComponent
          type={"text"}
          label=""
          labelXl="0"
          value={row.SHORT_DESC}
          name={"SHORT_DESC"}
          onChange={(e)=>handleCellChange(e, index)}
          marginBottom="0"
        />
      ),
      sortable: false,
      width: "200px"
    },
    {
      name: "Description",
      cell: (row, index) =>(
        <InputComponent
          type={"textarea"}
          label=""
          labelXl="0"
          ColXl={12}
          value={row.DESC}
          name={"DESC"}
          formGroupClassName={"w-100 m-0"}
          onChange={(e)=>handleCellChange(e, index)}
          marginBottom="0"
          rows="1"
        />
      ),
      sortable: false,
    },
    {
      name: "Actions",
      cell: (row, index) => (
        <Stack direction="horizontal">
          {
            listData.length == Number(index) + 1 && (
              <Button variant="link" onClick={() => handleAdd(index)} className="me-2">
                Add
              </Button>
            )
          }
          {
            listData.length !== Number(index) + 1 && (
              <Button variant="link" className="text-danger" onClick={() => handleDelete(index)}>
                Delete
              </Button>
            )
          }
          
        </Stack>
      ),
      width: "120px",
    },
  ];

  const handleAdd = (index)=>{
    setListData((prevData) => {
      const validation = validateCodeIds(prevData);
      if (!validation.isValid) {
        toast.error(validation.message);
        return prevData; // Jangan tambah baris baru
      }

      return [
        ...prevData.map((row) => ({ ...row, done: true })),
        {
          step: prevData.length + 1,
          CODE_ID: "",
          SHORT_DESC: "",
          DESC: "",
          done: false,
        },
      ];
    });
  }

  const handleDelete = (index) => {
    setListData((prevData) => {
      const updatedList = prevData.filter((_, i) => i !== index);
      
      // Perbarui ulang step agar tetap berurutan
      return updatedList.map((item, newIndex) => ({
          ...item,
          step: newIndex + 1
      }));
    });  };

  const handleCellChange = (e, index) => {
    const { name, value } = e.target;
    setListData((prevData) =>
      prevData.map((row, idx) =>
        idx === index ? { ...row, [name]: value } : row
      )
    );
  };

  return (
		<Container fluid id="create-lookup-value-page">
      <CardComponent
        title={"Add Lookup Value"}
        sideComponent={<></>}
        type="create"
      >
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6}>
              <InputComponent
                type={"text"}
                label="Value ID"
                required
                labelXl="3"
                value={valueId}
                name={"LOOKUP_ID"}
                onChange={(e)=>setValueId(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <InputComponent
                type={"text"}
                label="Value Name"
                required
                labelXl="3"
                name={"LOOKUP_NAME"}
                value={valueName}
                onChange={(e)=>setValueName(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <InputDropdownComponent
                listDropdown={[
                  {value:true, label:"Active"},
                  {value:false, label:"Inactive"},
                ]}
                valueIndex
                label="Status"
                required
                labelXl="3"
                ColXl={4}
                value={status}
                name={"status"}
                onChange={(e)=>setStatus(e.target.value)}
                readOnly={true}
              />
            </Col>
          </Row>
          <div className="my-2 px-3 py-2 header-title fw-bold fs-5">
            Detail
          </div>
          <TableComponent 
            key={`detail-lookup-create-${listData.length}`}
            columns={columnsConfig}
            data={listData}
            paginationComponentOptions={{noRowsPerPage: true}}
            persistTableHead
            responsive
            striped
            needExport={false}
            pagination={false}
          />
          <div>
						<Stack direction="horizontal" className="mt-3 justify-content-end" gap={3}>
							<ButtonComponent
								className={"px-sm-5 fw-semibold"}
								variant="warning"
								title={"Submit"}
                type="submit"
							/>
							<ButtonComponent
								className={"px-sm-5 fw-semibold"}
								variant="outline-danger"
								onClick={() => History.navigate(objectRouterMasterPage.lookupValue.path)}
								title={"Cancel"}
							/>
						</Stack>
					</div>
        </Form>
      </CardComponent>
    </Container>
  )
}

export default CreateLookupValue;