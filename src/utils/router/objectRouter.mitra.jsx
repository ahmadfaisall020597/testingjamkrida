
import { store } from "../store/combineReducers";
import { pathMitra } from "../variableGlobal/varPath";

// const translationData = store.getState().language.translationData;
// const code_lang = store.getState().language.selectedLanguage;
// const translateTitle = translationData[code_lang];

export const objectRouterMitra = {
  Dashboard: {
    title: "Dashboard Mitra",
    path: `${pathMitra}/dashboard-mitra`,
    stringElement: "DashboardPageMitra",
    index: true,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
  },

}