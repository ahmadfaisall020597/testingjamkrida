/* eslint-disable react-refresh/only-export-components */
import { Image, Modal } from "react-bootstrap"
import { setShowModal } from "./TenantSlice"
import closeButton from "src/assets/image/close_button_gray.png"
import { typeModalMasterTenant } from "src/utils/variableGlobal/var"
import { useDispatch, useSelector } from "react-redux"
import ModalContentListAllProduct from "./modalTenant/listAllProduct"
import ModalContentListAllPackage from "./modalTenant/listAllPackage"
import ModalContentListRegisteredUser from "./modalTenant/listRegisteredUser"
import { toast } from "react-toastify"
import { History } from "src/utils/router"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import objectRouterMasterPage from "src/utils/router/objectRouter.masterPage"
import { store } from "src/utils/store/combineReducers"
import { editTenant, getTenantDetails, storeTenant } from "src/utils/api/apiMasterPage"
import ModalContentListRegisteredCourier from "./modalTenant/listRegisteredCourier"

//here you can create shared function per page
export const ModalParent = ({
  data,
  canEdit
}) =>{
  const dispatch = useDispatch()
  const {showModal} = useSelector(state=>state.tenant)
  const handleClose = ()=>{
    dispatch(setShowModal(false))
  }
  return(
    <Modal
      show={showModal}
      size={[typeModalMasterTenant[2].type, typeModalMasterTenant[3].type].includes(data?.type) ? "xl" : "lg"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={()=>handleClose()}
    >
      <Modal.Body className="position-relative">
        <div role="button" className="position-absolute" onClick={()=>handleClose()} style={{right:"12px"}}>
          <Image src={closeButton} />
        </div>
        <Modal.Title id="contained-modal-title-vcenter" className="fs-3">
          {data?.title}
        </Modal.Title>
        {
          {
            [typeModalMasterTenant[0].type]: <ModalContentListAllProduct tenantId={data?.id} />,
            [typeModalMasterTenant[1].type]: <ModalContentListAllPackage tenantId={data?.id} />,
            [typeModalMasterTenant[2].type]: <ModalContentListRegisteredUser tenantId={data?.id} canEdit={canEdit} />,
            [typeModalMasterTenant[3].type]: <ModalContentListRegisteredCourier tenantId={data?.id} canEdit={canEdit} />
          }[data?.type]
        }
      </Modal.Body>
    </Modal>
  )
}

export const fnStoreTenant = (body)=>{
  store.dispatch(setShowLoadingScreen(true))
  storeTenant(body).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    History.navigate(objectRouterMasterPage.tenant.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnStoreEditTenant = (body, roomId, callbackFn)=>{
  store.dispatch(setShowLoadingScreen(true))
  editTenant(body,roomId).then(res=>{
    store.dispatch(setShowLoadingScreen(false))
    toast.success(res.data.message)
    if(callbackFn){
      callbackFn()
    }
    History.navigate(objectRouterMasterPage.tenant.path)
  }).catch(()=>{
    store.dispatch(setShowLoadingScreen(false))
  })
}

export const fnGetTenantDetails = async (tenantId)=>{
  try {
    store.dispatch(setShowLoadingScreen(true))
    const response = await getTenantDetails({},tenantId)
    if(response){
      store.dispatch(setShowLoadingScreen(false))
      const data = response.data.data
      return data || null
    }
    store.dispatch(setShowLoadingScreen(false))
  } catch {
    store.dispatch(setShowLoadingScreen(false))
    return null
  }
}
