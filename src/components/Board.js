import React, { useState } from 'react';

const Board = ({ picks }) => {
  const getUsers = () => {
    return picks.reduce((acc, pick) => {
      const { picked_by_name } = pick;
      if (!acc.includes(picked_by_name)) acc.push(picked_by_name);
      return acc;
    }, []);
  };

  const groupPicksByRound = () => {
    const groupedPicks = {};

    picks.forEach((pick) => {
      const { round } = pick;
      if (!groupedPicks[round]) {
        groupedPicks[round] = [];
      }
      groupedPicks[round].push(pick);
    });

    Object.keys(groupedPicks).forEach((round) => {
      if (round % 2 === 0) groupedPicks[round] = groupedPicks[round].reverse();
    });

    return groupedPicks;
  };

  const users = getUsers();
  const groupedPicks = groupPicksByRound();

  const Pick = ({ pick }) => {
    let positionClass = `pick board__${pick.player.position.toLowerCase()}`;
    return (
      <td className={positionClass}>
        <div className="board__row__1">
          <div className="pick__name">{pick.player.full_name}</div>
          <div className="pick__bye">{pick.player.bye}</div>
        </div>
        <div className="board__row__2">
          <div className="pick__team">
            {pick.player.teamName || 'FA'} - {pick.player.position}
          </div>
          <div className="pick__round">
            {pick.round} - {pick.pick_no - (pick.round - 1) * users.length}
          </div>
        </div>
      </td>
    );
  };

  return (
    <table className="board">
      <thead>
        <tr className="board__users">
          {users.map((user) => (
            <th className="board__user">{user}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(groupedPicks).map((round) => (
          <tr key={round}>
            {groupedPicks[round].map((pick) => (
              <Pick pick={pick} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Board;
