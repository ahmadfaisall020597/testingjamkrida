import { Card, Container, Row, Col, Badge, ProgressBar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CardComponent from "src/components/partial/cardComponent";
import { FaUsers, FaShieldAlt, FaFileInvoiceDollar, FaChartLine, FaEye, FaUsersCog } from "react-icons/fa";
import StatCard from "src/components/partial/statCardComponent";
import QuickActionCard from "src/components/partial/quickActionCard";
import { getLogoPath, getMitraName } from "../../utils/getLogoByEmail";

const DashboardPagePortalAdmin = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	// const { listData } = useSelector(state => state.default);
	const { profileUsers } = useSelector(state => state.global);
	const fullName = profileUsers?.fullName || "";

	//
	const { translationData } = useSelector(state => state.language);
	const code_lang = useSelector(state => state.language.selectedLanguage);
	console.log("translate data: ", translationData[code_lang]);

	const dashboardData = {
		mitra: {
			total: 1250,
			active: 1180,
			inactive: 70,
			growth: 12.5
		},
		penjaminan: {
			total: 8750,
			approved: 7200,
			pending: 1100,
			rejected: 450,
			growth: 8.3
		},
		claim: {
			total: 2340,
			processed: 1890,
			pending: 320,
			rejected: 130,
			growth: -2.1
		}
	};
	// logo
	const dataLogin = JSON.parse(localStorage.getItem("dataLogin") || "{}");
	console.log("dataLogin :", dataLogin);
	// const mitra_id  = dataLogin.data.mitra_id;

	// const logoPath = getLogoPath(mitra_id);

	//nama mitra
	// const mitraName = getMitraName(mitra_id);
	return (
		<Container fluid id="dashboard-page-portal-admin" className="py-4">
			<CardComponent type="index">
				<div className="content custom-style">
					<Row className="mb-4">
						<Col>
							<div className="welcome-section p-4 bg-gradient-primary text-white rounded">
								<h4 className="mb-2"> {translationData[code_lang]?.home?.welcome}, {fullName}</h4>
							</div>
						</Col>
					</Row>

					{/* <Row className="mb-4 g-3">
						<Col lg={4} md={6}>
							<StatCard
								title="Total Mitra"
								value={dashboardData.mitra.total}
								subtitle={`${dashboardData.mitra.active} Aktif • ${dashboardData.mitra.inactive} Tidak Aktif`}
								icon={<FaUsers size={24} />}
								color="primary"
								growth={dashboardData.mitra.growth}
								// onClick={() => navigate("/mitra")}
							/>
						</Col>
						<Col lg={4} md={6}>
							<StatCard
								title="Total Penjaminan"
								value={dashboardData.penjaminan.total}
								subtitle={`${dashboardData.penjaminan.approved} Disetujui • ${dashboardData.penjaminan.pending} Pending`}
								icon={<FaShieldAlt size={24} />}
								color="success"
								growth={dashboardData.penjaminan.growth}
								// onClick={() => navigate("/penjaminan")}
							/>
						</Col>
						<Col lg={4} md={6}>
							<StatCard
								title="Total Claim"
								value={dashboardData.claim.total}
								subtitle={`${dashboardData.claim.processed} Diproses • ${dashboardData.claim.pending} Pending`}
								icon={<FaFileInvoiceDollar size={24} />}
								color="warning"
								growth={dashboardData.claim.growth}
								// onClick={() => navigate("/claim")}
							/>
						</Col>
					</Row> */}

					{/* <Row className="mb-4 g-3">
						<Col lg={4}>
							<Card className="h-100 shadow-sm border-0">
								<Card.Header className="bg-primary text-white">
									<h6 className="mb-0">
										<FaUsers className="me-2" />
										Status Mitra
									</h6>
								</Card.Header>
								<Card.Body>
									<div className="mb-3">
										<div className="d-flex justify-content-between mb-1">
											<small>Mitra Aktif</small>
											<small>{dashboardData.mitra.active}</small>
										</div>
										<ProgressBar variant="success" now={(dashboardData.mitra.active / dashboardData.mitra.total) * 100} className="mb-2" style={{ height: "6px" }} />
									</div>
									<div className="mb-3">
										<div className="d-flex justify-content-between mb-1">
											<small>Mitra Tidak Aktif</small>
											<small>{dashboardData.mitra.inactive}</small>
										</div>
										<ProgressBar variant="danger" now={(dashboardData.mitra.inactive / dashboardData.mitra.total) * 100} className="mb-2" style={{ height: "6px" }} />
									</div>
									<button
										className="btn btn-outline-primary btn-sm w-100"
										//  onClick={() => navigate("/mitra")}
									>
										<FaEye className="me-1" /> Lihat Detail
									</button>
								</Card.Body>
							</Card>
						</Col>

						<Col lg={4}>
							<Card className="h-100 shadow-sm border-0">
								<Card.Header className="bg-success text-white">
									<h6 className="mb-0">
										<FaShieldAlt className="me-2" />
										Status Penjaminan
									</h6>
								</Card.Header>
								<Card.Body>
									<div className="mb-2">
										<div className="d-flex justify-content-between">
											<small>Disetujui</small>
											<Badge bg="success">{dashboardData.penjaminan.approved}</Badge>
										</div>
									</div>
									<div className="mb-2">
										<div className="d-flex justify-content-between">
											<small>Pending</small>
											<Badge bg="warning">{dashboardData.penjaminan.pending}</Badge>
										</div>
									</div>
									<div className="mb-3">
										<div className="d-flex justify-content-between">
											<small>Ditolak</small>
											<Badge bg="danger">{dashboardData.penjaminan.rejected}</Badge>
										</div>
									</div>
									<button
										className="btn btn-outline-success btn-sm w-100"
										// onClick={() => navigate("/penjaminan")}
									>
										<FaEye className="me-1" /> Lihat Detail
									</button>
								</Card.Body>
							</Card>
						</Col>

						<Col lg={4}>
							<Card className="h-100 shadow-sm border-0">
								<Card.Header className="bg-warning text-dark">
									<h6 className="mb-0">
										<FaFileInvoiceDollar className="me-2" />
										Status Claim
									</h6>
								</Card.Header>
								<Card.Body>
									<div className="mb-2">
										<div className="d-flex justify-content-between">
											<small>Diproses</small>
											<Badge bg="success">{dashboardData.claim.processed}</Badge>
										</div>
									</div>
									<div className="mb-2">
										<div className="d-flex justify-content-between">
											<small>Pending</small>
											<Badge bg="warning">{dashboardData.claim.pending}</Badge>
										</div>
									</div>
									<div className="mb-3">
										<div className="d-flex justify-content-between">
											<small>Ditolak</small>
											<Badge bg="danger">{dashboardData.claim.rejected}</Badge>
										</div>
									</div>

									<button
										className="btn btn-outline-warning btn-sm w-100"
										// onClick={() => navigate("/claim")}
									>
										<FaEye className="me-1" /> Lihat Detail
									</button>
								</Card.Body>
							</Card>
						</Col>
					</Row> */}

					{/* <Row className="g-3">
						<Col>
							<h5 className="mb-3"> Aksi Cepat</h5>
						</Col>
					</Row> */}
					<Row className="g-3 align-items-center justify-content-center">
						<Col lg={4} md={6}>
							<QuickActionCard
								title={translationData[code_lang]?.home?.user_mitra}
								icon={<FaUsers size={20} />}
								color="primary"
								onClick={() => navigate("/portal-admin/user-mitra")}
							/>
						</Col>
						<Col lg={4} md={6}>
							<QuickActionCard
								title={translationData[code_lang]?.home?.user}
								icon={<FaUsers size={20} />}
								color="success"
								onClick={() => navigate("/portal-admin/user")}
							/>
						</Col>
						<Col lg={4} md={6}>
							<QuickActionCard
								title={translationData[code_lang]?.home?.settings}
								icon={<FaUsersCog size={20} />}
								color="secondary"
								onClick={() => navigate("/portal-admin/settings")}
							/>
						</Col>
						{/* <Col lg={3} md={6}>
							<QuickActionCard
								title="Laporan Analytics"
								description="Lihat laporan dan statistik"
								icon={<FaChartLine size={20} />}
								color="info"
								// onClick={() => navigate("/reports")}
							/>
						</Col> */}
					</Row>
				</div>
			</CardComponent>
		</Container>
	);
};

export default DashboardPagePortalAdmin;
