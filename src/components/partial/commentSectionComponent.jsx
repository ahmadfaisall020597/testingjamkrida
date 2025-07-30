import { useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import InputComponent from "src/components/partial/inputComponent";

const CommentSection = ({onClick, titleButton}) =>{
  const [commentDescription, setCommentDescription] = useState("");

  const handleClick = () =>{
    if(onClick){
      onClick(commentDescription)
      setCommentDescription("")
    }
  }

  return(
    <div className="border-top border-2 p-4">
      <Row>
        <Col xl={6}>
          <InputComponent
            type="textarea"
            label="Comment"
            labelXl="2"
            value={commentDescription}
            name={"Comment"}
            onChange={(e) => setCommentDescription(e.target.value)}
            formGroupClassName="gx-2"
            inputClassName={"fw-light"}
            marginBottom="3"
            placeholder={"type comment here..."}
          />
        </Col>
        <Col xl={6}>
          <ButtonComponent
            title={titleButton}
            variant="primary"
            onClick={() => handleClick()}
            rounded="2"
            className={`text-white px-sm-5`}
            disabled={commentDescription.length < 3}
          />
        </Col>
      </Row>
    </div>
  )
}

export default CommentSection;