import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";
import objectRouter from "../router/objectRouter";

const usePrivileges = ()=>{
  const location = useLocation();
  const { listPermissionPage } = useSelector(state => state.global);
  const [currentPrivileges, setCurrentPrivileges] = useState("");

  useEffect(()=>{
      if(location){
        if(listPermissionPage.length > 0){
          const currentPath = location.pathname;
          let objPermissionPage = {}
          if(currentPath == objectRouter.dashboard.path){
            objPermissionPage = listPermissionPage.find(v=>v.path.includes(currentPath))
          }else{
            objPermissionPage = listPermissionPage.find(v=>currentPath.includes(v.path))
          }
          if(objPermissionPage){
            setCurrentPrivileges(objPermissionPage.privileges)
          }
          console.log(objPermissionPage)
        }
        
      }
    },[listPermissionPage, location])

  return currentPrivileges
}

export default usePrivileges;