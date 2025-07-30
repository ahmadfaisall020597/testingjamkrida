import axios from 'axios';

const baseURL = import.meta.env.VITE_CONF_BASE_API_URL;

class AuthHelpers {
    async getData(suburl, params){
        try {
            const response = await axios.get(
                baseURL + suburl, {
                    params: params,
                    ...this.setAuthHeader()
            });
            return response
        } catch (error) {
            return error.response
        }
    }

    async postData(suburl, params){
        try {
            const response = await axios.post(
                baseURL + suburl,
                params,
                this.setAuthHeader()               
            );
            return response
        } catch (error) {
            return error.response
        }
    }

    async putData(suburl, params) {
        try {
            const response = await axios.put(
                baseURL + suburl,
                params,
                this.setAuthHeader()
            );
            return response;
        } catch (error) {
            return error.response;
        }
    }

    setAuthHeader() {
        return { 
             headers: {
                 'Content-Type': 'application/json',
             }
         };
    }    
}

export default new AuthHelpers();