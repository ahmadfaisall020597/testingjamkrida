// eslint-disable-next-line no-unused-vars
import { createBrowserRouter, redirect } from "react-router";
import PageLayout from "src/components/shared/pageLayout";
import { ErrorBoundary } from "src/components/shared/errorPage";
import { combineObjectRouter } from "./combineObjectRouter";
import RoutesElements from "./RoutesElements";
import { getAuthToken } from "../localStorage";

// eslint-disable-next-line no-unused-vars
export const extraLogic = _currentRoute => {
	// here extra logic for specific route

	return null;
};

const loaderFn = (objectKey) => {
	if (!objectKey.needAuth) {
		return null;
	}

	const token = getAuthToken();
	console.log("Cek Token:", token);

	if (!token) {
		const authType = objectKey.authType;
		if (authType === 'mitra') {
			console.log("Redirect ke login-mitra");
			return redirect("/login-mitra");
		} else {
			console.log("Redirect ke login");
			return redirect("/login");
		}
	}

	const extraReturn = extraLogic(objectKey);
	if (extraReturn) {
		return extraReturn;
	}
	return null;
};

export const convertObjectToArray = () => {
	const obj = combineObjectRouter
	const dataObject = Object.keys(obj).map(key => ({
		...obj[key],
		Component: obj[key].stringElement ? RoutesElements[obj[key].stringElement] : null,
		children: obj[key].children
			? Object.keys(obj[key].children).map(key2 => ({
				...obj[key].children[key2],
				loader: () => loaderFn(obj[key])
			}))
			: null,
		loader: () => loaderFn(obj[key])
	}));
	return dataObject;
};

const routerEntries = [
	{
		path: "/",
		Component: PageLayout,
		children: convertObjectToArray(),
		errorElement: <ErrorBoundary />
	}
];

export const router = createBrowserRouter(routerEntries, {
	basename: "/testingjamkrida"
});

export const History = {
	navigate: null,
	push: (page, ...rest) => History.navigate(page, ...rest)
};