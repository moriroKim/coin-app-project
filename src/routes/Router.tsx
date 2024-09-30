import Coins from './Coins';
import Coin from './Coin';
import { Route, Routes } from 'react-router-dom';
import Chart from './Chart';
import Price from './Price';

function Router() {
  return (
    <Routes>
      <Route path={'/:coinId'} element={<Coin />}>
        <Route path={'chart'} element={<Chart />} />
        <Route path={'price'} element={<Price />} />
      </Route>
      <Route path={'/'} element={<Coins />}></Route>
    </Routes>
  );
}

export default Router;
