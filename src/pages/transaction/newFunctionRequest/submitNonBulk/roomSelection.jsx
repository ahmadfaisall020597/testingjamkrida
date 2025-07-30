import { Card, Col, Form, Row, Stack } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent";
import { setResetRoomListData, setRoomListData, setRoomSelectionData, setStepNameComponent } from "../newFunctionRequestSlice";
import InputComponent from "src/components/partial/inputComponent";
import { backToFunctionRequest, handleModalOpenQueryDeliveryTo, objectRoomSelection, titleModalQueryDeliveryTo, validateRequestDataRoomSelection } from "../newFunctionRequestFn";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import moment from "moment";
import InputModalQueryComponent from "src/components/partial/inputModalQueryComponent";
import { FaSearch } from "react-icons/fa";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { setSelectableModalQuery } from "src/utils/store/globalSlice";
import InputSwitchComponent from "src/components/partial/inputSwitchComponent";
import InputSearchComponent from "src/components/partial/inputSearchComponent";
import _ from "lodash";
import InfiniteScrollComponent from "src/components/partial/InfiniteScrollComponent";
import { getRoomSelectionDataDraft, saveRoomSelectionDataDraft, saveStepFunctionRequestDraft } from "src/utils/localStorage";
import { getBookRoom, getNonBookRoom } from "src/utils/api/apiTransaction";

