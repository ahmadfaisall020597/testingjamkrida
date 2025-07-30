import { decryptData, encryptData } from "src/utils/cryptojs"

export const encryptDataId = (data, from)=>{
  const dataObject = {
    orderId: data,
    from: from
  }
  return encodeURIComponent(encryptData(dataObject))
}

export const decryptDataId = (data)=>{
  try {
    return decryptData(decodeURIComponent(data))
  } catch {
    return null
  }
}