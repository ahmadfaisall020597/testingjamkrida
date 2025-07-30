/* eslint-disable no-unused-vars */
import ClaimSettings from "../claimSettings";
import GeneralSettings from "../generalSettings";
import PenjaminanSettings from "../penjaminanSettings";
import SubrogasiSettings from "../subrogasiSettings";

const tabsConfig = [
	{
		key: "PENJAMINAN_SETTINGS",
		label: "Penjaminan",
		icon: "fas fa-shield-alt",
		component: <PenjaminanSettings />
	},
	{
		key: "KLAIM_SETTINGS",
		label: "Claim",
		icon: "fas fa-file-invoice",
		component: <ClaimSettings />
	},
	{
		key: "SUBROGASI_SETTINGS",
		label: "Subrograsi",
		icon: "fas fa-exchange-alt",
		component: <SubrogasiSettings />
	},
	{
		key: "general",
		label: "General",
		icon: "fas fa-cog",
		component: <GeneralSettings />
	}
];

export default tabsConfig;

