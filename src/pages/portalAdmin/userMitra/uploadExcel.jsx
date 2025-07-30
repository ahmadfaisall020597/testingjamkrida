import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack, Image, Modal, Button } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import { History } from "src/utils/router";
import { toast } from "react-toastify";
import imageSK from "src/assets/image/syarat-dan-ketentuan-bsi.webp";
import { Link, useNavigate } from "react-router";
import { getLogoPath, getMitraName } from "src/utils/getLogoByEmail";
import TableComponent from "src/components/partial/tableComponent";
//sementara
import { objectRouterPortalAdmin } from "../../../utils/router/objectRouter.portalAdmin";
import { dataDummyUserMitra } from "./dataDummyUserMitra";
import { FaEdit, FaEye, FaFileContract, FaTrash } from "react-icons/fa";
import InputExcelComponent from "../../../components/partial/InputExcelComponent";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { fnStoreUserMitra, fnUploadExcelUserMitra } from "./userMitraFn";
import { getlistmitra } from "../../../utils/api/apiSettings";
import { useSelector } from "react-redux";
/**
 * The CreateRoom component allows users to create a new room with specific attributes.
 * It initializes form data state and populates room type options from the redux store.
 * Users can input room details such as name, location, capacity, type, status, and upload an image.
 * The component validates form inputs before submission and handles form data submission to the server.
 * React hooks are utilized for managing form state and fetching room type data.
 */
const listDataMitra = [
    { value: "Bank BSI", label: "Bank BSI" },
    { value: "Bank DKI", label: "Bank DKI" },
];

