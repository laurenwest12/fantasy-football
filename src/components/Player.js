import React from 'react';

const Player = ({ player }) => {
  const isPicked = player.picks && player.picks.length > 0;
  const playerClassName = `player ${isPicked ? 'picked' : ''}`;

  return (
    <div className={playerClassName}>
      <div className="player__info">
        <div>{player.avg_ranking}</div>
        <div>{player.full_name}</div>
      </div>
    </div>
  );
};

export default Player;
