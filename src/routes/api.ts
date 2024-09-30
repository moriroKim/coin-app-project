import { client, coinHistory } from '../axios/client';

export async function fetchCoins() {
  const response = await client.get('coins/markets', {
    params: {
      vs_currency: 'usd',
      order: 'market_cap_desc',
      per_page: 50,
      page: 1,
    },
  });
  const data = await response.data;

  return data;
}

export async function fetchCoinInfo(coinId: string) {
  const response = await client.get(`/coins/${coinId}`, {
    params: {
      localization: false,
    },
  });
  const data = await response.data;

  return data;
}

export async function fetchCoinTickers(coinId: string) {
  const response = await client.get(`coins/${coinId}/tickers/`);
  const data = await response.data;

  return data;
}

export async function fetchCoinHistory(coinId: string, symbol: string) {
  const response = await coinHistory.get(`?coinId=${symbol}-${coinId}`);
  const data = await response.data;

  return data;
}
