import React, { useState, useRef, useEffect } from "react";
import { Container, Form, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import ButtonComponent from "src/components/partial/buttonComponent";
import { objectRouterPortalAdmin } from "../../utils/router/objectRouter.portalAdmin";
import { objectRouterMitra } from "../../utils/router/objectRouter.mitra";
import { fnVerifyOTP } from "./loginFn";
import { verifyOtp } from "../../utils/api/apiLogin";
import { setDataLogin, setProfileUsers, setShowLoadingScreen } from "../../utils/store/globalSlice";
import fullMenu from "../../utils/dummy/menu.json";
import { setListMenu } from "../../utils/store/globalSlice";
import { resetResentLoginOTPState } from "./loginSlice";

import { getCountNotif } from "../../utils/api/apiNotif";

const LoginOTP = () => {
	const location = useLocation();
	const dispatch = useDispatch();
	const userId = location.state?.user_id;
	const currentPath = location.state?.currentPath;

	const [otp, setOtp] = useState(Array(5).fill("")); // State untuk menyimpan 5 digit OTP
	const inputRefs = useRef([]); // Ref untuk setiap input agar bisa fokus secara otomatis
	const navigate = useNavigate(); // Untuk navigasi
	const { dataLogin } = useSelector(state => state.global); // Data yang di simpan di store
	const resentOTP =useSelector(state => state.login.resentOTP)
	const [resendTimer, setResendTimer] = useState(resentOTP); // State untuk timer hitung mundur
	const [isOtpFull, setIsOtpFull] = useState(false); // State untuk mengecek apakah OTP sudah terisi penuh
	const [isTimerActive, setIsTimerActive] = useState(true); // State untuk mengaktifkan/menonaktifkan timer
	const [errorMessage, setErrorMessage] = useState("");
	const validOTP = "12345"; // Kode otp valid

	// useEffect(() => {
	// 	setOtp(["1", "2", "3", "4", "5"]);
	// }, []);


	useEffect(() => {
		const role = localStorage.getItem("roleAfterReload");
		const redirectPath = localStorage.getItem("redirectAfterReload");

		if (role && redirectPath) {
			localStorage.removeItem("roleAfterReload");
			localStorage.removeItem("redirectAfterReload");

			navigate(redirectPath, {
				state: { refresh: true },
				replace: true,
			});
		}
	}, [navigate]);

	// useEffect untuk mengelola timer hitung mundur
	useEffect(() => {
		let timer;
		if (isTimerActive) {
			timer = setInterval(() => {
				setResendTimer(prev => {
					if (prev <= 1) {
						clearInterval(timer);
						setIsTimerActive(false);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => clearInterval(timer); // Cleanup on unmount or when isTimerActive changes
	}, [isTimerActive]);

	// useEffect untuk mengecek apakah semua input OTP sudah terisi
	useEffect(() => {
		const full = otp.every(digit => digit !== ""); // Cek apakah semua digit tidak kosong
		setIsOtpFull(full);
	}, [otp]); // Bergantung pada perubahan state otp

	const handleChange = (e, index) => {
		const value = e.target.value;

		// Hanya izinkan satu digit dan pastikan itu angka
		if (/^\d*$/.test(value) && value.length <= 1) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);

			// Pindah fokus ke input berikutnya jika ada digit yang dimasukkan
			if (value && index < 4) {
				inputRefs.current[index + 1].focus();
			}
		}
	};

	const handleKeyDown = (e, index) => {
		// Kembali ke input sebelumnya saat Backspace ditekan di input kosong
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

	const handleLoginOTP = async () => {
		// debugger;
		dispatch(setShowLoadingScreen(true));
		// Logika verifikasi OTP akan ditempatkan di sini
		if (resendTimer === 0) {
			setResendTimer(resentOTP);
			setIsTimerActive(true);
			setOtp(Array(5).fill(""));
			inputRefs.current[0].focus();
		}
		const enteredOtp = otp.join(""); // Menggabungkan array OTP menjadi string

		//Search data otp where user_id in database
		const payload = {
			user_id: userId,
			otp: enteredOtp
		}

		if (isOtpFull) {
			const currentLoginPage = currentPath == "/login-mitra"
				? "login-mitra"
				: "login";

			if (enteredOtp === validOTP) {
				let redirectPath = "";
				let selectedMenuGroups;				
					
				dispatch(setShowLoadingScreen(false));

				if (dataLogin.role === "admin") {
					redirectPath = objectRouterPortalAdmin.DashboardPagePortalAdmin.path;
					selectedMenuGroups = fullMenu.find(menu => menu.name === "Portal Admin");
				}
				else if (dataLogin.role === "mitra" || dataLogin.role === "pusat" || dataLogin.role === "cabang") {
					redirectPath = objectRouterMitra.Dashboard.path;
					selectedMenuGroups = fullMenu.find(menu => menu.name === "Mitra");
				}
				const finalMenu = selectedMenuGroups ? [selectedMenuGroups] : [];	
				dispatch(setListMenu(finalMenu));
				localStorage.setItem("roleAfterReload", dataLogin.role);
				localStorage.setItem("redirectAfterReload", redirectPath);
				console.log("localstorage:", localStorage);
				window.location.reload();

			} else if (enteredOtp !== validOTP) {
				const response = await verifyOtp(payload);
				localStorage.setItem("dataLogin", JSON.stringify(response.data));
				const token = response.data.data.token;  // misal token ada di sini
				localStorage.setItem('tkn', token);
				const validOTPfromDB = response.data.data.otp;
				dispatch(setDataLogin(response.data.data));
				dispatch(setProfileUsers(response.data.data));
				dispatch((resetResentLoginOTPState()));

				// setting pop up notif
				const response2 = await getCountNotif ({id: response.data.data.user_id});
				const count = response2.data.data.count;
				if (count > 0) {
					localStorage.setItem("showPopUpNotif", true);
				} else {
					localStorage.setItem("showPopUpNotif", false);
				}

				if (enteredOtp === validOTPfromDB) {
					let redirectPaths = "";
					let selectedMenuGroup;
					dispatch(setShowLoadingScreen(false));
					if (currentLoginPage ==="login" && (dataLogin.role === "admin" || dataLogin.role ==="pusat")) {
						redirectPaths = objectRouterPortalAdmin.DashboardPagePortalAdmin.path;
						selectedMenuGroup = fullMenu.find(menu => menu.name === "Portal Admin");
					}
					else if (currentLoginPage ==="login-mitra" && (dataLogin.role === "mitra"|| dataLogin.role === "pusat" || dataLogin.role === "cabang")) {
						redirectPaths = objectRouterMitra.Dashboard.path;
						selectedMenuGroup = fullMenu.find(menu => menu.name === "Mitra");
					}
					const finalMenu = selectedMenuGroup ? [selectedMenuGroup] : [];	
					dispatch(setListMenu(finalMenu));
					localStorage.setItem("roleAfterReload", dataLogin.role);
					localStorage.setItem("redirectAfterReload", redirectPaths);
					console.log("localstorage:", localStorage);
					window.location.reload();
				}
			} else {
				setErrorMessage("OTP Tidak Valid");
				console.log("OTP Tidak Valid");
			}
		} else {
			setErrorMessage("OTP Belum Penuh");
			console.log("OTP Belum Penuh");
			// Jika tombol ditekan saat OTP belum penuh, ini berarti fungsi resend
			if (resendTimer === 0) {
				// Logika untuk mengirim ulang OTP
				console.log("Mengirim ulang OTP...");
				setResendTimer(resentOTP); // Reset timer
				setIsTimerActive(true); // Aktifkan kembali timer
				setOtp(Array(5).fill("")); // Kosongkan input OTP
				inputRefs.current[0].focus(); // Fokuskan kembali ke input pertama
			}
		}
	};



	const getButtonTitle = () => {
		if (isOtpFull) {
			return "Login";
		} else if (resendTimer > 0) {
			return `Resend OTP in (${resendTimer}s)`;
		} else {
			return "Resend OTP";
		}
	};

	return (
		<Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
			<div className="p-5 border rounded" style={{ backgroundColor: "white", width: "500px" }}>
				<h5 className="text-center mb-4">Enter OTP</h5>
				<Form>
					<Form.Group controlId="otp-input-group">
						<Row className="justify-content-center">
							{otp.map((digit, index) => (
								<Col xs={2} key={index} className="px-1">
									<Form.Control
										type="text" // Gunakan 'text' agar bisa membatasi input ke 1 digit
										maxLength="1"
										value={digit}
										onChange={e => handleChange(e, index)}
										onKeyDown={e => handleKeyDown(e, index)}
										className="text-center fw-bold" // Pusatkan teks dan tebalkan
										style={{
											width: "40px", // Lebar kotak input
											height: "40px", // Tinggi kotak input
											fontSize: "1.2rem", // Ukuran font digit
											border: "1px solid #ced4da", // Border standar Bootstrap
											borderRadius: ".25rem" // Sudut membulat standar Bootstrap
										}}
										ref={el => (inputRefs.current[index] = el)} // Tetapkan ref
									/>
								</Col>
							))}
						</Row>
						{errorMessage && <div className="text-center text-danger mt-3">{errorMessage}</div>}
					</Form.Group>
					<div className="d-flex justify-content-center mt-3">
						<ButtonComponent onClick={handleLoginOTP} title={getButtonTitle()} disabled={!isOtpFull && resendTimer > 0} />
					</div>
				</Form>
			</div>
		</Container>
	);
};

export default LoginOTP;
