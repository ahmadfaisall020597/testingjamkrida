import { Image, Modal } from "react-bootstrap"
import { PiImageBrokenFill } from "react-icons/pi"
import closeImage from "src/assets/image/close_upload_image.png";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModalImage } from "src/utils/store/globalSlice";

const ModalImageComponent =()=>{
  const dispatch = useDispatch()
  const [brokenImage, setBrokenImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const {modalImage} = useSelector(state => state.global)

  const handleImageError = () =>{
    setLoading(false)
    setBrokenImage(true)
  }

  return(
    <Modal
      show={modalImage.show}
      onHide={() => dispatch(setModalImage({show:false}))}
      size="lg"
      centered
      contentClassName="border-0 bg-transparent"
    >
      <Modal.Body className="p-0 d-flex justify-content-center align-items-center">
        <div className="position-relative">
          <div className="position-absolute top-0 start-100 translate-middle" onClick={() => dispatch(setModalImage({show:false}))} style={{ cursor: "pointer" }}>
            <Image src={closeImage} />
          </div>
          {modalImage.content ? (
            brokenImage ?
              <PiImageBrokenFill  size={103} className={loading ? "d-none" : ""} />
            :
              <Image src={modalImage.content} fluid style={{ maxHeight: "90vh", maxWidth: "100%" }} onError={handleImageError}/>
          ) : (
            <p className="bg-white p-3 m-0">No image uploaded</p>
          )}
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default ModalImageComponent