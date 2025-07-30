import { Stack } from "react-bootstrap"
import ButtonComponent from "./buttonComponent"

const ButtonGroupTenantComponent = ({listTenant, selectedTenant, onChangeTenant, className})=>{

  const handleClick = (tenant)=>{
    if(onChangeTenant){
      onChangeTenant(tenant)
    }
  }

  if(listTenant && listTenant?.length > 1){
    return (
      <Stack direction="horizontal" className={`flex-wrap ${className}`} gap={3}>
      {
        listTenant.map((v,idx)=>
        <ButtonComponent
          variant="outline-dark"
          disabled={v == selectedTenant}
          key={idx}
					onClick={()=>handleClick(v)}
					title={v.TENANT_NAME}
				/>
      )}
      </Stack>
    )
  }
  return <></>
}

export default ButtonGroupTenantComponent