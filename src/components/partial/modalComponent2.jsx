import { Image, Modal, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import closeButton from "src/assets/image/close_button_gray.png"
import { setShowModalAlert, setShowModalGlobal } from "src/utils/store/globalSlice";
import ButtonComponent from "./buttonComponent";
import successImage from "src/assets/image/success-image-alert.png"

const ModalComponent2 = () =>{
  const dispatch = useDispatch()
  const {showModalAlert, contentModalAlert} = useSelector(state=>state.global)

  const handleButton = ()=>{
    if(contentModalAlert?.button){
      if(typeof contentModalAlert?.button == "function"){
        contentModalAlert?.button()
      }
    }
    dispatch(setShowModalAlert({show: false}))
  }

  return(
    <Modal
      show={showModalAlert}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={()=>dispatch(setShowModalAlert({show: false}))}
    >
      <Modal.Body className="px-0 pb-2 pt-4 modal-confirmation position-relative">
        <div className="position-absolute top-0 start-50 translate-middle">
          <Image src={successImage} width={100}/>
        </div>
        <div className={`text-center fw-bold pt-5 h1 text-${contentModalAlert.type}`}>
          {contentModalAlert.title}
        </div>
        <div>
          <p className="fw-semibold text-center p-4 h4 m-0">{contentModalAlert.message}</p>
        </div>
        <Stack direction="horizontal" className="mb-4 mt-2 justify-content-center" gap={4}>
          <ButtonComponent 
            className="px-sm-5 pt-2 pb-2 fw-semibold" 
            variant="warning" 
            title="OK"
            onClick={handleButton}
          />
        </Stack>
      </Modal.Body>
    </Modal>
  )
}

export default ModalComponent2;