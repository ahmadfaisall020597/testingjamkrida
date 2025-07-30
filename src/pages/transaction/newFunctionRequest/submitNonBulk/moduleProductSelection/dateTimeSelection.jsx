import { Stack } from "react-bootstrap";
import InputComponent from "src/components/partial/inputComponent";

// 📌 Komponen Pilih Tanggal & Waktu
const DateTimeSelection = ({ dateValue, timeValue, onDateChange, onTimeChange }) => {
  return (
    <Stack direction="horizontal" className="justify-content-sm-center align-items-center flex-wrap" gap={3}>
      <div>Delivery Date</div>
      <InputComponent
        label=""
        value={dateValue}
        onChange={onDateChange}
        type="date"
        name="DATE"
        formGroupClassName="gx-1 align-items-center"
        marginBottom="0"
        labelXl="1"
      />
      <div>Delivery Time</div>
      <InputComponent
        label=""
        value={timeValue}
        onChange={onTimeChange}
        type="time"
        name="TIME"
        formGroupClassName="gx-1 align-items-center"
        marginBottom="0"
        labelXl="0"
      />
    </Stack>
  );
};

export default DateTimeSelection;