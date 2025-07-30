import moment from "moment"
import { Stack } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import ButtonComponent from "src/components/partial/buttonComponent"
import { updateStatus } from "src/utils/api/apiWorkFlow"
import { History } from "src/utils/router"
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest"
import { setShowLoadingScreen, setShowModalGlobal } from "src/utils/store/globalSlice"

const ButtonAction = ({canEdit})=>{
  const dispatch = useDispatch()
  const { data, formData } = useSelector(state=>state.requestTransactionList)
  const onBack = ()=>{
    History.navigate(-1)
  }

  const confirmBack = ()=>{
    if(formData?.STATUS !== ""){
      dispatch(setShowModalGlobal({
        show: true,
        content: {
          captionText: `Any unsaved changes will be lost if you go back.`,
          questionText: "Are you sure you want to go back?",
          buttonLeftText: "Yes",
          buttonRightText: "No",
          buttonLeftFn: ()=>onBack(),
          buttonRightFn: null
        }
      }))
    }else{
      onBack()
    }
  }

  const confirmSubmit = () => {
    if (!formData?.STATUS) {
      toast.error("Please select a status before submitting.");
      return;
    }
    if (formData?.STATUS == "SO_005") {
      if (!formData?.COURIER_ID) {
        toast.error("Please select a courier to proceed.");
        return;
      }
    }
    let captionText = `Once confirmed, your changes will be applied and cannot be undone.`;
    if (formData?.STATUS == "SO_002") {
      const deliveryDate = moment(data.DELIVERY_DATE).utc();
      const currentDate = moment().utc();
      const currentDatePlus1Days = moment().add(1, "days").utc();
      if (currentDate > deliveryDate) {
        toast.error(
          `The current date is past the delivery date (${deliveryDate}). Please ask the requester to update the delivery date to a future date before confirming.`
        );
        return;
      }
      if (currentDate == deliveryDate) {
        captionText = `The order will be automatically canceled if not approved by 4 PM today.`;
      }
      if (currentDatePlus1Days == deliveryDate) {
        captionText = `The order will be automatically canceled if not approved by 4 PM tomorrow.`;
      }
    }
    dispatch(
      setShowModalGlobal({
        show: true,
        content: {
          captionText: captionText,
          questionText: "Do you wish to continue?",
          buttonLeftText: "Yes",
          buttonRightText: "No",
          buttonLeftFn: () => onSubmit(),
          buttonRightFn: null,
        },
      })
    );
  };


  const onSubmit = ()=>{
    dispatch(setShowLoadingScreen(true))
    const body = {
      SubmitApprovalDTO: {
        ID: data?.ID,
        ORDER_ID: data?.ORDER_ID,
        BULK_FLAG: data?.BULK_FLAG
    
      },
      UpdateOrderStatusDTO: {
        ID: data?.ID,
        STATUS: formData?.STATUS,
        COURIER_ID: formData?.COURIER_ID?.toString(),
        COURIER_BY_NAME: formData?.COURIER_BY_NAME
      }
    }

    updateStatus(body).then((res)=>{
      if(res.data.data){
        toast.success(res.data.message)
        History.navigate(objectRouterFunctionRequest.requestTransactionList.path)
      }
    }).finally(()=>{
      dispatch(setShowLoadingScreen(false))
    })
  }
  
  return(
    <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
      {canEdit && 
        <ButtonComponent className="px-sm-5 py-sm-2 fw-semibold" variant="warning" onClick={confirmSubmit} title="Save" />
      }
      <ButtonComponent className="px-sm-5 py-sm-2 fw-semibold" variant="outline-danger" onClick={confirmBack} title="Back" />
    </Stack>
  )
}

export default ButtonAction