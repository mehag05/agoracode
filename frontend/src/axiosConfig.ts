import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://shopatagora.com';

export default axios;