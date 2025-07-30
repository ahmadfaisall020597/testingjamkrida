import { useEffect, useState } from "react";
import { Col, Container, Form, Row, Stack, Image, Modal, Button } from "react-bootstrap";
import ButtonComponent from "src/components/partial/buttonComponent";
import CardComponent from "src/components/partial/cardComponent";
import InputComponent from "src/components/partial/inputComponent";
import InputDropdownComponent from "src/components/partial/inputDropdownComponent";
import InputImageComponent from "src/components/partial/inputImageComponent";
import { History } from "src/utils/router";
import { toast } from "react-toastify";
import imageSK from "src/assets/image/syarat-dan-ketentuan-bsi.webp";
import InputDateComponent from "src/components/partial/inputDateComponent";
import { Link, useNavigate } from "react-router";
import objectRouter from "src/utils/router/objectRouter";
import { getLogoPath, getMitraName } from "src/utils/getLogoByEmail";

//sementara
import FileTemplate from "src/assets/file/Formulir_Permohonan_Penjaminan_Kredit.docx";
import InputFileComponent from "../../../components/partial/InputFileComponent";
import { useLocation } from "react-router";
import { objectRouterPortalAdmin } from "../../../utils/router/objectRouter.portalAdmin";
import UserMitraPage from ".";
import { dataDummyUserMitra } from "./dataDummyUserMitra";
import { getEntitasName } from "../../../utils/getLogoByEmail";
import { fnStoreUserMitra } from "./userMitraFn";
import { getlistmitra } from "../../../utils/api/apiSettings";
import { getlistUserMitra } from "../../../utils/api/apiUserMitra";
import { useSelector } from "react-redux";

/**
 * The CreateRoom component allows users to create a new room with specific attributes.
 * It initializes form data state and populates room type options from the redux store.
 * Users can input room details such as name, location, capacity, type, status, and upload an image.
 * The component validates form inputs before submission and handles form data submission to the server.
 * React hooks are utilized for managing form state and fetching room type data.
 */
const objectName = [
    "birthDate", //0
    "startDateCredit" //1
];
const listDataMitra = [
    { value: "Bank BSI", label: "Bank BSI" },
    { value: "Bank DKI", label: "Bank DKI" },
];
const listDataRole = [
    { value: "pusat", label: "Pusat" },
    { value: "cabang", label: "Cabang" },
];

