import { Button, Stack } from "react-bootstrap";

const ButtonComponent = ({ onClick, variant = "warning", className, title, icon, type = "button", rounded = "5", disabled, size, justifyContent = "between" }) => {
	return (
		<Button size={size} disabled={disabled} type={type} variant={variant} className={`rounded-${rounded} ${icon ? "ps-sm-4 ps-3" : "px-sm-4 px-3 pt-1"} shadow-sm ${className}`} onClick={onClick}>
			<Stack direction="horizontal" className={`justify-content-${justifyContent}`} gap={3}>
				<div className="fw-semibold">{title}</div>
				{icon && icon}
			</Stack>
		</Button>
	);
};

export default ButtonComponent;
