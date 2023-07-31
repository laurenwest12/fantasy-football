import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Player from './Player';
import socketIOClient from 'socket.io-client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [sort, setSort] = useState('avg_ranking ASC');

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
      setSelectedPositions([]);
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

  const filterByTier = (players, tier) => {
    return players.filter((player) => player.fp_tier === tier);
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <Button
          value="QB"
          variant="outlined"
          style={{
            color: selectedPositions.includes('QB') ? '#121212' : '#F92A6D',
            backgroundColor: selectedPositions.includes('QB')
              ? '#F92A6D'
              : '#121212',
            borderColor: '#F92A6D',
          }}
          onClick={() => handlePositionChange('QB')}
        >
          QB
        </Button>
        <Button
          value="WR"
          onClick={() => handlePositionChange('WR')}
          variant="outlined"
          style={{
            color: selectedPositions.includes('WR') ? '#121212' : '#58A8FF',
            backgroundColor: selectedPositions.includes('WR')
              ? '#58A8FF'
              : '#121212',
            borderColor: '#58A8FF',
          }}
        >
          WR
        </Button>
        <Button
          value="RB"
          onClick={() => handlePositionChange('RB')}
          variant="outlined"
          style={{
            color: selectedPositions.includes('RB') ? '#121212' : '#2FCAB5',
            backgroundColor: selectedPositions.includes('RB')
              ? '#2FCAB5'
              : '#121212',
            borderColor: '#2FCAB5',
          }}
        >
          RB
        </Button>
        <Button
          value="TE"
          onClick={() => handlePositionChange('TE')}
          variant="outlined"
          style={{
            color: selectedPositions.includes('TE') ? '#121212' : '#FBAE58',
            backgroundColor: selectedPositions.includes('TE')
              ? '#FBAE58'
              : '#121212',
            borderColor: '#FBAE58',
          }}
        >
          TE
        </Button>
        <Button
          value="DEF"
          onClick={() => handlePositionChange('DEF')}
          variant="outlined"
          style={{
            color: selectedPositions.includes('DEF') ? '#121212' : '#58A8FF',
            backgroundColor: selectedPositions.includes('DEF')
              ? '#58A8FF'
              : '#121212',
          }}
        >
          DEF
        </Button>
        <Button
          value="K"
          onClick={() => handlePositionChange('K')}
          variant="outlined"
          style={{
            color: selectedPositions.includes('K') ? '#121212' : '#58A8FF',
            backgroundColor: selectedPositions.includes('K')
              ? '#58A8FF'
              : '#121212',
          }}
        >
          K
        </Button>
      </Stack>
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
      <Paper sx={{ width: '100%' }}>
        <TableContainer className="players" sx={{ maxHeight: 1000 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead className="players__header">
              <TableRow>
                <TableCell align="center" colSpan={5}>
                  Player Info
                </TableCell>
                <TableCell align="center" colSpan={4}>
                  Rankings
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell width="50" className="sort">
                  Rank
                </TableCell>
                <TableCell width="36"></TableCell>
                <TableCell width="200" align="left">
                  Name
                </TableCell>
                <TableCell align="left">Position</TableCell>
                <TableCell align="left">Bye</TableCell>
                <TableCell align="left">ESPN</TableCell>
                <TableCell align="left">NFL</TableCell>
                <TableCell align="left">Yahoo</TableCell>
                <TableCell align="left">FP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map((player) => (
                <Player key={player.id} player={player} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
};

export default Players;
