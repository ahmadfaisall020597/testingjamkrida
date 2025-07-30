import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import { useEffect, useState } from "react";
import CardComponent from "../../components/partial/cardComponent";
import { getLogoPath } from "src/utils/getLogoByEmail";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { fnStoreRegister } from "./registerFn";
import { getlistmitra } from "../../utils/api/apiSettings";
import { getEntitasName, getMitraName } from "../../utils/getLogoByEmail";
import { getlistUserMitra } from "../../utils/api/apiUserMitra";

const RegisterFormMitraPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.state?.currentPath;
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [userMitraList, setUserMitraList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        name: "",
        password: "",
        confirmPassword: "",
        agree: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const logoPath = getLogoPath(formData.email);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);


    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: ""
    });

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^(\+?\d{1,4}[\s-])?(\(?\d{1,4}\)?[\s-])?[\d\s-]{7,15}$/;

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    useEffect(() => {
        console.log("currentPath :", currentPath);
    }, []);
    useEffect(() => {
        fetchMitraData();
    }, []); // fetch once on mount

    const fetchMitraData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getlistUserMitra();
            if (Array.isArray(response.data)) {
                setUserMitraList(response.data);
                console.log("mitraList :", userMitraList);
            } else {
                console.error("Response data is not an array:", response.data);
                setError("Format data tidak valid");
                setUserMitraList([]);
            }
        } catch (err) {
            console.error("Error fetching mitra data:", err);
            setError("Gagal memuat data mitra");
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = () => {
        // debugger;
        let newErrors = {};
        const currentLoginPage = currentPath == "/login-mitra"
            ? "login-mitra"
            : "login";

        if (!passwordRegex.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter, one number, and one symbol.";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match.";
        }
        if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address.";
        }
        if (!formData.agree) {
            newErrors.agree = "You must agree to the terms before submitting.";
        }
        if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number.";
        }
        //nama mitra
        //const mitraName = getMitraName(formData.email);

        //nama entitas
        const entityName = getEntitasName(formData.email);
        console.log("entityName :", entityName);
        const foundData = userMitraList.filter(item => item.mitra_id === entityName);
        const count = foundData.length + 1;
        const paddedCount = String(count).padStart(3, "0");
        const today = new Date();
        const year = today.getFullYear();
        const mitraCode = entityName || "";
        const generateUserId = `${mitraCode}${year}${paddedCount}`;

        if (Object.keys(newErrors).length === 0) {
            event.preventDefault();

            const bodyFormData = new FormData();
            bodyFormData.append("mitra_id", mitraCode);
            bodyFormData.append("user_id", generateUserId);
            if (currentLoginPage === "login-mitra") {
                bodyFormData.append("role", "pusat");
            } else if (currentLoginPage === "login") {
                bodyFormData.append("role", "admin");
            } else {
                bodyFormData.append("role", "");
            }
            bodyFormData.append("name", formData.name);
            bodyFormData.append("email", formData.email);
            bodyFormData.append("phone", formData.phone);
            bodyFormData.append("password", formData.password);
            bodyFormData.append("password_confirmation", formData.confirmPassword);
            bodyFormData.append("status", "Active");
            bodyFormData.append("statusApproval", "Submitted");

            fnStoreRegister(bodyFormData);

        } else {
            setErrors(newErrors);
        }
    };

    const saveDataRegister = newUser => {
        // Validasi: semua field wajib diisi
        // if (!newUser || typeof newUser !== "object" || !newUser.username || !newUser.email || !newUser.password || !newUser.role) {
        // 	alert("Semua field (username, email, password, role) wajib diisi!");
        // 	return;
        // }

        // Ambil data user yang sudah tersimpan di localStorage
        const savedDataString = localStorage.getItem("dataUser");
        let savedDataArray = [];

        if (savedDataString) {
            try {
                savedDataArray = JSON.parse(savedDataString);
                if (!Array.isArray(savedDataArray)) {
                    savedDataArray = [];
                }
            } catch (e) {
                console.error("Gagal parse dataUser:", e);
                savedDataArray = [];
            }
        }

        // Validasi: email tidak boleh duplikat
        const isEmailExist = savedDataArray.some(user => user.email === newUser.email);
        if (isEmailExist) {
            alert("Email sudah terdaftar.");
            return;
        }

        // Simpan user baru
        savedDataArray.push(newUser);
        localStorage.setItem("dataUser", JSON.stringify(savedDataArray));

        console.log("User berhasil disimpan:", newUser);
        return;
    };

    const registerSubmitSuccess = () => {
        navigate("/register-submit-success");
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
            <div className="p-5 border rounded" style={{ backgroundColor: "white", width: "500px" }}>
                {/* Logo Header - Sesuai dengan design login */}
                <div className="text-center mb-4">
                    {logoPath && (
                        <img
                            src={logoPath}
                            alt="Jamkrida Logo"
                            style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "contain",
                                marginBottom: "10px"
                            }}
                        />
                    )}
                    <h4 className="text-primary fw-bold">Daftar Akun Baru</h4>
                    <p className="text-muted">Silakan lengkapi data berikut untuk membuat akun</p>
                </div>

                <Form onSubmit={handleSubmit}>
                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Form.Label column sm="3">
                            Email
                        </Form.Label>
                        <Col sm="9">
                            <div style={{ position: "relative" }}>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    isInvalid={!!errors.email}
                                    placeholder="Masukkan email Anda"
                                />
                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                            </div>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPhone">
                        <Form.Label column sm="3">
                            No. Telepon
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                isInvalid={!!errors.phone}
                                placeholder="Masukkan nomor telepon"
                            />
                            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextName">
                        <Form.Label column sm="3">
                            Nama Lengkap
                        </Form.Label>
                        <Col sm="9">
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                isInvalid={!!errors.name}
                                placeholder="Masukkan nama lengkap"
                            />
                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextPassword">
                        <Form.Label column sm="3">Kata Sandi</Form.Label>
                        <Col sm="9">
                            <div style={{ position: "relative" }}>
                                <Form.Control
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    isInvalid={!!errors.password}
                                    style={{ paddingRight: "40px", height: "calc(1.5em + .75rem + 2px)" }}
                                    placeholder="Masukkan kata sandi"
                                />
                                <span
                                    onClick={togglePasswordVisibility}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#6c757d"
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                            </div>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextConfirm">
                        <Form.Label column sm="3">Konfirmasi Kata Sandi</Form.Label>
                        <Col sm="9">
                            <div style={{ position: "relative" }}>
                                <Form.Control
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    isInvalid={!!errors.confirmPassword}
                                    style={{ paddingRight: "40px", height: "calc(1.5em + .75rem + 2px)" }}
                                    placeholder="Konfirmasi kata sandi"
                                />
                                <span
                                    onClick={toggleConfirmPasswordVisibility}
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#6c757d"
                                    }}
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                                <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
                            </div>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-4" controlId="formPlaintextAgree">
                        <Col sm="3"></Col>
                        <Col sm="9">
                            <Form.Check
                                type="checkbox"
                                label="Saya menyetujui syarat dan ketentuan yang berlaku"
                                name="agree"
                                checked={formData.agree}
                                onChange={handleChange}
                                isInvalid={!!errors.agree}
                            />
                            <Form.Control.Feedback type="invalid">{errors.agree}</Form.Control.Feedback>
                        </Col>
                    </Form.Group>

                    <div className="d-grid mb-3">
                        <ButtonComponent
                            type="submit"
                            title="Daftar"
                            className="btn btn-primary d-flex justify-content-center align-items-center"
                            disabled={!formData.agree}
                        />
                    </div>

                    <div className="text-center">
                        <span className="text-muted">Sudah memiliki akun? </span>
                        <a href="/login" className="text-primary text-decoration-none fw-bold">
                            Masuk di sini
                        </a>
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default RegisterFormMitraPage;
