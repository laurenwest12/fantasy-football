import React, { useState } from 'react';

const Tiers = ({ players }) => {
  const [expandedTiers, setExpandedTiers] = useState({});

  const toggleTierExpansion = (position, tier) => {
    setExpandedTiers((prevExpandedTiers) => {
      const key = `${position}-${tier}`;
      return { ...prevExpandedTiers, [key]: !prevExpandedTiers[key] };
    });
  };

  return (
    <div className="tiers__container">
      {Object.keys(players).map((position) => (
        <div className="tier__position" key={position}>
          <div className="tier__header">{position}</div>
          <div>
            {Object.entries(players[position]).map(([tier, tierPlayers]) => (
              <div className="tier__container" key={tier}>
                <div>TIER {tier}</div>
                <div className="tier__players">
                  {tierPlayers
                    .slice(
                      0,
                      expandedTiers[`${position}-${tier}`] ? undefined : 10
                    )
                    .map((player) => (
                      <div className="tier__player" key={player.id}>
                        <div>{player.full_name}</div>
                      </div>
                    ))}
                </div>
                {tierPlayers.length > 10 && (
                  <button
                    className="expand-button"
                    onClick={() => toggleTierExpansion(position, tier)}
                  >
                    {expandedTiers[`${position}-${tier}`]
                      ? 'Collapse'
                      : 'Expand'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Tiers;
