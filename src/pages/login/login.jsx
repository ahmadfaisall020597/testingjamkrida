/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import { setDataLogin } from "src/utils/store/globalSlice";
import { z } from "zod";
import { getLogoPath } from "src/utils/getLogoByEmail";
import jamkrindsaLogo from "src/assets/image/logo-jamkrida-jkt.png";
import { loginAdmin, loginUserMitra } from "../../utils/api/apiLogin";
import { setProfileUsers, setShowLoadingScreen } from "../../utils/store/globalSlice";
import { fnGetlistSettingGeneralLogin, fnGetResentOTPValue } from "./loginFn";
import { getLanguage } from "../../utils/api/apiGlobal";
import { fnGetLanguage } from "../language/languageFn";
import { saveAuthToken } from "../../utils/localStorage";
const loginSchema = z.object({
	email: z.string().email("Format email tidak valid").min(1, "Email tidak boleh kosong"),
	password: z.string().min(6, "Password minimal 6 karakter").min(1, "Password tidak boleh kosong")
});

const languageOptions = [
	{ code: 'id', label: 'Bahasa Indonesia' },
	{ code: 'en', label: 'English' },
];

const Login = () => {
	const [language, setLanguage] = useState('id');
	const [translationData, setTranslationData] = useState(null);
	const dispatch = useDispatch();
	// navigasi
	const navigate = useNavigate();

	useEffect(() => {
		const savedLang = localStorage.getItem('selectedLanguage');
		if (savedLang) {
			setLanguage(savedLang);
		}
		const stored = localStorage.getItem('translation_data');
		if (stored) {
			const parsed = JSON.parse(stored);
			const langKey = Object.keys(parsed)[0];
			setTranslationData(parsed[langKey]);
		}
	}, []);

	const handleChangeLanguage = (langCode) => {
		dispatch(fnGetLanguage(langCode));
	};

	useEffect(() => {
		const loginData = localStorage.getItem("dataLogin");
		if (loginData) {
			navigate("/");
		}
	}, []);

	useEffect(() => {
		fnGetlistSettingGeneralLogin(dispatch)
	}, [dispatch]);

	// State untuk menyimpan nilai input
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// State untuk menyimpan error validasi
	const [errors, setErrors] = useState({});
	// State untuk menyimpan error kredensial (jika email/password tidak cocok dengan dummy)
	const [credentialError, setCredentialError] = useState("");

	const dummyAccountMitra = [
		{
			email: "mitralogin@bsi.com",
			password: "loginmitra"
		},
		{
			email: "mitra2@dki.com",
			password: "loginmitra"
		},
		{
			email: "mitra3@bjk.com",
			password: "loginmitra"
		}
	];

	const dummyAccountAdmin = {
		email: "adminlogin@gmail.com",
		password: "loginadmin"
	};

	const cleanNullFromDataUser = () => {
		const saved = localStorage.getItem("dataUser");
		if (!saved) return;

		try {
			let data = JSON.parse(saved);
			if (!Array.isArray(data)) return;
			data = data.filter(user => user !== null);
			localStorage.setItem("dataUser", JSON.stringify(data));
		} catch (err) {
			console.error("Gagal membersihkan dataUser:", err);
		}
	};

	const getUserByEmailAndPassword = (email, password) => {
		try {
			const data = JSON.parse(localStorage.getItem("dataUser")) || [];
			return data.find(user => user?.email === email && user?.password === password) || null;
		} catch {
			return null;
		}
	};

	const checkDummyMitra = (email, password) => {
		return dummyAccountMitra.find(mitra => mitra.email === email && mitra.password === password);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		dispatch(setShowLoadingScreen(true));
		const formData = { email, password };

		try {
			// ✅ Validasi menggunakan Zod
			loginSchema.parse(formData);
			setErrors({});
			setCredentialError("");
			console.log("Login data valid:", formData);
			const payload = {
				email: formData.email,
				password: formData.password
			}

			const isDummyAdmin = formData.email === dummyAccountAdmin.email && formData.password === dummyAccountAdmin.password;
			// const isDummyMitra = formData.email === dummyAccountMitra.email && formData.password === dummyAccountMitra.password;
			const foundMitra = checkDummyMitra(formData.email, formData.password);

			let userData = null;

			if (isDummyAdmin) {

				const dummyToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
					+ "eyJ1c2VyIjoiYWRtaW4iLCJyb2xlIjoiYWRtaW4ifQ."
					+ "dXNlckFkbWluU2lnbmF0dXJl";
				saveAuthToken(dummyToken);
				console.log("Login Admin Berhasil");
				userData = {
					email: dummyAccountAdmin.email,
					user_id: "admin",
					password: dummyAccountAdmin.password,
					role: "admin"
				};
			} else if (foundMitra) {
				console.log("Login Mitra Berhasil:", foundMitra.name);
				userData = {
					email: foundMitra.email,
					password: foundMitra.password,
					role: "mitra"
				};
			}
			else if (!foundMitra) {
				const response = await loginAdmin(payload);
				console.log("response login :", response);
				localStorage.setItem("dataUser", JSON.stringify(response.data.data));
				console.log("Login User Mitra Berhasil:", response.data.data.user_id);
				fnGetResentOTPValue(dispatch, response.data.data.resentOTP);
				userData = {
					user_id: response.data.data.user_id,
					email: response.data.data.email,
					password: response.data.data.password,
					role: response.data.data.role
				};
				console.log("userData :", userData);
			}
			else {
				// ✅ Cek user dari localStorage
				cleanNullFromDataUser();
				const localUser = getUserByEmailAndPassword(email, password);
				if (localUser) {
					console.log("Login Mitra dari localStorage");
					userData = {
						email: localUser.email,
						password: localUser.password,
						role: "mitra"
					};
				}
			}
			if (userData) {
				localStorage.setItem("dataLogin", JSON.stringify(userData));
				dispatch(setDataLogin(userData));
				dispatch(setProfileUsers(userData));
				const selectedLang = localStorage.getItem("selectedLanguage");
				if (!selectedLang) {
					localStorage.setItem("selectedLanguage", "id");
					const res = await getLanguage("id");
					localStorage.setItem("translation_data", JSON.stringify({ id: res.data }));
				}
				dispatch(setShowLoadingScreen(false));
				//navigate("/login-otp");
				navigate("/login-otp", {
					state: {
						user_id: userData.user_id,
					} //
				});
				return;
			}
			//  Jika tidak ditemukan
			setCredentialError("Email atau password salah.");
			console.warn("Kredensial tidak cocok dengan akun yang tersedia.");
		} catch (err) {
			// Validasi Zod gagal
			if (err instanceof z.ZodError) {
				const newErrors = {};
				err.errors.forEach(e => {
					if (e.path?.[0]) {
						newErrors[e.path[0]] = e.message;
					}
				});
				setErrors(newErrors);
				console.error("Login validation errors:", newErrors);
			} else {
				console.error("Unexpected error during login:", err);
			}
		}
	};

	const handleChange = e => {
		const { name, value } = e.target;
		if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
		// Bersihkan error kredensial saat input berubah
		if (credentialError) {
			setCredentialError("");
		}
	};
	const handleNavigatetoForgotPassword = e => {
		navigate("/resend-email-admin", {
			state: {
				currentPath: location.pathname
			}
		});
		console.log("currentPath : ", location.pathname);
	};
	const handleNavigatetoRegisterAdmin = e => {
		navigate("/register-admin", {
					state: {
						currentPath: location.pathname
					}
				});
		console.log("currentPath : ", location.pathname);
	};
	const logoPath = getLogoPath(email);

	return (
		<Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
			<div className="p-4 border rounded shadow-sm" style={{ backgroundColor: "white", width: "400px" }}>
				<div className="d-flex justify-content-end mb-3">
					<select
						className="form-select w-auto"
						style={{ minWidth: '180px', paddingRight: '2rem' }}
						onChange={(e) => handleChangeLanguage(e.target.value)}
						value={language}
					>
						{languageOptions.map((option) => (
							<option key={option.code} value={option.code}>
								{option.label}
							</option>
						))}
					</select>
				</div>
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
					<h4 className="text-dark mb-0">{
						translationData?.login?.text1 ||
						translationData?.login?.text1 ||
						'Masuk'}</h4>
					<p className="text-muted small">{
						translationData?.login?.text2 ||
						translationData?.login?.text2 ||
						'Masuk ke Akun Anda'}</p>
				</div>

				<Form onSubmit={handleLogin}>
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
								placeholder="Masukkan email Anda"
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
						{errors.email && <Form.Text className="text-danger">{errors.email}</Form.Text>}
					</Form.Group>
					<Form.Group className="mb-3">
						<Form.Label>Password</Form.Label>
						<Form.Control type="password" name="password" value={password} onChange={handleChange} placeholder="Masukkan password Anda" className={errors.password ? "is-invalid" : ""} />
						{errors.password && <Form.Text className="text-danger">{errors.password}</Form.Text>}
					</Form.Group>
					<div className="text-center">
						<small className="text-muted">
							<a href="" className="text-primary" onClick={handleNavigatetoForgotPassword}>
								Forgot Password ?
							</a>
						</small>
					</div>
					<br />
					{credentialError && <div className="alert alert-danger text-center py-2 mb-3">{credentialError}</div>}

					<div className="d-grid mb-3">
						<ButtonComponent
							title={
								translationData?.login?.text1 ||
								translationData?.login?.text1 ||
								'Masuk'}
							type="submit" className="btn btn-primary d-flex justify-content-center align-items-center" />
					</div>

					<div className="text-center">
						<small className="text-muted">
							Belum punya akun?{" "}
							<a href="" className="text-primary" onClick={handleNavigatetoRegisterAdmin}>
								Daftar di sini
							</a>
						</small>
					</div>
				</Form>
			</div>
		</Container>
	);
};

export default Login;
