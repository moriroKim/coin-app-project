import { Outlet, useLocation, useMatch, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { fetchCoinInfo, fetchCoinTickers } from './api';
import { Helmet, HelmetProvider } from 'react-helmet-async';

const Container = styled.div`
  padding: 0 20px;
  max-width: 480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  width: 440px;
  max-height: 500px;
  margin: 20px 0px;
  word-break: break-all;
  overflow: auto;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 7px 0px;
  border-radius: 10px;
  color: ${(props) => (props.isActive ? props.theme.accentColor : props.theme.textColor)};
  a {
    display: block;
  }
`;

interface RouteState {
  name: string;
  symbol: string;
}

interface RouteParams {
  [key: string]: string | undefined;
}

interface IInfoData {
  id: string;
  name: string;
  image: {
    large: string;
    small: string;
    thumb: string;
  };
  last_updated: string;
  market_cap_rank: number;
  description: {
    en: string;
  };
  symbol: string;
}

interface ICoinPrice {
  target: string;
  converted_last: {
    btc: number;
    eth: number;
    usd: number;
  };
  volume: number;
  last: number;
}

interface IPriceData {
  name: string;
  tickers: ICoinPrice[];
}

function Coin() {
  const { coinId } = useParams<RouteParams>();
  const location = useLocation();
  const state = location.state as RouteState;
  const priceMatch = useMatch('/:coinId/price');
  const chartMatch = useMatch('/:coinId/chart');
  // coinId가 undefined가 아닌 경우에만 쿼리를 실행하게 설정
  const { isLoading: infoLoading, data: infoData } = useQuery<IInfoData>(
    ['info', coinId],
    () => fetchCoinInfo(coinId!) // coinId가 undefined가 아닌 경우에만 fetchCoinInfo 호출
  );

  const { isLoading: tickersLoading, data: tickersData } = useQuery<IPriceData>(
    ['tickers', coinId],
    () => fetchCoinTickers(coinId!), // coinId가 있을 때만 쿼리가 활성화됨
    { refetchInterval: 5000 }
  );
  console.log(infoData);
  console.log(tickersData);

  const loading = infoLoading || tickersLoading;
  const usdTicker = tickersData?.tickers.find((ticker) => ticker.target === 'USD');

  return (
    <Container>
      <HelmetProvider>
        <Helmet>
          <title>{state?.name && state?.symbol ? state.name : loading ? 'Loading' : infoData?.name}</title>
        </Helmet>
      </HelmetProvider>
      <Header>
        <Title>{state?.name && state?.symbol ? state.name : loading ? 'Loading' : infoData?.name}</Title>
      </Header>
      {loading ? (
        <Loader>Loading..</Loader>
      ) : (
        <>
          <Overview>
            <OverviewItem>
              <span>랭크:</span>
              <span>{infoData?.market_cap_rank}</span>
            </OverviewItem>
            <OverviewItem>
              <span>심볼:</span>
              <span>{infoData?.symbol}</span>
            </OverviewItem>
            <OverviewItem>
              <span>가격:</span>
              <span>{usdTicker?.converted_last.usd}</span>
            </OverviewItem>
          </Overview>

          <Description>{infoData?.description.en}</Description>

          <Overview>
            <OverviewItem>
              <span>총 거래량:</span>
              <span>{usdTicker?.volume}</span>
            </OverviewItem>
            <OverviewItem>
              <span>마지막 거래 가격:</span>
              <span>{usdTicker?.last}</span>
            </OverviewItem>
          </Overview>

          <Tabs>
            <Tab isActive={chartMatch !== null}>
              <Link to={'chart'}>Chart</Link>
            </Tab>

            <Tab isActive={priceMatch !== null}>
              <Link to={'price'}>Price</Link>
            </Tab>
          </Tabs>

          <Outlet context={{ coinId, symbol: infoData?.symbol }} />
        </>
      )}
    </Container>
  );
}

export default Coin;