export default function CreateUserMitra() {
    const navigate = useNavigate();
    const [selectedMitra, setSelectedMitra] = useState("");
    const [mitraList, setMitraList] = useState([]);
    const [userMitraList, setUserMitraList] = useState([]);
    const [dataCombined, setDataCombined] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        mitra: "",
        role: "",
        userId: "",
        email: "",
        name: "",
        phone: 0
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
    useEffect(() => {
        fetchListUserMitraData();
    }, []); // fetch once on mount

    const fetchListUserMitraData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getlistUserMitra();
            if (Array.isArray(response.data)) {
                setUserMitraList(response.data);
            } else {
                console.error("Response data is not an array:", response.data);
                setError("Format data tidak valid");
                setUserMitraList([]);
            }
        } catch (err) {
            console.error("Error fetching mitra data:", err);
            setError("Gagal memuat data user mitra");
        } finally {
            setLoading(false);
        }
    };

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
        // if (field === "mitra") {
        //     // Cari data berdasarkan nomor pengajuan
        //     const foundData = dataCombined.find(item => item.mitra === value);
        //     const today = new Date();
        //     const year = today.getFullYear();
        //     const month = String(today.getMonth() + 1).padStart(2, "0");
        //     const day = String(today.getDate()).padStart(2, "0");
        //     const mitra = value.split(" ").pop();
        //     const generateUserId = `${mitra}${year}${month}${fountData.length + 1}`;

        //     if (foundData) {
        //         setFormData(prev => ({
        //             ...prev,
        //             ...foundData,
        //             userId: generateUserId,
        //             name: "",
        //             email: "",
        //             phone: 0
        //         }));
        //     }
        //     return;
        // }
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            return updated;
        });
    };


    const handleMitraChange = (field, value) => {
        setSelectedMitra(value);
        const foundData = userMitraList.filter(item => item.mitra_id === value);
        const count = foundData.length + 1;
        const paddedCount = String(count).padStart(3, "0");
        const today = new Date();
        const year = today.getFullYear();
        //const month = String(today.getMonth() + 1).padStart(2, "0");
        //const day = String(today.getDate()).padStart(2, "0");
        const mitraCode = value || "";
        const generateUserId = `${mitraCode}${year}${paddedCount}`;

        if (foundData) {
            setFormData(prev => ({
                ...prev,
                ...foundData,
                userId: generateUserId,
                mitra: value,
                name: "",
                email: "",
                phone: 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const validateForm = () => {
        const { phone, name } = formData;

        if (phone.length > 13) {
            toast.error("Input No.Telp cannot exceed 13 characters.");
            return false;
        }
        if (name.length > 256) {
            toast.error("Input Name cannot exceed 256 characters.");
            return false;
        }
        return true;
    };
    const handleSubmit = event => {
        // debugger;
        event.preventDefault();
        if (!validateForm())
            return;
        // const existingData = JSON.parse(localStorage.getItem("dataUserMitra") || "[]");
        // const today = new Date();
        // const formattedDate = `${String(today.getDate()).padStart(2, "0")}/${String(today.getMonth() + 1).padStart(2, "0")}/${today.getFullYear()}`;

        // const newEntry = {
        //     createdDate: formattedDate,
        //     ...formData,
        //     status: "Active",
        //     statusApproval: "Submit"
        // };

        // const updatedData = [newEntry, ...existingData];
        // localStorage.setItem("dataUserMitra", JSON.stringify(updatedData));

        const bodyFormData = new FormData();
        bodyFormData.append("mitra_id", formData.mitra);
        bodyFormData.append("user_id", formData.userId);
        bodyFormData.append("role", formData.role);
        bodyFormData.append("name", formData.name);
        bodyFormData.append("email", formData.email);
        bodyFormData.append("phone", formData.phone);
        bodyFormData.append("status", "Active");
        bodyFormData.append("statusApproval", "Submitted");
        //bodyFormData.append("password", "123456");
        bodyFormData.append("created_at", Date.now());
        //bodyFormData.append("updated_at", Date.now());

        fnStoreUserMitra(bodyFormData);

    };

    // logo
    const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
    // const { email } = dataLogin;
    // const logoPath = getLogoPath(email);

    //nama mitra
    // const mitraName = getMitraName(email);
    const selectedIndex = listDataMitra.findIndex(item => item.value === formData.mitra);
    return (
        <>
            <Container fluid id="create-user-mitra-page">
                <Row>
                    <CardComponent title="Create User Mitra" type="create" needFooter>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col>
                                    <InputDropdownComponent
                                        disabled={loading}
                                        listDropdown={!transformedMitraList ? [] : [{ value: "", label: "-- " + translationData[code_lang]?.user_mitra?.create?.choose_mitra + " --" }, ...transformedMitraList]}
                                        label={translationData[code_lang]?.user_mitra?.create?.mitra}
                                        valueIndex={true}
                                        required
                                        labelXl="3"
                                        value={formData.mitra}
                                        name="mitra"
                                        onChange={e => handleMitraChange("mitra", e.target.value)}
                                        formGroupClassName="gx-3" />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputDropdownComponent
                                        disabled={listDataRole}
                                        listDropdown={!listDataRole ? [] : [{ value: "", label: "-- " + translationData[code_lang]?.user_mitra?.create?.choose_role + " --" }, ...listDataRole]}
                                        valueIndex
                                        label={translationData[code_lang]?.user_mitra?.create?.role}
                                        required
                                        labelXl="3"
                                        value={formData.role}
                                        name="role"
                                        onChange={e => handleChange("role", e.target.value)}
                                        formGroupClassName="gx-3"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputComponent
                                        disabled
                                        type="text"
                                        label={translationData[code_lang]?.user_mitra?.create?.user_id}
                                        labelXl="3"
                                        value={formData.userId}
                                        name="userId"
                                        onChange={e => handleChange("userId", e.target.value)}
                                        formGroupClassName="gx-2"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputComponent
                                        type="text"
                                        label={translationData[code_lang]?.user_mitra?.create?.name}
                                        labelXl="3"
                                        value={formData.name}
                                        name="name"
                                        onChange={e => handleChange("name", e.target.value)}
                                        formGroupClassName="gx-2"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputComponent
                                        type="text"
                                        label={translationData[code_lang]?.user_mitra?.create?.email}
                                        labelXl="3"
                                        value={formData.email}
                                        name="email"
                                        onChange={e => handleChange("email", e.target.value)}
                                        formGroupClassName="gx-2"
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <InputComponent
                                        type="number"
                                        label={translationData[code_lang]?.user_mitra?.create?.phone}
                                        labelXl="3"
                                        value={formData.phone}
                                        name="phone"
                                        onChange={e => handleChange("phone", e.target.value)}
                                        formGroupClassName="gx-2"
                                    />
                                </Col>
                            </Row>
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
