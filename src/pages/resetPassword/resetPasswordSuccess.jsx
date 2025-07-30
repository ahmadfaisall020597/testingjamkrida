import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";


const ResetPasswordSuccessPage = () => {
	const navigate = useNavigate();
	const location = useLocation();

    const role = location.state?.role || "pusat";
	const loginPath = role === "admin" ? "/login" : "/login-mitra";

	const handleLoginRedirect = () => {
		navigate(loginPath);
	};

	return (
		<Container fluid id="reset-password-success-page">
			<div className="content custom-style text-center py-4">
				<h2 className="mb-4">Password Reset Successful</h2>
				<p className="mb-4" style={{ backgroundColor: "#c4efc4", fontWeight: "normal" }}>
					Your password has been successfully reset.
					<br />
					You can now log in using your new password.
				</p>
				<div className="mt-5 pt-3">
					<button
						onClick={handleLoginRedirect}
						className="btn btn-primary"
						style={{ padding: "8px 24px" }}
					>
						Go to Login
					</button>
				</div>
			</div>
		</Container>
	);
};

export default ResetPasswordSuccessPage;
