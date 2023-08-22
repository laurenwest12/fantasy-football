import React, { useEffect, useState } from 'react';

const Tiers = ({ players }) => {
  return (
    <div>
      <div>QB</div>
      <div>
        {Object.entries(players.QB).map(([tier, tierPlayers]) => (
          <div>
            <div>TIER {tier}</div>
            <div>
              {tierPlayers.map((player) => (
                <div>
                  <div>{player.full_name}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tiers;
