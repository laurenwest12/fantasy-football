import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);

  useEffect(() => {
    fetchData();
  }, [selectedPositions]);

  const fetchData = async () => {
    try {
      const url =
        selectedPositions.length > 0
          ? `/api/players/positions/?positions=${selectedPositions.join(',')}`
          : '/api/players';

      const res = await axios.get(url);
      setPlayers(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handlePositionChange = (position) => {
    if (position === '') {
      setSelectedPositions(['QB', 'WR', 'RB', 'TE', 'DEF', 'K']);
    } else {
      setSelectedPositions((prevPositions) =>
        prevPositions.includes(position)
          ? prevPositions.filter((pos) => pos !== position)
          : [...prevPositions, position]
      );
    }
  };

  return (
    <div>
      <button
        value="QB"
        onClick={() => handlePositionChange('QB')}
        style={{
          backgroundColor: selectedPositions.includes('QB') ? 'green' : 'white',
          color: selectedPositions.includes('QB') ? 'white' : 'black',
        }}
      >
        QB
      </button>
      <button
        value="WR"
        onClick={() => handlePositionChange('WR')}
        style={{
          backgroundColor: selectedPositions.includes('WR') ? 'green' : 'white',
          color: selectedPositions.includes('WR') ? 'white' : 'black',
        }}
      >
        WR
      </button>
      <button
        value="RB"
        onClick={() => handlePositionChange('RB')}
        style={{
          backgroundColor: selectedPositions.includes('RB') ? 'green' : 'white',
          color: selectedPositions.includes('RB') ? 'white' : 'black',
        }}
      >
        RB
      </button>
      <button
        value="TE"
        onClick={() => handlePositionChange('TE')}
        style={{
          backgroundColor: selectedPositions.includes('TE') ? 'green' : 'white',
          color: selectedPositions.includes('TE') ? 'white' : 'black',
        }}
      >
        TE
      </button>
      <button
        value="DEF"
        onClick={() => handlePositionChange('DEF')}
        style={{
          backgroundColor: selectedPositions.includes('DEF')
            ? 'green'
            : 'white',
          color: selectedPositions.includes('DEF') ? 'white' : 'black',
        }}
      >
        DEF
      </button>
      <button
        value="K"
        onClick={() => handlePositionChange('K')}
        style={{
          backgroundColor: selectedPositions.includes('K') ? 'green' : 'white',
          color: selectedPositions.includes('K') ? 'white' : 'black',
        }}
      >
        K
      </button>
      <button value="" onClick={() => handlePositionChange('')}>
        CLEAR
      </button>

      <h1>Player List</h1>
      <div className="players">
        {' '}
        <ul>
          {players.map((player) => (
            <li key={player.id}>{player.full_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Players;
