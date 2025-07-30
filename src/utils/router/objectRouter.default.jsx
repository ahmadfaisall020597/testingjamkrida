import { pathDefault } from "../variableGlobal/varPath";

const objectRouterDefault = {
  defaultChildren:{
    title: "default children page ",
    path: `${pathDefault}/children`,
    stringElement: "DefaultPage",
    index: false,
    needAuth: true,
    header: true,
    footer: false,
    sidebar: true,
  },
}

export default objectRouterDefault