import { useEffect, useState } from 'react';
import './App.css';
import Table from './components/Table';
import useHttp from './hooks/useHttp';

function App() {
  const { isLoading, error, sendRequest: fetchOdds } = useHttp();
  const [odds,setOdds] = useState([]);

  useEffect(() => {
    const transformOdds = (oddsArray) => {
      //console.log(oddsArray);
      setOdds(oddsArray);
    }

    fetchOdds(
      //{url: process.env.REACT_APP_ODDS_API_URL},
      {url: './data.json'},
      transformOdds
    );
  }, [])

  return (
    <div className="App">
      {isLoading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <Table odds={odds}/>
    </div>
  );
}

export default App;
