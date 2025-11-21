import { restClient } from '@massive.com/client-js';


const api_key = import.meta.env.POLYGON_API_KEY || '';
const rest = restClient(api_key)

console.log(Object.keys(rest));
