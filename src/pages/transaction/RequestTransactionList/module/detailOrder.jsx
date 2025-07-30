import moment from "moment";
import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import { useSelector } from "react-redux";
import ButtonComponent from "src/components/partial/buttonComponent";
import TableComponent from "src/components/partial/tableComponent";
import { formatNumber } from "src/utils/helpersFunction";

const DetailOrder = () => {
  const { data } = useSelector(state => state.requestTransactionList);
  const [activeButton, setActiveButton] = useState("product");
  const [listDataProduct, setListDataProduct] = useState([]);
  const [listDataPackage, setListDataPackage] = useState([]);

  useEffect(() => {
    if (data) {
      if (data.ORDER_PACKAGE) {
        setListDataPackage(data.ORDER_PACKAGE);
      }
      if (data.ORDER_PRODUCT) {
        setListDataProduct(data.ORDER_PRODUCT);
      }
    }
  }, [data]);

  const onClick = (type) => {
    setActiveButton(type);
  };

  // Column definitions for Unit Order and Package Order
  const productColumns = [
    { name: "Product Name", selector: row => row.PRODUCT_NAME, wrap: true, width: '200px' },
    { name: "Type", selector: row => row.TYPE_PRODUCT, width: '180px' },
    { name: "Quantity", selector: row => formatNumber(row.QTY_PRODUCT), width: '120px' },
    { name: "Price per Piece", selector: row => formatNumber(row.PRICE_PRODUCT), width: '200px' },
    { name: "Promo", selector: row => row.DISCOUNT_PERCENT ? `${row.DISCOUNT_PERCENT} %` : formatNumber(row.DISCOUNT_AMOUNT), width: '200px' },
    { name: "Total Price", selector: row => formatNumber(row.TOTAL_PRICE_PRODUCT), width: '200px' },
    { name: "Receive Date Time", selector: row => row.RECEIVED_DATE && moment(moment.utc(row.RECEIVED_DATE).local()).format("DD/MM/YYYY HH:mm"), wrap: true }
  ];

  const packageColumns = [
    { name: "Package Name", selector: row => row.PACKAGE_NAME, wrap: true },
    { name: "Quantity", selector: row => formatNumber(row.QTY_PRODUCT_PACKAGE), width: '120px' },
    { name: "Price per Package", selector: row => formatNumber(row.PRICE_PRODUCT_PACKAGE), width: '200px' },
    { name: "Total Price", selector: row => formatNumber(row.TOTAL_PRICE_PACKAGE), width: '200px' },
    { name: "Receive Date Time", selector: row => row.RECEIVED_DATE && moment(moment.utc(row.RECEIVED_DATE).local()).format("DD/MM/YYYY HH:mm"), wrap: true }
  ];

  return (
    <div>
      {/* Button for switching between Product and Package views */}
      <Stack direction="horizontal" className="flex-wrap mb-2" gap={3}>
        <ButtonComponent
          title={"Detail Unit Order"}
          variant={activeButton === "product" ? "primary" : "outline-dark"}
          onClick={() => onClick("product")}
          rounded="2"
          className={`${activeButton === "product" && 'text-white'} px-sm-5`}
        />
        <ButtonComponent
          title={"Detail Package Order"}
          variant={activeButton === "package" ? "primary" : "outline-dark"}
          onClick={() => onClick("package")}
          rounded="2"
          className={`${activeButton === "package" && 'text-white'} px-sm-5`}
        />
      </Stack>

      {/* Conditional rendering of the tables based on active button */}
      {activeButton === "product" && (
        <TableComponent
          columns={productColumns}
          data={listDataProduct}
          persistTableHead
          responsive
          striped
        />
      )}

      {activeButton === "package" && (
        <TableComponent
          columns={packageColumns}
          data={listDataPackage}
          persistTableHead
          responsive
          striped
        />
      )}
    </div>
  );
};

export default DetailOrder;
