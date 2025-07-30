import React, { useState, useEffect } from "react";
import { Form, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import { getLogoPath } from "src/utils/getLogoByEmail";
import jamkrindsaLogo from "src/assets/image/logo-jamkrida-jkt.png";
import { useParams } from "react-router";
import axios from "axios";
import { fnResetPasword } from "./resetPasswordFn";
import { toast } from "react-toastify";

const ResetPassword = () => {
    // navigasi
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const role = queryParams.get("role");
    const { key } = useParams();
    const [isValidLink, setIsValidLink] = useState(false);
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    // State untuk menyimpan error validasi
    const [errors, setErrors] = useState({});
    // State untuk menyimpan error kredensial (jika email/password tidak cocok dengan dummy)
    const [credentialError, setCredentialError] = useState("");
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    
    useEffect(() => {
        const validateKey = async () => {
            try {
                const uuid = key.split('key=')[1];
                const res = await axios.get(`http://localhost:8000/api/reset-password/validate/${uuid}`);
                if (res.data.success) {
                    setIsValidLink(true);
                    setUserId(res.data.user_id);
                    setEmail(res.data.email);
                }
            } catch (err) {
                setError("Link tidak valid atau sudah kadaluarsa.");
            }
        };
        validateKey();
    }, [key]);

    const handleChange = e => {
        const { name, value } = e.target;
        if (name === "password") {
            setPassword(value);
        }
        else if (name === "confirmPassword") {
            setConfirmPassword(value);
        }
        // Bersihkan error kredensial saat input berubah
        if (credentialError) {
            setCredentialError("");
        }
    };

    // const logoPath = getLogoPath(email);
    const logoPath ="";
    

    const handleSubmit = async (e) => {
        // debugger;
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (password !== confirmPassword) {
            toast.error("Password do not match.");
            return;
        }
        else if (!passwordRegex.test(password)) {
            toast.error("Password must contain at least one uppercase letter, one number, and one symbol.");
            return;
        }

        const payload = {
            user_id: userId,
            password: password,
            password_confirmation: confirmPassword
        }
        //console.log("payload :", payload);
        fnResetPasword(payload, role);
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="p-4 border rounded shadow-sm" style={{ backgroundColor: "white", width: "400px" }}>
                <div className="text-center mb-4">
                    <img
                        src={jamkrindsaLogo}
                        alt="Jamkrida Jakarta Logo"
                        style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "contain",
                            marginBottom: "10px"
                        }}
                    />
                    <h4 className="text-dark mb-0">Reset Password</h4>
                    <p className="text-muted small">Registrasi Akun Anda</p>
                    {!isValidLink && <p style={{ color: "red" }}>{error}</p>}
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <div style={{ position: "relative" }}>
                            <Form.Control
                                readOnly
                                type="email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                className={errors.email ? "is-invalid" : ""}
                                style={{ paddingRight: logoPath ? "40px" : undefined }}
                                placeholder="Email Anda"
                            />
                            {logoPath && (
                                <img
                                    src={logoPath}
                                    alt="Logo"
                                    style={{
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        width: "20px",
                                        height: "20px",
                                        objectFit: "contain"
                                    }}
                                />
                            )}
                        </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>User ID</Form.Label>
                        <Form.Control
                            readOnly
                            type="user_id"
                            name="user_id"
                            value={userId}
                            onChange={handleChange}
                            className={errors.user_id ? "is-invalid" : ""}
                            style={{ paddingRight: logoPath ? "40px" : undefined }}
                            placeholder="User ID Anda"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" name="password" value={password} onChange={handleChange} placeholder="Masukkan password baru anda" className={errors.password ? "is-invalid" : ""} />
                        {error.password && <Form.Text className="text-danger">{error.password}</Form.Text>}
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Reconfirm Password</Form.Label>
                        <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={handleChange} placeholder="Masukkan kembali password baru anda" className={errors.confirmPassword ? "is-invalid" : ""} />
                        {error.confirmPassword && <Form.Text className="text-danger">{error.confirmPassword}</Form.Text>}
                    </Form.Group>

                    {credentialError && <div className="alert alert-danger text-center py-2 mb-3">{credentialError}</div>}

                    <div className="d-grid mb-3">
                        <ButtonComponent type="submit" title="Reset Password" className="btn btn-primary d-flex justify-content-center align-items-center" />
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default ResetPassword;
