import objectRouter from "./objectRouter";
import objectRouterApproval from "./objectRouter.approval";
import objectRouterFunctionRequest from "./objectRouter.functionRequest";
import objectRouterInquiry from "./objectRouter.inquiry";
import objectRouterMasterPage from "./objectRouter.masterPage";
import { objectRouterMitra } from "./objectRouter.mitra";
import { objectRouterPortalAdmin } from "./objectRouter.portalAdmin";
import { objectRouterReporting } from "./objectRouter.reporting";

export const combineObjectRouter = {
  ...objectRouterPortalAdmin,
  ...objectRouterMitra,
  ...objectRouterReporting,
  ...objectRouterApproval,
  ...objectRouterFunctionRequest,
  ...objectRouterInquiry,
  ...objectRouterMasterPage,
  ...objectRouter,
};