/* eslint-disable no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row, Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import "./style.scss";
import ButtonComponent from "src/components/partial/buttonComponent";
import { History } from "src/utils/router";
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage";
import { setShowLoadingScreen } from "src/utils/store/globalSlice";
import TableComponent from "src/components/partial/tableComponent";
import { v4 as uuidv4 } from 'uuid';
import { editLookupValue, getLookupValueDetails, storeLookupValue } from "src/utils/api/apiMasterPage";
import { fnStoreEditLookupValue, validateCodeIds } from "./lookupValueSetupFn";
import { toast } from "react-toastify";


const EditLookupValue = ()=>{
  let [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate();
	const dispatch = useDispatch();

  const [canEdit, setCanEdit] = useState(false);

  const [valueId, setValueId] = useState("");
  const [valueName, setValueName] = useState("");
  const [status, setStatus] = useState(true);
  const [dataFooter, setDataFooter] = useState([]);
  const [listData, setListData] = useState([{
    step: 1,
    CODE_ID:"",
    SHORT_DESC: "",
    DESC:""
  }]);

  
  console.log(listData)

  const columnsConfigView = [
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
      selector: row => row.CODE_ID,
      sortable: false,
      width: "150px"
    },
		{
      name: "Short Description",
      selector: row => row.SHORT_DESC,
      sortable: false,
      width: "200px"
    },
    {
      name: "Description",
      selector: row => row.DESC,
      sortable: false,
    },
  ];

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
        <>
          {row.fromDB?
            <div>{row.CODE_ID}</div>
          :
            <InputComponent
              type={"text"}
              label=""
              labelXl="0"
              value={row.CODE_ID}
              name={"CODE_ID"}
              onChange={(e)=>handleCellChange(e, index)}
              marginBottom="0"
            />
          }
        </>
        
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

  const fetchData =useCallback((canEdit) => {
		dispatch(setShowLoadingScreen(true))
    setCanEdit(canEdit)
    if(searchParams.get("q") === null){
      History.navigate(objectRouterMasterPage.lookupValue.path)
    }else{
      getLookupValueDetails({}, searchParams.get("q")).then(res=>{
        const data = res.data.data
        setValueId(data.LOOKUP_ID)
        setValueName(data.LOOKUP_NAME)
        setStatus(data.STATUS)
        setDataFooter(data.LOGS)
        const detailData = data.DETAILS.map((v, index)=>{
          const { ID, ...rest } = v;
          return {...rest,
            step: index + 1,
            fromDB: true,
            done:true
          }
        })
        const joinedData = [...detailData,{
          LOOKUP_ID: data.LOOKUP_ID,
          step: detailData.length + 1,
          CODE_ID: "",
          SHORT_DESC: "",
          DESC: "",
          done: false,
          fromDB: false
        }]
        setListData(canEdit? joinedData: detailData)
        dispatch(setShowLoadingScreen(false))
      }).catch(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
	},[dispatch, searchParams])

  useEffect(()=>{
    let canEdit = false
		if(location.pathname.includes("edit")){
      canEdit = true
			// setCanEdit(true)
		}else{
      canEdit = false
			// setCanEdit(false)
		}
    fetchData(canEdit)
  },[location, fetchData])

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }else{
      const body = {
        LOOKUP_ID: valueId,
        LOOKUP_NAME: valueName,
        STATUS: Boolean(status),
        DETAILS:listData.filter(value=> value.CODE_ID !== "" && value.SHORT_DESC !== "")
      }
      fnStoreEditLookupValue(body, valueId)
    }
  };

  const handleAdd = (index)=>{
    const keys = Object.keys(listData[0]);
    setListData((prevData) =>{
      const validation = validateCodeIds(prevData);
      if (!validation.isValid) {
        toast.error(validation.message);
        return prevData; // Jangan tambah baris baru
      }
      return [
        ...prevData.map((row) => ({ ...row, done: true })),
        keys.reduce((acc, key) => {
          if (key === "step") {
            acc[key] = prevData.length + 1;
          } else if (key === "done") {
            acc[key] = false;
          } else if (key === "fromDB") {
            acc[key] = false;
          } else if (key === "LOOKUP_ID") {
            acc[key] = valueId;
          } else {
            acc[key] = "";
          }
          return acc;
        }, {}),
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
    });
  };

  const handleCellChange = (e, index) => {
    const { name, value } = e.target;
    setListData((prevData) =>
      prevData.map((row, idx) =>
        idx === index ? { ...row, [name]: value } : row
      )
    );
  };

  return (
		<Container fluid id="edit-lookup-value-page">
      <CardComponent
        title={canEdit? "Edit Lookup Value": "View Lookup Value"}
        sideComponent={<></>}
        type="create"
        needFooter
        dataFooter={dataFooter}
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
                name={"lookup_id"}
                onChange={(e)=>setValueId(e.target.value)}
                readOnly={true}
                disabled={true}
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
                name={"lookup_name"}
                value={valueName}
                onChange={(e)=>setValueName(e.target.value)}
                readOnly={!canEdit}
                disabled={!canEdit}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={6}>
              <InputDropdownComponent
                listDropdown={[
                  {value:Boolean(1), label:"Active"},
                  {value:Boolean(0), label:"Inactive"},
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
            key={`detail-lookup-edit-${listData.length}`}
            columns={canEdit? columnsConfig : columnsConfigView}
            data={listData}
            pagination={false}
            paginationComponentOptions={{noRowsPerPage: true}}
            persistTableHead
            responsive
            striped
            needExport={false}
          />
          {canEdit && (
            <div>
              <Stack direction="horizontal" className="mt-3 justify-content-end" gap={3}>
                <ButtonComponent
                  className={"px-sm-5 fw-semibold"}
                  variant="warning"
                  title={"Save"}
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
          )}
        </Form>
      </CardComponent>
    </Container>
  )
}

export default EditLookupValue;