const RoomSelection = () =>{
  const dispatch = useDispatch()
  const {stepNameComponent, roomSelectionData, requestType, roomListData} = useSelector(state => state.newFunctionRequest)
  const { selectableModalQuery } = useSelector(state => state.global);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTermRoomName, setSearchTermRoomName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const hasMoreRef = useRef(true);
  const loadingRef = useRef(false);
  const pageSize = 6

  const debounceSearchRoomNameRef = useRef(null);

  const reqType = useMemo(()=>
    roomSelectionData[objectRoomSelection[2]]
  ,[roomSelectionData])

  const isNonBookRoom = useMemo(() => 
    roomSelectionData[objectRoomSelection[3]], 
  [roomSelectionData]);

  useEffect(() => {
    if (selectableModalQuery?.title === titleModalQueryDeliveryTo) {
      dispatch(setRoomSelectionData({ key: objectRoomSelection[0], value: selectableModalQuery?.data?.id?.toString() }));
      dispatch(setRoomSelectionData({ key: objectRoomSelection[9], value: selectableModalQuery?.data?.fullname }));
    }
    return () => dispatch(setSelectableModalQuery(null));
  }, [selectableModalQuery, dispatch]);
  
  const fetchRoomsNonBook = useCallback(async () => {
    if (!hasMoreRef.current || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
  
    try {
      const params = {
        pageNumber: currentPage,
        pageSize: pageSize,
        roomName: searchTermRoomName,
      };
      const response = await getNonBookRoom(params);
      const newRooms = response?.data?.data || [];
      // const totalData = response?.data?.totalData || null
      // setTotalData(totalData)
      
      dispatch(setRoomListData(newRooms)); // Append data baru ke data lama
      setHasMore(newRooms.length > 0);
      hasMoreRef.current = newRooms.length > 0; // Perbarui ref
    } catch  {
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [currentPage, searchTermRoomName, dispatch]);
  
  const fetchRoomsBook = useCallback(async () => {
    if (!hasMoreRef.current || loadingRef.current) return;
    loadingRef.current = true;
    setLoading(true);
    try {
        const params = {
          roomName: searchTermRoomName,
          startTime: moment(roomSelectionData.DELIVERY_DATETIME).format("YYYY-MM-DD")
        };
        const response = await getBookRoom(params);
        const newRooms = response?.data?.data.map(room=>{
          // const formattedFrom = moment(room.ROOM_FROM).format("DD/MM/YYYY HH:mm");
          // const formattedTo = moment(room.ROOM_TO).format("DD/MM/YYYY HH:mm");
  
          return {
            ...room,
            ROOM_FROM: room.ROOM_FROM,
            ROOM_TO: room.ROOM_TO,
            ROOM_UNIQ: `${room.ROOM_ID}_${room.ROOM_FROM}_${room.ROOM_TO}`
          };
        }) || [];

        if(currentPage==1){
          // dispatch(setRoomSelectionData({key: objectRoomSelection[13], value:{}}))
          dispatch(setResetRoomListData());
        }

        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const paginatedRooms = newRooms.slice(startIdx, endIdx);
  
        // const totalData = newRooms.length || null
        // setTotalData(totalData)

        // Jika batch baru kosong, berarti sudah halaman terakhir
        if (paginatedRooms.length === 0) {
          setHasMore(false);
          hasMoreRef.current = false;
          return;
        }

        dispatch(setRoomListData(paginatedRooms)); // Append data baru ke data lama
        setHasMore(endIdx < newRooms.length);
        hasMoreRef.current = endIdx < newRooms.length; // Perbarui ref
    } catch  {
      setHasMore(false);
      hasMoreRef.current = false;
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [searchTermRoomName, roomSelectionData.DELIVERY_DATETIME, dispatch, currentPage]);

  useEffect(()=>{
    if (isNonBookRoom) {
      fetchRoomsNonBook();
    } else {
      if(isNonBookRoom==false){
        fetchRoomsBook();
      }
      if(isNonBookRoom === undefined){
        setTimeout(()=>{
          const data = getRoomSelectionDataDraft() // get from localstorage
          if(!data?.[objectRoomSelection[3]]){
            dispatch(setRoomSelectionData({key: objectRoomSelection[3], value: false}))
          }
        },500)
        
      }
    }
  },[isNonBookRoom, fetchRoomsNonBook, fetchRoomsBook, dispatch])

  useEffect(()=>{
    if(stepNameComponent == "RoomSelection" && reqType==undefined){
      // console.log("masuk")
      if(requestType){
        if(requestType.length > 1){
          // console.log("masuk lagi")
          setTimeout(()=>{
            const data = getRoomSelectionDataDraft() // get from localstorage
            if(!data?.[objectRoomSelection[2]]){
              dispatch(setRoomSelectionData({ key: objectRoomSelection[2], value: requestType[1].value }));
            }
          },500)
        }
      }
    }
    
  },[dispatch, requestType, stepNameComponent, reqType])
  
  const fetchMoreData = () => {
    if (hasMoreRef.current && !loadingRef.current){
      setCurrentPage(prev => prev + 1);
    }
  }

  useEffect(()=>{
    dispatch(setResetRoomListData());
    setCurrentPage(1); // Reset ke halaman pertama saat switch berubah
    setHasMore(true);
    hasMoreRef.current = true; // Reset nilai ref
    loadingRef.current = false;
  },[dispatch, roomSelectionData.DELIVERY_DATETIME])

  useEffect(() => {
    debounceSearchRoomNameRef.current = _.debounce((value) => {
      dispatch(setResetRoomListData());
      setCurrentPage(1); // Reset ke halaman pertama saat switch berubah
      setHasMore(true);
      hasMoreRef.current = true; // Reset nilai ref
      loadingRef.current = false;
      setSearchTermRoomName(value);
    }, 500);
  }, [dispatch, searchTermRoomName]);

  const handleSearchRoomName = (e, from, key) => {
    if(from == "onchange"){
      dispatch(setRoomSelectionData({key: objectRoomSelection[key], value: e.target.value}))
      debounceSearchRoomNameRef.current(e.target.value);
    }else{
      setCurrentPage(1);
      setSearchTermRoomName(roomSelectionData[objectRoomSelection[key]]);
    }
  };

  const handleSwitchChange = (checked) =>{
    if(checked){
      dispatch(setRoomSelectionData({key: objectRoomSelection[1], value: ""}))
      dispatch(setRoomSelectionData({key: objectRoomSelection[12], value: ""}))
    }else{
      dispatch(setRoomSelectionData({key: objectRoomSelection[4], value: ""}))
      dispatch(setRoomSelectionData({key: objectRoomSelection[10], value: ""}))
    }
    dispatch(setRoomSelectionData({key: objectRoomSelection[3], value: checked}))
    dispatch(setRoomSelectionData({key: objectRoomSelection[13], value:{}}))
    dispatch(setResetRoomListData());
    setSearchTermRoomName("");
    setCurrentPage(1); // Reset ke halaman pertama saat switch berubah
    setHasMore(true);
    hasMoreRef.current = true; // Reset nilai ref
    loadingRef.current = false;
  }

  const handleCheckboxChange = (roomData) => {
    if(roomSelectionData[objectRoomSelection[3]]){
      dispatch(setRoomSelectionData({key: objectRoomSelection[10], value:roomData.ROOM_NAME}))
      dispatch(setRoomSelectionData({key: objectRoomSelection[4], value:roomData.ROOM_ID}))
    }else{
      dispatch(setRoomSelectionData({key: objectRoomSelection[12], value:roomData.ROOM_NAME}))
      dispatch(setRoomSelectionData({key: objectRoomSelection[1], value:roomData.ROOM_ID}))
    }
    dispatch(setRoomSelectionData({key: objectRoomSelection[13], value:roomData}))
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    const updatedDatetime = newDate && moment(roomSelectionData[objectRoomSelection[8]]).format("HH:mm") ? `${newDate} ${moment(roomSelectionData[objectRoomSelection[8]]).format("HH:mm")}:00` : undefined;
    dispatch(setRoomSelectionData({ key: objectRoomSelection[8], value: updatedDatetime }));
    dispatch(setResetRoomListData());
    setCurrentPage(1); // Reset ke halaman pertama saat switch berubah
    setHasMore(true);
    hasMoreRef.current = true; // Reset nilai ref
    loadingRef.current = false;
  };

  const handleTimeChange = (e) => {
    const newTime = e.target.value;
    const updatedDatetime = moment(roomSelectionData[objectRoomSelection[8]]).format("YYYY-MM-DD") && newTime ? `${moment(roomSelectionData[objectRoomSelection[8]]).format("YYYY-MM-DD")} ${newTime}:00` : "";
    dispatch(setRoomSelectionData({ key: objectRoomSelection[8], value: updatedDatetime }));
    dispatch(setResetRoomListData());
    setCurrentPage(1); // Reset ke halaman pertama saat switch berubah
    setHasMore(true);
    hasMoreRef.current = true; // Reset nilai ref
    loadingRef.current = false;
  };

  const handleNext = ()=>{
    const isValid = validateRequestDataRoomSelection(roomSelectionData);
    if (isValid) {
      // toast.success("Validation Passed ✅");
      saveRoomSelectionDataDraft(roomSelectionData) // save to local storage
      saveStepFunctionRequestDraft("TenantSelection")
      // simpan ke local storage, lalu call API
      dispatch(setStepNameComponent("TenantSelection"))
    }
  }

  const handleBack = ()=>{
    backToFunctionRequest()
  }

  return(
    <Row>
      {/* Left Column */}
      <Col xl={6} className="pe-xl-4 create-col border-end border-3">
        <div className="my-1 px-3 py-2 header-title fw-bold fs-5">
          Submit Function Request
        </div>
        <div className="mt-4">
          <InputModalQueryComponent
            label="Delivery to"
            labelXl="4"
            value={roomSelectionData[objectRoomSelection[9]]}
            componentButton={<FaSearch />}
            onChange={(e)=>console.log(e)}
            buttonOnclick={() =>handleModalOpenQueryDeliveryTo()}
            formGroupClassName={"gx-2 align-items-center"}
            marginBottom="4"
            required={true}
          />
          <InputComponent
            type="text"
            label="Contact No"
            labelXl="4"
            value={roomSelectionData[objectRoomSelection[14]]}
            name={objectRoomSelection[14]}
            onChange={(e) => dispatch(setRoomSelectionData({key: objectRoomSelection[14], value:e.target.value}))}
            formGroupClassName={"gx-2 align-items-center"}
            marginBottom="4"
            required={true}
          />
          <Row className="gx-2">
            <Col xl={8}>
              <InputComponent
                labelXl="6"
                label="Delivery Date"
                value={roomSelectionData[objectRoomSelection[8]] ? moment(roomSelectionData[objectRoomSelection[8]]).format("YYYY-MM-DD"): ""}
                onChange={handleDateChange}
                type={"date"}
                name="DATE"
                formGroupClassName={"gx-1 align-items-center"}
                required={true}
              />
            </Col>
            <Col xl={4}>
              <InputComponent
                labelXl="3"
                label="Time"
                value={roomSelectionData[objectRoomSelection[8]] ? moment(roomSelectionData[objectRoomSelection[8]]).format("HH:mm"): ""}
                onChange={handleTimeChange}
                type={"time"}
                name="TIME"
                formGroupClassName="gx-1"
              />
            </Col>
          </Row>
          <InputSearchComponent
            label="Room Avaliability"
            value={roomSelectionData[objectRoomSelection[12]] || ""}
            onChange={(e) => handleSearchRoomName(e, "onchange", 12)}
            buttonOnclick={() =>handleSearchRoomName(null, "button", 12)}         
            placeholder="Search Room Teams..."
            componentButton={<FaSearch />}
            formGroupClassName={"gx-2 align-items-center"}
            labelXl="4"
            disabled={!!roomSelectionData[objectRoomSelection[3]]}
            required={true}
          />
          <InputDropdownComponent
            onChange={(e) =>dispatch(setRoomSelectionData({key: objectRoomSelection[2], value:e.target.value}))}
            value={roomSelectionData[objectRoomSelection[2]]}
            label="Request Type"
            listDropdown={requestType.filter(v=>v.value!="")}
            labelXl="4"
            valueIndex
            marginBottom="4"
            formGroupClassName={"gx-2 align-items-center"}
            required={true}
          />
          <Row className="gx-2">
            <Form.Label column xl={4}>
              Non Book Room<span className="text-danger">*</span>
            </Form.Label>
            <Col className="justify-items-center">
              <InputSwitchComponent
                value={roomSelectionData[objectRoomSelection[3]]}
                formGroupClassName="gx-2"
                marginBottom="4"
                onClick={(e)=> handleSwitchChange(e)}
                readOnly={loading}
              />
            </Col>
            <Col xl={6}>
              <InputSearchComponent
                label=""
                value={roomSelectionData[objectRoomSelection[10]] || ""}
                onChange={(e) => handleSearchRoomName(e, "onchange", 10)}
                placeholder="Search Non Book Room..."
                componentButton={<FaSearch />}
                buttonOnclick={() =>handleSearchRoomName(null, "button", 10)}
                formGroupClassName={"gx-2 align-items-center"}
                labelXl="0"
                disabled={!roomSelectionData[objectRoomSelection[3]]}
              />
            </Col>
          </Row>
          <InputComponent
            type="text"
            label="Event Name"
            labelXl="4"
            value={roomSelectionData[objectRoomSelection[5]]}
            name={objectRoomSelection[5]}
            onChange={(e) => dispatch(setRoomSelectionData({key: objectRoomSelection[5], value:e.target.value}))}
            formGroupClassName={"gx-2 align-items-center"}
            marginBottom="4"
            required={true}
          />
          <InputComponent
            type="text"
            label="Purpose Request"
            labelXl="4"
            value={roomSelectionData[objectRoomSelection[6]]}
            name={objectRoomSelection[6]}
            onChange={(e) => dispatch(setRoomSelectionData({key: objectRoomSelection[6], value:e.target.value}))}
            formGroupClassName={"gx-2 align-items-center"}
            marginBottom="4"
            required={true}
          />
          <InputComponent
            type="number"
            label="Total Attendance"
            labelXl="4"
            value={roomSelectionData[objectRoomSelection[7]]}
            name={objectRoomSelection[7]}
            onChange={(e) =>dispatch(setRoomSelectionData({ key: objectRoomSelection[7], value: e.target.value }))}
            formGroupClassName={"gx-2 align-items-center"}
            marginBottom="4"
            onKeyDown={(e) => {
              if (e.key === '.' || e.key === ',' || e.key ==="e" || e.key === "E" || e.key === "-" || e.key === "+") {
                e.preventDefault();
              }
            }}
            required={true}
          />
        </div>
      </Col>
      {/* Right Column */}
      <Col className="ps-xl-4">
        <InfiniteScrollComponent 
          fetchMoreData={fetchMoreData} 
          hasMore={hasMore} 
          loading={loading}
          className={"scrollable-room-section"}
        >
          {
            roomListData.map((room, idx) => (
              <div key={`${room.ROOM_ID}-${idx}`} className="d-flex align-items-start mb-3 custom-checkbox-table">
                <Form.Check
                  type="checkbox"
                  checked={
                    roomSelectionData[objectRoomSelection[3]]
                      ? room.ROOM_ID === roomSelectionData[objectRoomSelection[4]]
                      : room?.ROOM_UNIQ === roomSelectionData[objectRoomSelection[13]]?.ROOM_UNIQ
                  }
                  onChange={() => handleCheckboxChange(room)}
                  className="me-2"
                />
                <Card
                  className={`text-start w-100 ${
                    roomSelectionData[objectRoomSelection[3]]
                    ? room.ROOM_ID === roomSelectionData[objectRoomSelection[4]]
                      ? "selected"
                      : "unselected"
                    : room?.ROOM_UNIQ === roomSelectionData[objectRoomSelection[13]]?.ROOM_UNIQ
                      ? "selected"
                      : "unselected"
                  }`}
                  onClick={() => handleCheckboxChange(room)}
                  role={"button"}
                >
                  <Card.Body className="fw-semibold fs-6">
                    <p className="m-0 mb-1">{room.ROOM_NAME}</p>
                    <Row className="mb-1">
                      <Col sm={3}>Book by</Col>
                      <Col>: {room.ROOM_BOOKEDBY || "-"} </Col>
                    </Row>
                    <Row className="mb-1">
                      <Col sm={3}>From</Col>
                      {
                        roomSelectionData[objectRoomSelection[3]]
                        ?
                        <Col>: -</Col>
                        :
                        <Col>: {moment(room.ROOM_FROM).format("DD/MM/YYYY HH:mm")} - {moment(room.ROOM_TO).format("DD/MM/YYYY HH:mm")}</Col>

                      }
                    </Row>
                    <Row className="mb-1">
                      <Col sm={3}>Capacity</Col>
                      <Col>: {room.CAPACITY}</Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            ))
          }
        </InfiniteScrollComponent>
        {/* Submit & Cancel Buttons */}
        <Stack direction="horizontal" className="mt-4 justify-content-end" gap={3}>
          <ButtonComponent
            className="px-sm-5 fw-semibold"
            variant="outline-dark"
            onClick={handleBack}
            title="Back"
          />
          <ButtonComponent 
            className="px-sm-5 fw-semibold" 
            variant="warning"
            onClick={handleNext} 
            title="Next"
          />
        </Stack>
      </Col>
    </Row>
  )
}

export default RoomSelection;