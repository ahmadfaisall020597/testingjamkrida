import { pathApproval } from "../variableGlobal/varPath";

const objectRouterApproval = {
  dashboard:{
    title: "Dashboard Approval",
    path: pathApproval,
		stringElement: "DashboardPage",
    index: true,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
  },
  approvalSuperVisor:{
    title: "Approval Supervisor",
    path: `${pathApproval}/approval-supervisor`,
    index: false,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
  },
  viewApprovalSuperVisor:{
    title: "view approval supervisor",
    path: `${pathApproval}/approval-supervisor/view`,
    index: false,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
  }
}

export default objectRouterApproval