// lib/axios.ts
import axios from 'axios';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';
