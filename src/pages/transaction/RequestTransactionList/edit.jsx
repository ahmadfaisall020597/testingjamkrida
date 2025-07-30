import { useCallback, useEffect, useState } from "react"
import { Col, Container, Row, Stack } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router"
import CardComponent from "src/components/partial/cardComponent"
import { getDetailTransactionByIdTenant } from "src/utils/api/apiTransaction"
import { History } from "src/utils/router"
import objectRouterFunctionRequest from "src/utils/router/objectRouter.functionRequest"
import { setShowLoadingScreen } from "src/utils/store/globalSlice"
import { decryptDataId, fnSendMessage } from "./requestTransactionListFn"
import { setData, setFormData } from "./requestTransactionListSlice"
import ButtonAction from "./module/buttonAction"
import HeaderComponent from "./module/header"
import "./style.scss";
import StatusComponent from "./module/status"
import DetailOrder from "./module/detailOrder"
import CommentSection from "src/components/partial/commentSectionComponent"
import { toast } from "react-toastify"
import { FaCaretSquareLeft, FaCaretSquareRight } from "react-icons/fa"
import moment from "moment"

const EditRequestTransaction = () => {
  let [searchParams] = useSearchParams()
  const { data } = useSelector(state=>state.requestTransactionList)
  const dispatch = useDispatch()
  const [canEdit, setCanEdit] = useState(false);
  const pageSize = 1;
  const [pageNumber, setPageNumber] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [localLogsChat, setLocalLogsChat] = useState([
    // {
    //   ID: "",
    //   ORDER_ID: "",
    //   USER_ID: "",
    //   USER_BY_NAME: "",
    //   LAST_UPDATED_DATE: moment().utc(),
    //   DESCRIPTION: ""
    // }
  ]);
  const {profileUsers} = useSelector(state=>state.global)

  const fetchData =useCallback(() => {
		dispatch(setShowLoadingScreen(true))
    const param = decryptDataId(searchParams.get("q"))
    if(param === null){
      History.navigate(objectRouterFunctionRequest.requestTransactionList.path)
      dispatch(setShowLoadingScreen(false))
    }else{
      
      const id = param?.id
      getDetailTransactionByIdTenant({
        ID:id,
        pageSize,
        pageNumber
      }).then(res=>{
        setTotalData(res.data.totalData)
        dispatch(setData(res.data.data))
        if(res.data.data.STATUS){
          if(["SO_006", "SO_007", "SO_008", "SO_009", "SO_010"].includes(res.data.data.STATUS)){
            setCanEdit(false)
          }else{
            setCanEdit(param?.from == "edit")
          }
        }
        dispatch(setFormData({key: "STATUS", value: ""}))
      }).finally(()=>{
        dispatch(setShowLoadingScreen(false))
      })
    }
	},[dispatch, pageNumber, searchParams])

  useEffect(()=>{
    fetchData()
  },[fetchData])

  const sendMessageToRequestor = (message) =>{
    const body = {
      message : message,
      messageType : "tenant"
    }
    fnSendMessage(body, data.ID).then(res=>{
      toast.success(res.data.message)
    }).finally(()=>{
      const currentUserId = profileUsers?.badgeNumber
      const currentTenant = data?.TENANT_NAME
      setLocalLogsChat((prev)=>[{
          ID: data?.ID,
          ID_ORDERLOG: "",
          USER_ID: currentUserId,
          USER_BY_NAME: currentTenant,
          LAST_UPDATED_DATE: moment().utc(),
          DESCRIPTION: message
        },...prev])
    })
  }

  return (
    <Container fluid id="edit-request-transaction-page">
			<CardComponent
				title={``}
				type="index"
        children2={canEdit && <CommentSection onClick={(message)=>sendMessageToRequestor(message)} titleButton={"Send message to Requester"}/>}
        needFooter
        dataFooter={[...localLogsChat, ...data?.LOGS || [] ]}
			>
        <Row>
          <Col sm={9}>
            <HeaderComponent canEdit={!canEdit}/>
          </Col>
          <Col sm={3}>
            <StatusComponent canEdit={!canEdit}/>
          </Col>
        </Row>
        <Stack className="w-100 my-3 position-relative" gap={2}>
          <div className="position-absolute top-0 end-0">
            <Stack direction="horizontal" className="fs-4" gap={3}>
              <div role="button" onClick={() => setPageNumber(pageNumber > 1 ? pageNumber - 1 : 1)}><FaCaretSquareLeft size={28}/></div>
              <div>{pageNumber} of {totalData}</div>
              <div role="button" onClick={() => setPageNumber(pageNumber < totalData ? pageNumber + 1 : totalData)}><FaCaretSquareRight size={28}/></div>
            </Stack>
          </div>
          <DetailOrder />
          <div>
            <ButtonAction canEdit={canEdit}/>
          </div>
        </Stack>
      </CardComponent>
    </Container>
  )
}

export default EditRequestTransaction