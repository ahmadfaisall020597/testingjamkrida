import React, { useState, useEffect } from "react";
import { Form, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import { getLogoPath } from "src/utils/getLogoByEmail";
import jamkrindsaLogo from "src/assets/image/logo-jamkrida-jkt.png";
import { useParams } from "react-router";
import axios from "axios";
import { toast } from "react-toastify";
import { fnResendEmailforResetPasword } from "./resendEmailforResetPasswordFn";

const ResendEmailforResetPassword = () => {
    // navigasi
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const currentPath = location.state?.currentPath;
    const { key } = useParams();
    const [isValidLink, setIsValidLink] = useState(false);
    const [userId, setUserId] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    // State untuk menyimpan error validasi
    const [errors, setErrors] = useState({});
    // State untuk menyimpan error kredensial (jika email/password tidak cocok dengan dummy)
    const [credentialError, setCredentialError] = useState("");

    useEffect(() => {
        console.log("currentPath :", currentPath);
    }, []);


    const handleChange = e => {
        const { name, value } = e.target;
        if (name === "user_id") {
            setUserId(value);
        }
        else if (name === "email") {
            setEmail(value);
        }
        // Bersihkan error kredensial saat input berubah
        if (credentialError) {
            setCredentialError("");
        }
    };

    // const logoPath = getLogoPath(email);
    const logoPath = "";

    const handleSubmit = async (e) => {
        // debugger;
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        const payload = {
            user_id: userId,
            email: email
        }
        fnResendEmailforResetPasword(payload);
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
                    <h4 className="text-dark mb-0">Forgot Password ?</h4>
                    <p className="text-muted small">Input your User ID and Email for reset password</p>
                    {!isValidLink && <p style={{ color: "red" }}>{error}</p>}
                </div>
                <Form.Group className="mb-3">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                        type="user_id"
                        name="user_id"
                        value={userId}
                        onChange={handleChange}
                        className={errors.user_id ? "is-invalid" : ""}
                        style={{ paddingRight: logoPath ? "40px" : undefined }}
                        placeholder="User ID Anda"
                    />
                </Form.Group>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <div style={{ position: "relative" }}>
                            <Form.Control
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
                    {credentialError && <div className="alert alert-danger text-center py-2 mb-3">{credentialError}</div>}

                    <div className="d-grid mb-3">
                        <ButtonComponent type="submit" title="Resend Email" className="btn btn-primary d-flex justify-content-center align-items-center" />
                    </div>
                </Form>
            </div>
        </Container>
    );
};

export default ResendEmailforResetPassword;
