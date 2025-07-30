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
import { loginUserMitra } from "../../utils/api/apiLogin";
import { setShowLoadingScreen } from "../../utils/store/globalSlice";
import { fnGetResentOTPValue } from "./loginFn";
import { toast } from "react-toastify";
import { getLanguage } from "../../utils/api/apiGlobal";
const loginSchema = z.object({
	//email: z.string().email("Format email tidak valid").min(1, "Email tidak boleh kosong"),
	user_id: z.string().min(1, "User ID tidak boleh kosong"),
	password: z.string().min(6, "Password minimal 6 karakter").min(1, "Password tidak boleh kosong")
});


const languageOptions = [
	{ code: 'id', label: 'Bahasa Indonesia' },
	{ code: 'en', label: 'English' },
];

const LoginMitra = () => {
	// navigasi
	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {

		const loginData = localStorage.getItem("dataLogin");
		if (loginData) {
			navigate("/");
		}
	}, [navigate]);

	// State untuk menyimpan nilai input
	const [email, setEmail] = useState("");
	const [user_id, setUserId] = useState("");
	const [password, setPassword] = useState("");
	const [language, setLanguage] = useState('id');
	const [translationData, setTranslationData] = useState(null);
	// State untuk menyimpan error validasi
	const [errors, setErrors] = useState({});

	// State untuk menyimpan error kredensial (jika email/password tidak cocok dengan dummy)
	const [credentialError, setCredentialError] = useState("");

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
		getLanguage(langCode)
			.then((res) => {
				const translationData = res.data;

				localStorage.setItem('selectedLanguage', langCode);
				localStorage.setItem('translation_data', JSON.stringify({ [langCode]: translationData }));

				window.location.reload();
			})
			.catch((err) => {
				console.error('Gagal memuat bahasa:', err);
			});
	};

	const dummyAccountMitra = [
		{
			email: "mitralogin@bsi.com",
			user_id: "mitralogin",
			password: "loginmitra"
		},
		{
			email: "mitra2@dki.com",
			user_id: "mitra2",
			password: "loginmitra"
		},
		{
			email: "mitra3@bjk.com",
			user_id: "mitra3",
			password: "loginmitra"
		}
	];

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

	const checkDummyMitra = (user_id, password) => {
		return dummyAccountMitra.find(mitra => mitra.user_id === user_id && mitra.password === password);
	};

	const handleLogin = async (e) => {
		e.preventDefault();
		dispatch(setShowLoadingScreen(true));
		const formData = { user_id, password };

		try {
			// ✅ Validasi menggunakan Zod
			loginSchema.parse(formData);
			setErrors({});
			setCredentialError("");
			console.log("Login data valid:", formData);
			const payload = {
				user_id: formData.user_id,
				password: formData.password
			}
			const foundMitra = checkDummyMitra(formData.user_id, formData.password);

			let userData = null;

			if (foundMitra) {
				console.log("Login Mitra Berhasil:", foundMitra.name);
				userData = {
					user_id: foundMitra.user_id,
					password: foundMitra.password,
					role: "mitra"
				};
			}
			else if (!foundMitra) {
				const response = await loginUserMitra(payload);

				localStorage.setItem("dataUser", JSON.stringify(response.data.data));
				console.log("Login User Mitra Berhasil:", response);
				console.log("Resent OTP:", response.data.data.resentOTP);
				fnGetResentOTPValue(dispatch, response.data.data.resentOTP);
				userData = {
					user_id: response.data.data.user_id,
					email: response.data.data.email,
					password: response.data.data.password,
					role: response.data.data.role
				};
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
				const selectedLang = localStorage.getItem("selectedLanguage");
				if (!selectedLang) {
					localStorage.setItem("selectedLanguage", "id");
					const res = await getLanguage("id");
					localStorage.setItem("translation_data", JSON.stringify({ id: res.data }));
				}
				dispatch(setShowLoadingScreen(false));
				navigate("/login-otp", {
					state: {
						user_id: userData.user_id,
						currentPath: location.pathname
					}
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
				dispatch(setShowLoadingScreen(false));
			} else {
				dispatch(setShowLoadingScreen(false));
				console.error("Unexpected error during login:", err);
				toast.error(err.response.data.message);
			}
		}
	};

	const handleChange = e => {
		const { name, value } = e.target;
		if (name === "user_id") {
			setUserId(value);
		} else if (name === "password") {
			setPassword(value);
		}
		// Bersihkan error kredensial saat input berubah
		if (credentialError) {
			setCredentialError("");
		}
	};

	const handleNavigatetoForgotPassword = e => {
		navigate("/resend-email-mitra", {
					state: {
						currentPath: location.pathname
					}
				});
		console.log("currentPath : ", location.pathname);
	};
	const handleNavigatetoRegisterMitra = e => {
		navigate("/register-mitra", {
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
						'Masuk'
					}</h4>
					<p className="text-muted small">{
						translationData?.login?.text2 ||
						translationData?.login?.text2 ||
						'Masuk ke Akun Anda'}</p>
				</div>

				<Form onSubmit={handleLogin}>
					<Form.Group className="mb-3">
						<Form.Label>User ID</Form.Label>
						<div style={{ position: "relative" }}>
							<Form.Control
								type="text"
								name="user_id"
								value={user_id}
								onChange={handleChange}
								className={errors.user_id ? "is-invalid" : ""}
								style={{ paddingRight: logoPath ? "40px" : undefined }}
								placeholder="Masukkan User ID Anda"
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
						{errors.user_id && <Form.Text className="text-danger">{errors.user_id}</Form.Text>}
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
					<br/>
					{credentialError && <div className="alert alert-danger text-center py-2 mb-3">{credentialError}</div>}

					<div className="d-grid mb-3">
						<ButtonComponent
							title={
								translationData?.login?.text1 ||
								translationData?.login?.text1 ||
								'Masuk'
							}
							type="submit"
							className="btn btn-primary d-flex justify-content-center align-items-center"
						/>
					</div>
					<div className="text-center">
						<small className="text-muted">
							Belum punya akun?{" "}
							<a href="" onClick={handleNavigatetoRegisterMitra} className="text-primary">
								Daftar di sini
							</a>
						</small>
					</div> 
				</Form>
			</div>
		</Container>
	);
};

export default LoginMitra;
