import { Image, Modal, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import closeButton from "src/assets/image/close_button_gray.png"
import { setShowModalGlobal } from "src/utils/store/globalSlice";
import ButtonComponent from "./buttonComponent";

const ModalComponent = () =>{
  const dispatch = useDispatch()
  const {modalGlobal} = useSelector(state=>state.global)

  const handleLeft = ()=>{
    if(modalGlobal?.content?.buttonLeftFn){
      if(typeof modalGlobal?.content?.buttonLeftFn == "function"){
        modalGlobal?.content?.buttonLeftFn()
      }
    }
    dispatch(setShowModalGlobal({show: false}))
  }

  const handleRight = ()=>{
    if(modalGlobal?.content?.buttonRightFn){
      if(typeof modalGlobal?.content?.buttonRightFn == "function"){
        modalGlobal?.content?.buttonRightFn()
      }
    }
    dispatch(setShowModalGlobal({show: false}))
  }

  return(
    <Modal
      show={modalGlobal.show}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={()=>dispatch(setShowModalGlobal({show: false}))}
    >
      <Modal.Body className="px-0 py-2 modal-confirmation">
        <Stack direction="horizontal" className="w-100 justify-content-end px-2 pb-2">
          <Image src={closeButton} role="button" onClick={()=>dispatch(setShowModalGlobal({show: false}))}/>
        </Stack>
        <div className="text-center p-3 caption-text fw-normal h5">
          {modalGlobal?.content?.captionText}
        </div>
        <div>
          <p className="fw-semibold text-center p-4 h4 m-0">{modalGlobal?.content?.questionText}</p>
        </div>
        {/* Submit & Cancel Buttons */}
        <Stack direction="horizontal" className="mb-4 mt-2 justify-content-center" gap={4}>
          <ButtonComponent 
            className="px-sm-5 pt-2 pb-2 fw-semibold" 
            variant="warning" 
            title={modalGlobal.content.buttonLeftText}
            onClick={handleLeft}
          />
          <ButtonComponent
            className="px-sm-5 pt-2 pb-2 fw-semibold"
            variant="outline-danger"
            onClick={handleRight}
            title={modalGlobal.content.buttonRightText}
          />
        </Stack>
      </Modal.Body>
    </Modal>
  )
}

export default ModalComponent;