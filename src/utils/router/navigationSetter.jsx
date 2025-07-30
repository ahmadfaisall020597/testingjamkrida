import { useNavigate } from "react-router";
import { History } from "./index";

export const NavigateSetter = () => {
	History.navigate = useNavigate();

	return null;
};