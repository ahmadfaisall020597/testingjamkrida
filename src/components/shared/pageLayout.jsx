import { useEffect, useState } from "react";
import { data, Outlet, useOutlet } from "react-router"
import Header from "./header";
import Sidebar from "./sidebar";
import Footer from "./footer";
import { NavigateSetter } from "src/utils/router/navigationSetter";
import { Col, Container, Row } from "react-bootstrap";
import Breadcrumbs from "./breadCrumbs";
import ModalQuerySearch from "../partial/modalQuerySearchComponent";
import LoadingComponent from "../partial/loadingComponent";
import { useDispatch, useSelector } from "react-redux";
import ModalImageComponent from "../partial/modalImageComponent";
import ModalComponent from "../partial/modalComponent";
import { clearError } from "src/utils/store/globalSlice";
import ModalComponent2 from "../partial/modalComponent2";
import CheckPermission from "src/utils/auth/checkPermission";

const PageLayout = () => {
	const getOutlet = useOutlet();
	const [currentObjectRoute, setCurrentObjectRoute] = useState(null);
	const { showLoadingScreen, listPermissionPage } = useSelector(state => state.global)
	const { error } = useSelector(state => state.global)
	const dispatch = useDispatch();

	const translationData = JSON.parse(localStorage.getItem('translation_data')) || {};
	const translationId = (translationData.id || translationData.en) || {};

	const normalizedTranslations = {};
	Object.keys(translationId).forEach(key => {
		normalizedTranslations[key.toLowerCase()] = translationId[key];
	});

	const getTranslatedText = (key) => {
		const normalizedKey = key.toLowerCase().replace(/\s+/g, '_');
		console.log(normalizedKey);
		return normalizedTranslations[normalizedKey]?.text1 || key;
	};
	// useEffect(()=>{
	// 	if(error){
	// 		throw data(error.data, {status: error.status, statusText: error.message})
	// 	}
	// 	return () => {
	// 		dispatch(clearError())
	// 	};
	// },[dispatch, error])

	useEffect(() => {
		if (getOutlet) {
			if (getOutlet.props.children.props.routeContext.outlet) {
				setCurrentObjectRoute(
					getOutlet.props.children.props.routeContext.outlet.props.match.route
				);
			} else {
				setCurrentObjectRoute(
					getOutlet.props.children.props.match.route
				);
			}
		}
		return () => {
			setCurrentObjectRoute(null);
		};
	}, [getOutlet]);

	return (
		<Container fluid className="position-relative">
			<Row className="flex-nowrap">
				{currentObjectRoute?.sidebar &&
					<Sidebar currentPath={currentObjectRoute?.path} />
				}
				<Col className="p-0 vh-100 overflow-hidden">
					<div className="d-flex flex-column h-100 main-layout">
						{currentObjectRoute?.header &&
							<>
								<Header title={getTranslatedText(currentObjectRoute.title)} />
								<Breadcrumbs />
							</>
						}
						<div className="px-sm-3 px-2 py-sm-4 py-3 overflow-y-auto">
							{
								listPermissionPage?.length > 0 && <Outlet />
							}
							{currentObjectRoute?.footer && <Footer />}
						</div>
					</div>
				</Col>
			</Row>
			<NavigateSetter />
			<ModalQuerySearch />
			<ModalImageComponent />
			<ModalComponent />
			<ModalComponent2 />
			<LoadingComponent show={showLoadingScreen} />
			<CheckPermission privileges={currentObjectRoute?.privileges} currentObjectRoute={currentObjectRoute} />
		</Container>
	)
}

export default PageLayout