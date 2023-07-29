import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Player from './Player';
import List from '@mui/material/List';
import socketIOClient from 'socket.io-client';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [sort, setSort] = useState('');

  useEffect(() => {
    fetchData();

    const socket = socketIOClient('http://localhost:3001');
    socket.on('updatePlayer', (updatedPlayerData) => {
      setPlayers((prevPlayers) => {
        const updatedPlayers = prevPlayers.map((player) =>
          player.id === updatedPlayerData.id ? updatedPlayerData : player
        );
        return updatedPlayers;
      });
    });

    return () => {
      socket.disconnect(); // Clean up the WebSocket connection on component unmount
    };
  }, [selectedPositions, sort]);

  const fetchData = async () => {
    try {
      let url = '/api/players';

      if (selectedPositions.length && sort.length) {
        url += `?positions=${selectedPositions.join(',')}&sort=${sort}`;
      } else if (selectedPositions.length) {
        url += `?positions=${selectedPositions.join(',')}`;
      } else if (sort.length) {
        url += `?sort=${sort}`;
      }

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

  const handleFilterChange = (filter) => {
    setSort((prevSort) => (prevSort === filter ? '' : filter));
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

      <div></div>
      <button
        value="Name"
        onClick={() => handleFilterChange('full_name ASC')}
        style={{
          backgroundColor: sort.includes('full_name') ? 'green' : 'white',
          color: sort.includes('full_name') ? 'white' : 'black',
        }}
      >
        Name
      </button>
      <h1>Player List</h1>
      <List
        dense
        sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      >
        {players.map((player) => (
          <Player key={player.id} player={player} />
        ))}
      </List>
    </div>
  );
};

export default Players;
