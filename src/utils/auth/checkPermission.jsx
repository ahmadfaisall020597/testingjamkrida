import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { 
  setError, 
  // setShowLoadingScreen 
} from '../store/globalSlice';
import objectRouter from '../router/objectRouter';

/**
 * This component will check the user permission when the user navigate to another page
 * It will check the permission by using the path of the current page and the list of permission
 * that the user have. If the user does not have the permission to access the page, it will set an
 * error state with a status of 401 and redirect to the homepage after 3 seconds
 * 
 * @returns {null}
 */
const CheckPermission = ({currentObjectRoute}) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { listPermissionPage } = useSelector(state => state.global);

  const checkPermission = useCallback((location, listPermissionPage)=>{
    if(location){
      if(listPermissionPage.length > 0){
        // dispatch(setShowLoadingScreen(true))
        const currentPath = location.pathname;
        if(currentPath == currentObjectRoute?.path){
          let isHavePermission = null
          setTimeout(()=>{
            if(currentPath == objectRouter.dashboard.path){
              isHavePermission = listPermissionPage.some(v=>v.path.includes(currentPath) && v.privileges.includes(currentObjectRoute?.privileges))
            }else{
              isHavePermission = listPermissionPage.some(v=>currentPath.includes(v.path) && v.privileges.includes(currentObjectRoute?.privileges))
            }
            console.log(isHavePermission)
            if(!isHavePermission){
              dispatch(setError({ 
                status: 401, 
                message: "UNAUTHORIZED", 
                data: {data:"You don't have permission to access this page" }
              }))
              // dispatch(setShowLoadingScreen(false))
            }
          },[300])
        }
      }
    }
  }, [dispatch, currentObjectRoute])

  useEffect(()=>{
    if(location){
      if(listPermissionPage.length > 0){
        checkPermission(location, listPermissionPage)
      }
    }

  },[checkPermission, listPermissionPage, location])

  return null
};

export default CheckPermission;
