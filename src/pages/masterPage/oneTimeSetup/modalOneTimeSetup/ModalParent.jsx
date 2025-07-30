import { useDispatch, useSelector } from "react-redux"
import { Image, Modal } from "react-bootstrap"
import closeButton from "src/assets/image/close_button_gray.png"
import { typeModalOneTimeSetup } from "src/utils/variableGlobal/var"
import { setShowModal } from "../oneTimeSetupSlice"
import CreateRequestConfiguration from "./create"
import EditRequestConfiguration from "./edit"

export default function ModalParent({
  data
}){
  const dispatch = useDispatch()
  const {showModal} = useSelector(state=>state.oneTimeSetup)
  const handleClose = ()=>{
    dispatch(setShowModal(false))
  }
  return(
    <Modal
      show={showModal}
      size={"md"}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={()=>handleClose()}
    >
      <Modal.Body className="position-relative">
        <div role="button" className="position-absolute" onClick={()=>handleClose()} style={{right:"12px"}}>
          <Image src={closeButton} />
        </div>
        <div className="p-3">
          <Modal.Title id="contained-modal-title-vcenter" className="fs-3 mb-4">
            {data?.title}
          </Modal.Title>
          {
            {
              [typeModalOneTimeSetup[0].type]: <CreateRequestConfiguration  />,
              [typeModalOneTimeSetup[1].type]: <EditRequestConfiguration id={data?.id} />,
            }[data?.type]
          }
        </div>
      </Modal.Body>
    </Modal>
  )
}