import { Stack } from "react-bootstrap"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import ButtonComponent from "src/components/partial/buttonComponent"
import { updateOrderHistoryList } from "src/utils/api/apiTransaction"
import { History } from "src/utils/router"
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest"
import objectRouterInquiry from "src/utils/router/objectRouter.inquiry"
import { setShowLoadingScreen, setShowModalGlobal } from "src/utils/store/globalSlice"

const ButtonAction = ({canEdit, data})=>{
  const dispatch = useDispatch()
  const onBack = ()=>{
    History.navigate(-1)
  }

  const confirmSubmit = ()=>{
    if(!data?.PAYMENT_METHOD){
      toast.error("Please select payment method")
      return
    }
    if(data?.PAYMENT_METHOD == "PM_001" && !data?.COST_CENTER_ID){
      toast.error("Please select cost center")
      return
    }
    dispatch(setShowModalGlobal({
      show: true,
      content: {
        captionText: `Once confirmed, your changes will be applied and cannot be undone.`,
        questionText: "Confirm request update?",
        buttonLeftText: "Yes",
        buttonRightText: "No",
        buttonLeftFn: ()=>onSubmit(),
        buttonRightFn: null
      }
    }))
  }

  const onSubmit = ()=>{
    dispatch(setShowLoadingScreen(true))
    const bodyFormData = new FormData();
    
    Object.keys(data).forEach((key) => {
      if(key=="PAYMENT_ATTACHMENT_URL"){
        if (typeof data[key] === "string" && data[key]) {
          bodyFormData.append(key, data[key]);
        }else{
          if (typeof data[key] === "object" && data[key]) {
            bodyFormData.append("PAYMENT_ATTACHMENT_FILE", data[key]);
            bodyFormData.append(key, data?.[key]?.name);
          }
        }
      }else if(key=="ORDER_LIST_SEQUENCE"){
        bodyFormData.append(key, data[key]);
        bodyFormData.append("ORDER_LIST_SEQUENCE_JSON", JSON.stringify(data[key]));
      }else{
        bodyFormData.append(key, data[key]);
      }
    })

    updateOrderHistoryList(data.ORDER_ID, bodyFormData).then((res)=>{
      toast.success(res.data.message)
      History.navigate(objectRouterInquiry.orderHistoryList.path)
    }).finally(()=>{
      dispatch(setShowLoadingScreen(false))
    })
  }



  return(
    <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
      {canEdit && 
        <ButtonComponent className="px-sm-5 py-sm-2 fw-semibold" variant="warning" onClick={confirmSubmit} title="Update" />
      }
      <ButtonComponent className="px-sm-5 py-sm-2 fw-semibold" variant="outline-danger" onClick={onBack} title="Back" />
    </Stack>
  )
}

export default ButtonAction