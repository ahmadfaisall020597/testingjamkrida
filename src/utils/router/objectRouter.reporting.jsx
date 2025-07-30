
import { pathReporting } from "../variableGlobal/varPath";

export const objectRouterReporting = {
  dashboard:{
    title: "Reporting Dashboard Page",
    path: `${pathReporting}`,
    stringElement: "DashboardPage",
    index: true,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
  },
  costControl:{
    title: "Cost Control",
    path: `${pathReporting}/cost-control`,
    stringElement: "ReportingCostControl",
    index: false,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
    privileges: 'R',
  },
  listProduct:{
    title: "List Product",
    path: `${pathReporting}/product-list`,
    stringElement: "ReportingListProduct",
    index: false,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
    privileges: 'R',
  },
  listPackage:{
    title: "List Package",
    path: `${pathReporting}/package-list`,
    stringElement: "ReportingListPackage",
    index: false,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
    privileges: 'R',
  },
  campServices:{
    title: "Camp Services",
    path: `${pathReporting}/camp-services`,
    stringElement: "ReportingCampServices",
    index: false,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
    privileges: 'R',
  }
}