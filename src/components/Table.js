import { useState } from 'react';
import ExpandTable from './ExpandTable';
import './Table.css';

const Table = (props) => {
  const [clickedRow, setClickedRow] = useState(
    new Array(props.odds.length).fill(false)
  );

  const spreads = props.odds
    .flatMap((match) =>
      match.bookmakers.flatMap((bookmaker) =>
        bookmaker.markets
          .filter((market) => market.key === 'spreads')
          .flatMap((market) => market.outcomes)
      )
    )
    .map((item) => item.point)
    .filter((value, index, array) => array.indexOf(value) === index) //unique spread values
    .sort((a, b) => a - b);

  const totals = props.odds
    .flatMap((item) =>
      item.bookmakers.flatMap((bookmaker) =>
        bookmaker.markets
          .filter((market) => market.key === 'totals')
          .flatMap((market) => market.outcomes)
      )
    )
    .map((item) => item.point)
    .filter((value, index, array) => array.indexOf(value) === index) //unique total values
    .sort();

  const labels = [
    'Date',
    'Time',
    'Home Team',
    'Away Team',
    '1',
    'X',
    '2',
    'X/2',
    '1/2',
    '1/X',
    ...[...spreads],
    ...[...totals],
    ...[...totals],
  ];

  const clickHandler = (index) => {
    setClickedRow((prev) => {
      const newClickedRow = [...prev];
      newClickedRow[index] = !newClickedRow[index];
      return newClickedRow;
    });
  };

  return (
    <table>
      <thead>
        <tr>
          <th colSpan={7}></th>
          <th colSpan={3}>Double Chance</th>
          <th colSpan={spreads.length}>Spreads</th>
          <th colSpan={totals.length}>Over</th>
          <th colSpan={totals.length}>Under</th>
        </tr>
        <tr>
          {labels.map((label) => (
            <th>{label}</th>
          ))}
        </tr>
      </thead>
      {props.odds.map((match, index) => (
        <>
          <tr key={match.id} onClick={() => clickHandler(index)}>
            <td>{match.commence_time.slice(0, 10)}</td>
            <td>{match.commence_time.slice(11, 16)}</td>
            <td>{match.home_team}</td>
            <td>{match.away_team}</td>
            {['h2h', 'h2h_lay'].map((bet) =>
              [match.home_team, 'Draw', match.away_team].map((result) => (
                <td>
                  {
                    match.bookmakers
                      .flatMap((bookmaker) =>
                        bookmaker.markets
                          .filter((market) => market.key === bet)
                          .flatMap((market) =>
                            market.outcomes.filter(
                              (outcome) => outcome.name === result
                            )
                          )
                      )
                      .reduce((a, b) => (a.price < b.price ? b : a)).price
                  }
                </td>
              ))
            )}
            {spreads.map((spread) => (
              <td>
                {
                  match.bookmakers
                    .flatMap((bookmaker) =>
                      bookmaker.markets
                        .filter((market) => market.key === 'spreads')
                        .flatMap((market) =>
                          market.outcomes.filter(
                            (outcome) => outcome.point === spread
                          )
                        )
                    )
                    .reduce((a, b) => (a.price < b.price ? b : a), { price: 0 })
                    .price || '' //.toString().replace(new RegExp("\\b0\\b"),'')
                }
              </td>
            ))}
            {['Over', 'Under'].map((bet) =>
              totals.map((total) => (
                <td>
                  {match.bookmakers
                    .flatMap((bookmaker) =>
                      bookmaker.markets
                        .filter((market) => market.key === 'totals')
                        .flatMap((market) =>
                          market.outcomes.filter(
                            (outcome) =>
                              outcome.point === total && outcome.name === bet
                          )
                        )
                    )
                    .reduce((a, b) => (a.price < b.price ? b : a), { price: 0 })
                    .price || ''}
                </td>
              ))
            )}
          </tr>
          {clickedRow[index] && (
            <ExpandTable
              odds={props.odds}
              matchId={match.id}
              homeTeam={match.home_team}
              awayTeam={match.away_team}
              spreads={spreads}
              totals={totals}
            />
          )}
        </>
      ))}
    </table>
  );
};
export default Table;
