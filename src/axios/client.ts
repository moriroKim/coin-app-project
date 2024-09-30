import axios from 'axios';

export const client = axios.create({
  baseURL: 'https://api.coingecko.com/api/v3',
});

export const coinHistory = axios.create({
  baseURL: 'https://ohlcv-api.nomadcoders.workers.dev',
});
