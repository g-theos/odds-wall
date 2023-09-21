const ExpandTable = (props) => {
  
  return props.odds
    .filter((match) => match.id === props.matchId)
    .flatMap((match) => match.bookmakers)
    .map((bookmaker) => (
      <tr key={bookmaker.key}>
        <td colSpan={4}>{bookmaker.key}</td>
        {['h2h', 'h2h_lay'].map((bet) =>
          [props.homeTeam, 'Draw', props.awayTeam].map((result) => (
            <td>
              {bookmaker.markets
                .filter((market) => market.key === bet)
                .flatMap(
                  (market) =>
                    market.outcomes.find((outcome) => outcome.name === result)
                      ?.price
                )}
            </td>
          ))
        )}
        {props.spreads.map((spread) => (
          <td>
            {bookmaker.markets
              .filter((market) => market.key === 'spreads')
              .flatMap(
                (market) =>
                  market.outcomes.find((outcome) => outcome.point === spread)
                    ?.price
              )}
          </td>
        ))}
        {['Over', 'Under'].map((bet) =>
          props.totals.map((total) => (
            <td>
              {bookmaker.markets
                .filter((market) => market.key === 'totals')
                .flatMap(
                  (market) =>
                    market.outcomes.find(
                      (outcome) =>
                        outcome.point === total && outcome.name === bet
                    )?.price
                )}
            </td>
          ))
        )}
      </tr>
    ));
};

export default ExpandTable;
