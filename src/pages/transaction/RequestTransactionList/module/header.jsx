import { Col, Row, Stack } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { handleModalOpenQueryCourier, titleModalQueryCourier } from "../requestTransactionListFn";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber } from "src/utils/helpersFunction";
import moment from "moment";
import { useEffect } from "react";
import { setSelectableModalQuery } from "src/utils/store/globalSlice";
import { setFormData } from "../requestTransactionListSlice";

const HeaderComponent = ({canEdit}) =>{
  const dispatch = useDispatch()
  const { data, formData } = useSelector(state=>state.requestTransactionList)
  const { selectableModalQuery } = useSelector(state => state.global);

  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryCourier) {
      dispatch(setFormData({key: "COURIER_ID", value:selectableModalQuery?.data?.USER_ID}))
      dispatch(setFormData({key: "COURIER_BY_NAME", value:selectableModalQuery?.data?.USER_NAME}))
    }

    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch]);

  useEffect(()=>{
    if(data?.COURIER_BY_NAME){
      dispatch(setFormData({key: "COURIER_BY_NAME", value:data?.COURIER_BY_NAME}))
    }
    if(data?.COURIER_ID){
      dispatch(setFormData({key: "COURIER_ID", value:data?.COURIER_ID}))
    }
  },[data, dispatch])

  return(
    <div>
      <Row className="bg-header rounded-2 gx-0">
        <Col xl={6} className="gx-5 my-3 create-col border-end border-3">
          <Stack gap={2}>
            {[
              { label: "Requester Name", value: data.REQUESTER_NAME },
              { label: "Location", value: data.ROOM_NAME },
              { label: "Phone Number", value: data.PHONE_NUMBER || "No Phone Number" },
              { label: "Order ID", value: data.ORDER_ID },
              { label: "Total Price", value: formatNumber(data.TOTAL_PRICE) },
              { label: "Delivery Type", value: data.DELIVERY_TYPE },
            ].map((item, index) => (
              <Stack key={index} direction="horizontal" gap={2}>
                <p className="m-0 col-5">{item.label}</p>
                <p className="m-0 col-7">: {item.value}</p>
              </Stack>
            ))}
          </Stack>
        </Col>
        <Col xl={6} className="gx-5 my-3">
          <Stack gap={2}>
            {[
              { label: "Pack Qty", value: data.PACK_QTY },
              { label: "Type", value: data.REQUEST_TYPE },
              { label: "Deliver Date / Time", value: `${moment(data.DELIVERY_DATE).format("DD MMM YYYY")} / ${moment(data.DELIVERY_DATE).format("HH:mm")}` },
              { label: "Status Delivery", value: data.STATUS_DESC },
              { label: "Item", value: data.ITEMS }
            ].map((item, index) => (
              <Stack key={index} direction="horizontal" gap={2}>
                <p className="m-0 col-5">{item.label}</p>
                <p className="m-0 col-7">: {item.value}</p>
              </Stack>
            ))}
            {![
              'SO_001', 
              'SO_002', 
              'SO_003',
            ].includes(data.STATUS) && (
              <InputModalQueryComponent
                label="Add Courier"
                labelXl="5"
                value={formData?.COURIER_BY_NAME}
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleModalOpenQueryCourier()}
                formGroupClassName={"align-items-center"}
                marginBottom="0"
                disabled={canEdit}
              />
            )}
          </Stack>
        </Col>
      </Row>
    </div>

  )
}

export default HeaderComponent;