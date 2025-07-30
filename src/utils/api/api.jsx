/* eslint-disable no-unused-vars */
import axios from 'axios';
import { saveAuthToken } from '../localStorage';
import { toast } from 'react-toastify';
import { store } from '../store/combineReducers';
import { setError } from '../store/globalSlice';
import authInstance from '../keycloak/keycloak';

// Konfigurasi Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_CONF_BASE_API_URL, // Ubah sesuai kebutuhan
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'Ocp-Apim-Subscription-Key': import.meta.env.VITE_SUBSCRIPTION_KEY
  },
});

//Tambahkan interceptors untuk menyetel token
api.interceptors.request.use(
  async config => {
    // Coba dapatkan token dengan retry mechanism yang lebih baik
    // let token1 = localStorage.getItem("tkn");
  
    let token = localStorage.getItem("tkn");
    console.log('token : ', token); 
    let retryCount = 0;
    const maxRetries = 3;
    
    while (!token && retryCount < maxRetries) {
      await new Promise((resolve) => setTimeout(resolve, 200)); // Delay lebih pendek
      token = localStorage.getItem("tkn");
      retryCount++;
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Authorization header diset:", config.headers.Authorization);
    } else {
      console.warn('Token tidak tersedia setelah retry');
    }

    // Timezone handling (sudah OK)
    const offsetInMinutes = new Date().getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(offsetInMinutes) / 60);
    const offsetMinutes = Math.abs(offsetInMinutes) % 60;
    const sign = offsetInMinutes <= 0 ? '+' : '-';
    const formattedOffset = `${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

    config.headers['X-Client-Timezone'] = formattedOffset;
    config.headers['X-Client-IANA-Timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    return config;
  },
  error => Promise.reject(error)
);

export const componentError = ({data})=>{
  return (
    <div>
      <p className='m-0'>{data.codeText} {data.code}</p>
      <p className='m-0'>{data.text}</p>
    </div>
  )
}

const pendingRequests = new Map();

const handleApiError = error => {
	if (error.response) {
		const status = error.response.status || "";
		const message = error.response.data?.message || error.response.data?.title || error.response.statusText || error.response?.message;
		switch (status) {
			case 400:
				if (!error?.config?.url?.includes("api/utilities/getProfile")) {
					const errors = error.response.data?.errors;
					if (errors && typeof errors === "object") {
						const firstField = Object.keys(errors)[0];
						const firstMessage = errors[firstField]?.[0] || "Validation error";
						toast.error(<div>{firstMessage}<br /><br />400 - Bad Request</div>
						);
					} else {
						toast.error(<div>{message}<br /><br />400 - Bad Request</div>
						);
					}
				}
				break;
			case 401:
				store.dispatch(setError({ status, message, data: error.response }));
				break;
			case 403:
				toast.error(<div>{message}<br /><br />{status} - Forbidden</div>);
				break;
			case 404:
				toast.error(<div>{message}<br /><br />{status} - not found</div>);
				break;
			case 422:
				toast.error(<div>{message}<br /><br />{status} - Unprocessable Entity</div>);
				break;
			case 500:
				toast.error(<div>{message}<br /><br />{status} - Internal Server Error</div>);
				break;
			default:
				toast.error(<div>{message}<br /><br />{status} - Error</div>);
				break;
		}
	} else if (error.request) {
		if (error.message && error.message.includes("Network Error")) {
			toast.error("CORS error: " + error.message);
		} else {
			toast.error("Error request: " + error.message);
		}
	} else {
		toast.error("Error: " + error.message);
	}
};



export const  request = async (options) => {
  const requestKey = `${options.method || 'GET'}_${options.url}_${JSON.stringify(options.params || {})}`;
  
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }
  
  const requestPromise = executeRequest(options);
  pendingRequests.set(requestKey, requestPromise);
  
  try {
    const result = await requestPromise;
    pendingRequests.delete(requestKey);
    return result;
  } catch (error) {
    pendingRequests.delete(requestKey);
    throw error;
  }
};

const executeRequest = async (options) => {
  try {
    const servicePath = options.service || "";
    const modifiedOptions = {
      ...options,
      url: `${servicePath}${options.url}`,
    };
    
    const response = await api(modifiedOptions);
    
    if (response?.headers['X-New-Token']) {
      saveAuthToken(response.headers['X-New-Token']);
    }
    
    return response;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
