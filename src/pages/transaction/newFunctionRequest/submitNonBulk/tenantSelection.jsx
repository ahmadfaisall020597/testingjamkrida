import { useDispatch, useSelector } from "react-redux";
import { setResetTenantSelectionData, setStepNameComponent, setTenantSelectionData } from "../newFunctionRequestSlice";
import { Card, Col, Form, Image, Row, Stack } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import { FaSearch } from "react-icons/fa";
import { useCallback, useEffect, useRef, useState } from "react";
import { objectTenantSelection, validateRequestDataTenantSelection } from "../newFunctionRequestFn";
import _ from "lodash";
import { saveStepFunctionRequestDraft, saveTenantSelectionDataDraft } from "src/utils/localStorage";
import LoadingSpinner from "src/components/partial/spinnerComponent";
import { getRecommendationTenantTransaction } from "src/utils/api/apiTransaction";
import { toast } from "react-toastify";
import dummyImage from "src/assets/image/dummy_image_preview.png";

const TenantSelection = () =>{
  const dispatch = useDispatch()
  const {tenantSelectionData, orderEditOrViewData} = useSelector(state => state.newFunctionRequest)

  const [currentSearch, setCurrentSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchTermTenantName, setSearchTermTenantName] = useState("");
  const debounceSearchTenantNameRef = useRef(null);
  const [listData, setListData] = useState([]);

  const fetchData =useCallback(() => {
      setLoading(true);
      const params = {
        searchTenantName:searchTermTenantName,
      }
      getRecommendationTenantTransaction(params).then(res=>{
        const data = res.data.data
        setListData(data)
        setLoading(false)
      }).catch(err=>{
        const response = err.response.data
        setListData(response.data)
        setLoading(false)
      })
    },[searchTermTenantName])

  useEffect(() => {
		fetchData();
	}, [fetchData]);

  useEffect(() => {
    debounceSearchTenantNameRef.current = _.debounce((value) => {
      setSearchTermTenantName(value);
    }, 500);
  }, [dispatch, searchTermTenantName]);

  const handleSelectTenant = (tenantId) => {
    if(orderEditOrViewData){
      toast.error("Cannot change Tenant in edit mode.");
      return
    }
    dispatch(setTenantSelectionData({key:objectTenantSelection[0], value: tenantId}))
  };

  const handleSearchTenantName = (e, from, key) => {
    if(from == "onchange"){
      setCurrentSearch(e.target.value)
      debounceSearchTenantNameRef.current(e.target.value);
    }else{
      setSearchTermTenantName(tenantSelectionData[objectTenantSelection[key]]);
    }
  };
  const handleNext = ()=>{
    const isValid = validateRequestDataTenantSelection(tenantSelectionData);
    if (isValid) {
      // toast.success("Validation Passed ✅");
      saveTenantSelectionDataDraft(tenantSelectionData) // save to local storage
      saveStepFunctionRequestDraft("ProductSelection")
      // simpan ke local storage, lalu call API
      dispatch(setStepNameComponent("ProductSelection"))
    }
  }

  const handleBack = ()=>{
    saveStepFunctionRequestDraft("RoomSelection")
    dispatch(setStepNameComponent("RoomSelection"))
    dispatch(setResetTenantSelectionData())
  }

  return(
    <div className="mb-4">
      <Stack>
        <Row className="border-bottom border-3 gx-0">
          <Col sm={6}>
            <div className="mt-1 mb-4 px-3 py-2 header-title fw-bold fs-5">
              Select Tenant
            </div>
            <InputSearchComponent
              label="Tenant Name"
              value={currentSearch}
              onChange={(e) => handleSearchTenantName(e, "onchange")}
              placeholder="Search tenant name..."
              componentButton={<FaSearch />}
              buttonOnclick={() =>handleSearchTenantName(null, "button")}
              formGroupClassName={"inputTenantName"}
              labelXl="3"
            />
          </Col>
        </Row>
        <div className="my-4">
          <div className="mb-2">List All Tenant</div>
          <Row className="gy-3 gx-5">
            {loading && <LoadingSpinner color="secondary"/>}
            {listData.map((tenant) => (
              <Col sm={6} key={tenant[objectTenantSelection[0]]}>
                <Card
                  role="button"
                  className={`tenant-card border-0 ${
                    tenantSelectionData[objectTenantSelection[0]] === tenant[objectTenantSelection[0]] ? "selected-tenant-selection" : "unselected-tenant-selection"
                  }`}
                  onClick={() => handleSelectTenant(tenant[objectTenantSelection[0]])}
                >
                  <Card.Body>
                    <Stack direction="horizontal" gap={3} className="align-items-center">
                      <Form.Check
                        type="radio"
                        checked={tenantSelectionData[objectTenantSelection[0]] === tenant[objectTenantSelection[0]]}
                        onChange={() => handleSelectTenant(tenant[objectTenantSelection[0]])}
                      />
                      <Image src={tenant[objectTenantSelection[2]] || dummyImage} width={100} height={100} className="rounded" />
                      <div>
                        <p className="m-0 label-tenant-selection">Tenant</p>
                        <h5 className="m-0">{tenant[objectTenantSelection[1]]}</h5>
                      </div>
                    </Stack>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        {/* Submit & Cancel Buttons */}
        <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
          <ButtonComponent
            className="px-sm-5 fw-semibold"
            variant="outline-dark"
            onClick={handleBack}
            title="Back"
          />
          <ButtonComponent 
            className="px-sm-5 fw-semibold" 
            variant="warning"
            onClick={handleNext} 
            title="Next"
          />
        </Stack>
      </Stack>
    </div>
  )
}

export default TenantSelection;