import { createRoot } from "react-dom/client";
// eslint-disable-next-line no-unused-vars
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "src/utils/store/combineReducers";
import { lazy, Suspense } from "react";
import LoadingSpinner from "./components/partial/spinnerComponent.jsx";
import 'bootstrap-icons/font/bootstrap-icons.css';

// eslint-disable-next-line react-refresh/only-export-components
const LazyComponent = lazy(() => import('./App.jsx'));

const rootElement = document.getElementById("root");

	createRoot(rootElement).render(
		<Provider store={store}>
			<Suspense fallback={<LoadingSpinner color="secondary"/>}>
				<LazyComponent />
			</Suspense>
		</Provider>
	);
