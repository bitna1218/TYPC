import { appConfig } from '@/config';
import axios from 'axios';

const lcaBackend = axios.create({
  baseURL: appConfig.backendUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default lcaBackend;
