import { useQuery } from 'react-query';
import { useOutletContext } from 'react-router-dom';
import { fetchCoinHistory } from './api';
import ReactApexChart from 'react-apexcharts';
import { useRecoilValue } from 'recoil';
import { isDarkAtom } from './atoms';

interface ChartProps {
  coinId: string;
  symbol: string;
}

interface IHistorical {
  time_open: number;
  time_close: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  market_cap: number;
}

function Chart() {
  const { coinId, symbol } = useOutletContext<ChartProps>();
  const isDark = useRecoilValue(isDarkAtom);

  const { isLoading, data } = useQuery<IHistorical[]>(['history', coinId], () => fetchCoinHistory(coinId, symbol));
  return (
    <div>
      {isLoading ? (
        'Loading Chart'
      ) : (
        <ReactApexChart
          type="line"
          options={{
            chart: {
              height: 300,
              width: 500,
              toolbar: {
                show: false,
              },
              background: 'transparent',
            },
            grid: {
              show: false,
            },
            theme: {
              mode: isDark ? 'dark' : 'light',
            },
            yaxis: {
              show: false,
            },
            xaxis: {
              labels: {
                show: false,
              },
              axisTicks: {
                show: false,
              },
              axisBorder: {
                show: false,
              },
              categories: data?.map((price) => new Date(price.time_close * 1000).toUTCString()) ?? [],
              type: 'datetime',
            },
            fill: {
              type: 'gradient',
              gradient: {
                gradientToColors: ['#0be881'],
                stops: [0, 100],
              },
            },
            colors: ['#0fbcf9'],
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(3)}`,
              },
            },
            stroke: {
              curve: 'smooth',
              width: 3,
            },
          }}
          series={[
            {
              name: 'price',
              data: data?.map((price) => Number(price.close)) ?? [],
            },
          ]}
        />
      )}
    </div>
  );
}

export default Chart;
