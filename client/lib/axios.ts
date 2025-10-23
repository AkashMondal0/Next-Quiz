import { appInfo } from '@/config/app-details'
import axios from 'axios'

const api = axios.create({
  baseURL: appInfo.apiUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true
})

export default api;