export default function UploadExcelUserMitra() {
    const navigate = useNavigate();
    const [filteredData, setFilteredData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const [column, setColumn] = useState([]);
    const [mitraList, setMitraList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        mitra: "",
        role: "",
        userId: "",
        email: "",
        name: "",
        phone: 0,
        filesLampiran: [],
    });

    //
    const { translationData } = useSelector(state => state.language);
    const code_lang = useSelector(state => state.language.selectedLanguage);
    console.log('translate bahasa : ', translationData[code_lang]);

    // Validation rules (adjust the length as needed)
    const maxLength = {
        name: 256,
        phone: 13
    };

    // Validate input length
    const validateInput = (key, value) => {

        if (maxLength[key] !== undefined) {
            return value.length <= maxLength[key];
        }
        return true;
    };
    // Handle change for form inputs
    const handleChange = (field, value) => {

        if (!validateInput(field, value)) {
            console.warn(`Input for ${field} exceeds maximum length of ${maxLength[field]}`);
            return;
        }
        setFormData(prev => {
            const updated = { ...prev, [field]: value };

            return updated;
        });
    };

    // Validate the form before submitting

    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem("dataUserMitra") || "[]");
        const combinedData = [...dataDummyUserMitra];
        setFilteredData(combinedData);
        console.log("localData :", localData);
    }, []);

    // logo
    const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
    // const { email } = dataLogin;
    // const logoPath = getLogoPath(email);

    //nama mitra
    // const mitraName = getMitraName(email);

    useEffect(() => {
        fetchMitraData();
    }, []); // fetch once on mount

    const fetchMitraData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getlistmitra();
            if (Array.isArray(response.data)) {
                setMitraList(response.data);
            } else {
                console.error("Response data is not an array:", response.data);
                setError("Format data tidak valid");
                setMitraList([]);
            }
        } catch (err) {
            console.error("Error fetching mitra data:", err);
            setError("Gagal memuat data mitra");
        } finally {
            setLoading(false);
        }
    };

    const transformedMitraList = mitraList.map(mitra => ({
        value: mitra.bank_code,
        label: mitra.bank_name
    }));

    // Example dynamic column generator:
    const generateColumns = (data, navigate) => {
        if (!data || data.length === 0) return [];

        const keys = Object.keys(data[0]);

        // Exclude "id" from visible columns
        const visibleKeys = keys.filter(key => key !== 'id');

        const baseColumns = visibleKeys.map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column name
            selector: row => row[key],
            sortable: true,
        }));

        // Add optional Action column
        baseColumns.push({
            name: "Action",
            cell: row => (
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", minWidth: 80 }}>
                    <FaTrash
                        style={{ cursor: "pointer", color: "red", width: 20, height: 20 }}
                        title="Delete"
                        onClick={() => handleDelete(row.id)}
                    />
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        });

        return baseColumns;
    };
    useEffect(() => {
        if (!tableData || tableData.length === 0) return;
        const keys = Object.keys(tableData[0]);
        // Exclude "id" from visible columns
        const visibleKeys = keys.filter(key => key !== 'id');
        const generatedColumns = visibleKeys.map(key => ({
            name: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize column name
            selector: row => row[key],
            sortable: true,
        }));

        generatedColumns.push({
            name: "Action",
            cell: row => (
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", minWidth: 80 }}>
                    <FaTrash
                        style={{ cursor: "pointer", color: "red", width: 20, height: 20 }}
                        title="Delete"
                        onClick={() => handleDelete(row.userId)} // Make sure 'id' exists in your data
                    />
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        });

        setColumn(generatedColumns);
    }, [tableData]);

    const handleFileUpload = file => {
        // debugger;
        if (!file) {
            console.warn("No file selected.");
            setTableData([]);
            return;
        }

        const fileExt = file.name.split(".").pop().toLowerCase();
        console.log(fileExt);
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = event.target.result;

            if (fileExt === "csv") {
                Papa.parse(data, {
                    header: true,
                    delimiter: ";", // try with "," or ";" depending on your file
                    skipEmptyLines: true,
                    complete: result => {
                        const withId = result.data.map((row, index) => ({ ...row, id: index + 1 }));
                        setTableData(withId);
                        setColumn(generateColumns(result.data, navigate));
                    }
                });
                // } else if (fileExt === "xlsx" || fileExt === "xls") {
                //     const workbook = XLSX.read(data, { type: "binary" });
                //     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                //     const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                //     setColumn(Object.keys(jsonData[0]));
                //     setTableData(jsonData);
                //     // Save to localStorage
                //     //localStorage.setItem("dataUserMitra", JSON.stringify(parsedData));
                //     //toast.success("Data berhasil disimpan di localStorage");
            }
            else {
                alert("Unsupported file type");
            }
        };

        if (fileExt === "csv") {
            reader.readAsText(file, "UTF-8");
        } else {
            reader.readAsBinaryString(file);
        }
    };

    const columns = [
        { name: "Role", selector: row => row.role, sortable: true },
        { name: "User ID", selector: row => row.userId, sortable: true },
        { name: "Name", selector: row => row.name, sortable: true },
        { name: "Email", selector: row => row.email, sortable: true },
        { name: "Phone", selector: row => row.phone, sortable: true },

        {
            name: "Action",
            cell: row => (
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-start", minWidth: 80 }}>
                    <FaTrash style={{ cursor: "pointer", color: "red", width: 20, height: 20 }} title="Edit" onClick={() => handleDelete(row.id)} />
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            Alignment: "center"
        }
    ];
    const customStyles = {
        headCells: {
            style: {
                color: "black",
                background: "#EBF451",
                fontWeight: "bold",
                borderRight: "1px solid black",
                justifyContent: "center",
                textAlign: "center"
            }
        },
        cells: {
            style: {
                // color: "black",
                // borderRight: "1px solid black",
                // justifyContent: "center",
                // textAlign: "center"
            }
        },
        rows: {
            style: {
                minHeight: "45px"
            }
        }
    };

    // const handleSubmit = event => {
    //     event.preventDefault();

    //     const existingData = JSON.parse(localStorage.getItem("dataUserMitra") || "[]");

    //     const today = new Date();
    //     const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

    //     const newEntry = tableData.map(item => ({
    //         id: Date.now() + Math.random(),  // buat id unik tiap item
    //         createdDate: formattedDate,
    //         ...item,
    //         mitra: formData.mitra,
    //         statusApproval: "Submit",
    //         status: "Active"
    //     }));

    //     const updatedData = [...existingData, ...newEntry];
    //     localStorage.setItem("dataUserMitra", JSON.stringify(updatedData));
    //     toast.success("Data Upload berhasil disimpan.");
    //     const localData = JSON.parse(localStorage.getItem("dataUserMitra") || "[]");
    //     console.log("localData : ", localData);
    //     // setTimeout(() => {
    //     //     navigate("/portal-admin/user-mitra");
    //     // }, 1000);
    //     //setTableData(updatedData); // <-- update your React state to reflect changes immediately
    // };

    const convertKeysToLowercase = (obj) => {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.toLowerCase()] = obj[key];
            return acc;
        }, {});
    };

    const handleSubmit = (event) => {
        // debugger;
        event.preventDefault();
        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

        const newEntry = tableData.map(item => {
            const { userid, ...rest } = item;

            return {
                user_id: rest.UserId,               // renamed field                          
                mitra_id: formData.mitra.split(" ").pop(),
                role: rest.Role.toLowerCase(),
                email: rest.Email,
                name: rest.Name,
                phone: rest.Phone,
                password: "123456",
                statusApproval: "Submitted",
                status: "Active",
                created_at: formattedDate
            };
        });
        console.log("newEntry :", newEntry);

        fnUploadExcelUserMitra(newEntry);
    }

    const handleDelete = (id) => {
        const updatedData = tableData.filter(item => item.id !== id);
        setTableData(updatedData);
    };

    useEffect(() => {
        setColumn(generateColumns(tableData, handleDelete));
    }, [tableData]);
    return (
        <>
            <Container fluid id="create-user-mitra-page">
                <Row>
                    <CardComponent title="Create User Mitra" type="create" needFooter>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col>
                                    <InputDropdownComponent
                                        disabled={!formData.mitra}
                                        listDropdown={!transformedMitraList ? [] : [{ value: "", label: "-- " + translationData[code_lang]?.user_mitra?.upload_excel?.choose_mitra + " --" }, ...transformedMitraList]}
                                        valueIndex
                                        label={translationData[code_lang]?.user_mitra?.upload_excel?.mitra}
                                        required
                                        labelXl="3"
                                        value={formData.mitra}
                                        name="mitra"
                                        onChange={e => handleChange("mitra", e.target.value)}
                                        formGroupClassName="gx-3"
                                    />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Col xs={12}>
                                    <div className="card border-0 shadow-sm">
                                        <div className="card-header bg-info text-white py-2">
                                            <div className="d-flex align-items-center">
                                                <i className="fas fa-envelope me-2"></i>
                                                <strong>{translationData[code_lang]?.user_mitra?.upload_excel?.file}</strong>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <InputExcelComponent
                                                label={translationData[code_lang]?.user_mitra?.upload_excel?.pilih}
                                                labelXl="12"
                                                name="fileUpload"
                                                onChange={handleFileUpload}
                                                formGroupClassName="gx-2"
                                                downloadTemplate="assets/file/Form_Upload_User_Mitra.csv"
                                                showImagePreview
                                                controlId="formImageSPUploadExcel"
                                            />
                                        </div>

                                    </div>
                                </Col>
                            </Row>
                            <br />
                            <label><strong><h5>{translationData[code_lang]?.user_mitra?.upload_excel?.preview_data}</h5></strong></label>
                            <br />
                            <div style={{ marginTop: 30 }}>
                                <TableComponent columns={column ? column : columns} data={tableData || []} pagination paginationTotalRow={tableData.length} customStyles={customStyles} />
                            </div>
                            <br />
                            <div className="form-actions">
                                <Row>
                                    <Col xs={12}>
                                        <Stack direction="horizontal" className="justify-content-end flex-wrap" gap={3}>
                                            <ButtonComponent
                                                className="px-4 py-2 fw-semibold order-2 order-sm-1"
                                                variant="outline-danger"
                                                onClick={() => History.navigate(objectRouterPortalAdmin.userMitra.path)}
                                                title={translationData[code_lang]?.global?.btn?.cancel}
                                            />
                                            <ButtonComponent className="px-4 py-2 fw-semibold order-1 order-sm-2" variant="warning" title="Submit" type={translationData[code_lang]?.global?.btn?.submit} />
                                        </Stack>
                                    </Col>
                                </Row>
                            </div>
                        </Form>
                    </CardComponent>
                </Row>
            </Container>
        </>
    );
}


