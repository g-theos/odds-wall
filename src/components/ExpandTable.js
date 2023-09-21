/*
 Returns true or false based on whether the provided outcome of a specific match and bookmaker
 is best among all other bookmakers' outcomes for the same match & market.
 */
const isBestOdd = ({
  bookmakers,
  marketKey,
  outcome: { name, price, point },
}) => {
  return bookmakers.every((bookie) => {
    return bookie.markets.every((market) => {
      if (market.key !== marketKey) return true;

      return market.outcomes.every((outcome) => {
        if (
          outcome.name === name &&
          (outcome.point ? outcome.point === point : true)
        ) {
          return outcome.price <= price;
        }

        return true;
      });
    });
  });
};

/*
 This function maps all provided bookmakers,
 calculating which odd should be highlighted by adding a prop to their markets' outcomes.
 */
const calculateHighlightedOutcomesMapper = (bookmakers) => {
  return bookmakers.map((bookie) => ({
    ...bookie,
    markets: bookie.markets.map((market) => ({
      ...market,
      outcomes: market.outcomes.map((outcome) => ({
        ...outcome,
        isHighlighted: isBestOdd({
          bookmakers,
          marketKey: market.key,
          outcome,
        }),
      })),
    })),
  }));
};

const ExpandTable = (props) => {
  return calculateHighlightedOutcomesMapper(
    props.odds
      .filter((match) => match.id === props.matchId)
      .flatMap((match) => match.bookmakers)
  ).map((bookmaker) => (
    <tr key={bookmaker.key}>
      <td colSpan={4}>{bookmaker.key}</td>
      {["h2h", "h2h_lay"].map((bet) =>
        [props.homeTeam, "Draw", props.awayTeam].map((result) => (
          <td>
            {bookmaker.markets
              .filter((market) => market.key === bet)
              .flatMap((market) => {
                const outcome = market.outcomes.find(
                  (outcome) => outcome.name === result
                );

                return (
                  <div
                    {...(outcome.isHighlighted && {
                      style: { backgroundColor: "lightgreen" },
                    })}
                  >
                    {outcome?.price}
                  </div>
                );
              })}
          </td>
        ))
      )}
      {props.spreads.map((spread) => (
        <td>
          {bookmaker.markets
            .filter((market) => market.key === "spreads")
            .flatMap((market) => {
              const outcome = market.outcomes.find(
                (outcome) => outcome.point === spread
              );

              return (
                <div
                  {...(outcome?.isHighlighted && {
                    style: { backgroundColor: "lightgreen" },
                  })}
                >
                  {outcome?.price}
                </div>
              );
            })}
        </td>
      ))}
      {["Over", "Under"].map((bet) =>
        props.totals.map((total) => (
          <td>
            {bookmaker.markets
              .filter((market) => market.key === "totals")
              .flatMap((market) => {
                const outcome = market.outcomes.find(
                  (outcome) => outcome.point === total && outcome.name === bet
                );
                return (
                  <div
                    {...(outcome?.isHighlighted && {
                      style: { backgroundColor: "lightgreen" },
                    })}
                  >
                    {outcome?.price}
                  </div>
                );
              })}
          </td>
        ))
      )}
    </tr>
  ));
};

export default ExpandTable;