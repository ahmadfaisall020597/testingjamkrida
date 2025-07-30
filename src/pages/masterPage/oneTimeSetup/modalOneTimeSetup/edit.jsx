import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import { fnGetOneTimeSetupDetails, fnStoreOneTimeSetup, fnUpdateValueDefaultConfig, loopDropDownDeliveryDays } from "../oneTimeSetupFn";
import { useCallback, useEffect, useState } from "react";
import InputComponent from "src/components/partial/inputComponent";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { useDispatch, useSelector } from "react-redux";
import { getListTenant } from "src/utils/api/apiMasterPage";
import { setSelectableModalQuery, setShowModalQuery } from "src/utils/store/globalSlice";
import { Stack } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import { setShowModal } from "../oneTimeSetupSlice";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";

export default function EditRequestConfiguration({
  id
}){
  const dispatch = useDispatch()
  const { selectableModalQuery } = useSelector(state => state.global);
  const defaultData = {
    CANCEL_ORDER_FLAG: true,
    DELIVERY_DAYS: 0
  }
  const [localDefaultData, setLocalDefaultData] = useState(defaultData);

  const titleModalQuery = "List All Tenant"

  const handleChange = (key, value)=>{
		const updatedData = { ...localDefaultData, [key]: value };
    setLocalDefaultData(updatedData);
	}

  const handleModalOpenQuery = ()=>{
    const data = getListTenant;
    // this can change to your data
    
    const columnConfig = [
      {
        name: "Tenant ID",
        selector: row=> row.TENANT_ID,
        sortable: true,
        sortField: "TENANT_ID",
        width: "120px"
      },
      {
        name: "Name",
        selector: row=> row.TENANT_NAME,
        sortable: true,
        sortField: "TENANT_NAME",
      },
      {
        name: "Status",
        cell: row =>(
          <div className={`fw-bold text-${row.STATUS? 'success': 'danger'}`}>{row.STATUS? 'Active': 'Inactive'}</div>
        ),
        sortable: true,
        sortField: "STATUS",
        width: "150px"
      },
    ]
    dispatch(setShowModalQuery({show:true,
      content:{
        title: titleModalQuery,
        data: data,
        columnConfig: columnConfig,
        searchKey: "tenantName",
        searchLabel: "Tenant Name",
        usingPaginationServer: true
      }
    }))
  }

  const validateForm = () => {

    if (!localDefaultData.TENANT_NAME) {
      toast.error("Please choose TENANT");
      return false;
    }
    
    if (!localDefaultData.DELIVERY_DAYS || isNaN(localDefaultData.DELIVERY_DAYS) || Number(localDefaultData.DELIVERY_DAYS) < 0) {
			toast.error("Please select a valid Delivery Days (H-0 to H-10).");
			return false;
		}

		if (!localDefaultData.DELIVERY_HOURS || !/^\d{2}:\d{2}$/.test(localDefaultData.DELIVERY_HOURS)) {
				toast.error("Please enter a valid Delivery Hours in HH:mm format.");
				return false;
		}

		if (!localDefaultData.MIN_ORDER || isNaN(localDefaultData.MIN_ORDER) || Number(localDefaultData.MIN_ORDER) <= 0) {
				toast.error("Minimum Order must be a positive number.");
				return false;
		}

		if (typeof localDefaultData.CANCEL_ORDER_FLAG !== "boolean") {
				toast.error("Invalid value for Can Cancel Order. Please select Yes or No.");
				return false;
		}

    return true;
  };

  const handleSubmit = () =>{
    if (!validateForm()) return;
    // eslint-disable-next-line no-unused-vars
    const {LOGS, ...rest} = localDefaultData
    const body = rest
    fnUpdateValueDefaultConfig(body, ()=>handleCancel())
  }

  const handleCancel = useCallback(() =>{
    dispatch(setShowModal(false))
    setLocalDefaultData({})
  },[dispatch])

  const fetchData = useCallback(() => {
    if (id === null) {
      handleCancel()
    } else {
      fnGetOneTimeSetupDetails(id).then(async (res) => {
        if (res) {
          setLocalDefaultData(res)
        }
      })
    }
  }, [handleCancel, id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if(selectableModalQuery?.title == titleModalQuery){
      setLocalDefaultData((prev) => ({
        ...prev,
        "TENANT_ID": selectableModalQuery?.data?.TENANT_ID, 
        "TENANT_NAME": selectableModalQuery?.data?.TENANT_NAME
      }))
    }
    return(()=>dispatch(setSelectableModalQuery(null)))
  },[selectableModalQuery, dispatch])

  return(
    <div>
      <InputModalQueryComponent
        label="Tenant ID"
        labelXl="5"
        value={localDefaultData.TENANT_NAME}
        onChange={()=>console.log()}
        componentButton={<FaSearch />}
        buttonOnclick={() =>handleModalOpenQuery()}
        formGroupClassName={"gx-1"}
      />
      <InputDropdownComponent
        onChange={(e) => handleChange("DELIVERY_DAYS", e.target.value)}
        value={localDefaultData.DELIVERY_DAYS}
        label="Delivery Days"
        listDropdown={loopDropDownDeliveryDays()}
        labelXl="5"
        ColXl="4"
        valueIndex={true}
        formGroupClassName="gx-1"
        marginBottom="3"
      />
      <InputComponent
        labelXl="5"
        ColXl="4"
        label="Delivery Hours"
        value={localDefaultData.DELIVERY_HOURS}
        onChange={(e) => handleChange("DELIVERY_HOURS", e.target.value)}
        type={"time"}
        name="DELIVERY_HOURS"
        formGroupClassName="gx-1"
        marginBottom="3"
      />
      <InputComponent
        labelXl="5"
        ColXl="4"
        label="Min. Order per Portion"
        value={localDefaultData.MIN_ORDER}
        onChange={(e) => handleChange("MIN_ORDER", e.target.value)}
        type={"text"}
        formGroupClassName="gx-1"
        marginBottom="3"
      />
      <InputDropdownComponent
        onChange={(e) => handleChange("CANCEL_ORDER_FLAG", e.target.value == "true"? true : false)}
        value={localDefaultData.CANCEL_ORDER_FLAG}
        label="Can Cancel Order H-1"
        listDropdown={[
          {value: true, label: "Yes"},
          {value: false, label: "No"}
        ]}
        labelXl="5"
        ColXl="4"
        valueIndex={true}
        formGroupClassName="gx-1"
        marginBottom="3"
      />
      <Stack direction="horizontal" className="justify-content-center mt-4" gap={3}>
        <ButtonComponent
          className={"px-sm-5 fw-semibold"}
          variant="warning"
          onClick={() => handleSubmit()}
          title={"Save"}
        />
        <ButtonComponent
          className={"px-sm-5 fw-semibold"}
          variant="outline-danger"
          onClick={() => handleCancel()}
          title={"Cancel"}
        />
      </Stack>
    </div>
  )
}