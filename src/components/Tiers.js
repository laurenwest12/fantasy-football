import React, { useState, useEffect } from 'react';

const Tiers = ({ players }) => {
  const [expandedTiers, setExpandedTiers] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  const toggleTierExpansion = (position, tier) => {
    setExpandedTiers((prevExpandedTiers) => {
      const key = `${position}-${tier}`;
      return { ...prevExpandedTiers, [key]: !prevExpandedTiers[key] };
    });
  };

  const handlePlayerClick = (event, player) => {
    event.stopPropagation(); // Prevent the click from propagating to the overlay
    setSelectedPlayer(player);
    const rect = event.target.getBoundingClientRect();
    console.log(rect);
    setPopupPosition({ top: rect.top - 25, left: rect.right - 350 });
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupVisible && selectedPlayer) {
        const popupElement = document.querySelector('.popup');
        if (popupElement && !popupElement.contains(event.target)) {
          closePopup();
        }
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [popupVisible, selectedPlayer]);

  return (
    <div
      className={`tiers__container ${popupVisible ? 'overlay-visible' : ''}`}
    >
      {popupVisible && selectedPlayer && (
        <div
          className="popup"
          style={{ top: popupPosition.top, left: popupPosition.left }}
        >
          <div>{selectedPlayer.full_name}</div>
          <div>{selectedPlayer.position}</div>
          <button onClick={closePopup}>Close</button>
        </div>
      )}

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
                      <div
                        className={`tier__player${
                          player.picks.length > 0 ? '__picked' : ''
                        }`}
                        key={player.id}
                      >
                        <div
                          onClick={(event) => handlePlayerClick(event, player)}
                          className="popup-trigger" // Add this class
                        >
                          {player.full_name}
                        </div>
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
