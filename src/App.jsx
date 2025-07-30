import { RouterProvider } from "react-router";
import "src/assets/style/index.scss";
import { router } from "src/utils/router";
import ToastManager from "src/components/partial/toastManagerComponent";
import { useEffect } from "react";
import getProfile from "./utils/auth/authHelpers";

function App() {
	useEffect( ()=>{
		getProfile(true)
	},[])

	return (
		<div>
			<RouterProvider router={router}/>
			<ToastManager />
		</div>
	)
}

export default App;
