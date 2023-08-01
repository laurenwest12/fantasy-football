import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Player from './Player';
import socketIOClient from 'socket.io-client';

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

  const filterByTier = (players, tier) => {
    return players.filter((player) => player.fp_tier === tier);
  };

  return (
    <div className="players__container">
      <div className="players__filters">
        <button
          className={
            selectedPositions.includes('QB')
              ? 'players__filter qb__selected'
              : 'players__filter qb'
          }
          onClick={() => handlePositionChange('QB')}
        >
          QB
        </button>
        <button
          className={
            selectedPositions.includes('WR')
              ? 'players__filter wr__selected'
              : 'players__filter wr'
          }
          onClick={() => handlePositionChange('WR')}
        >
          WR
        </button>
        <button
          className={
            selectedPositions.includes('RB')
              ? 'players__filter rb__selected'
              : 'players__filter rb'
          }
          onClick={() => handlePositionChange('RB')}
        >
          RB
        </button>
        <button
          className={
            selectedPositions.includes('TE')
              ? 'players__filter te__selected'
              : 'players__filter te'
          }
          onClick={() => handlePositionChange('TE')}
        >
          TE
        </button>
        <button
          className={
            selectedPositions.includes('DEF')
              ? 'players__filter def__selected'
              : 'players__filter def'
          }
          onClick={() => handlePositionChange('DEF')}
        >
          DEF
        </button>
        <button
          className={
            selectedPositions.includes('K')
              ? 'players__filter k__selected'
              : 'players__filter k'
          }
          onClick={() => handlePositionChange('K')}
        >
          K
        </button>
      </div>
      <div className="players__table">
        <table style={{ borderCollapse: 'collapse' }}>
          <tr className="players__table__groupings">
            <th colspan="5" className="players__table__grouping">
              INFO
            </th>
            <th colspan="6" className="players__table__grouping">
              RANKINGS
            </th>
            <th colspan="5" className="players__table__grouping">
              ADP
            </th>
            <th colspan="5" className="players__table__grouping">
              VAL
            </th>
          </tr>
          <tr className="players__table__header">
            <th
              onClick={() => setSort('avg_ranking ASC')}
              style={{
                textDecoration: sort === 'avg_ranking ASC' ? 'underline' : '',
                fontWeight: sort === 'avg_ranking ASC' ? '900' : '700',
              }}
            >
              RK
            </th>
            <th></th>
            <th>NAME</th>
            <th>POS</th>
            <th>AGE</th>
            <th>BYE</th>
            <th>PERS</th>
            <th
              onClick={() => setSort('espn_ranking ASC')}
              style={{
                textDecoration: sort === 'espn_ranking ASC' ? 'underline' : '',
                fontWeight: sort === 'espn_ranking ASC' ? '900' : '700',
              }}
            >
              ESPN
            </th>
            <th
              onClick={() => setSort('nfl_ranking ASC')}
              style={{
                textDecoration: sort === 'nfl_ranking ASC' ? 'underline' : '',
                fontWeight: sort === 'nfl_ranking ASC' ? '900' : '700',
              }}
            >
              NFL
            </th>
            <th>YAHOO</th>
            <th>FP</th>
            <th>ESPN</th>
            <th>NFL</th>
            <th>YAHOO</th>
            <th>FP</th>
            <th>AVG</th>
            <th>ESPN</th>
            <th>NFL</th>
            <th>YAHOO</th>
            <th>FP</th>
            <th>AVG</th>
          </tr>
          {players.map((player) => (
            <Player key={player.id} player={player} />
          ))}
        </table>
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <Stack className="filters" direction="row" spacing={2}>
  //       <Button
  //         value="QB"
  //         variant="outlined"
  //         style={{
  //           color: selectedPositions.includes('QB') ? '#2c3749' : '#F92A6D',
  //           backgroundColor: selectedPositions.includes('QB')
  //             ? '#F92A6D'
  //             : '#2c3749',
  //           border: 0,
  //           fontWeight: 700,
  //         }}
  //         onClick={() => handlePositionChange('QB')}
  //       >
  //         QB
  //       </Button>
  //       <Button
  //         value="WR"
  //         onClick={() => handlePositionChange('WR')}
  //         variant="outlined"
  //         style={{
  //           color: selectedPositions.includes('WR') ? '#2c3749' : '#58A8FF',
  //           backgroundColor: selectedPositions.includes('WR')
  //             ? '#58A8FF'
  //             : '#2c3749',
  //           border: 0,
  //           fontWeight: 700,
  //         }}
  //       >
  //         WR
  //       </Button>
  //       <Button
  //         value="RB"
  //         onClick={() => handlePositionChange('RB')}
  //         variant="outlined"
  //         style={{
  //           color: selectedPositions.includes('RB') ? '#2c3749' : '#2FCAB5',
  //           backgroundColor: selectedPositions.includes('RB')
  //             ? '#2FCAB5'
  //             : '#2c3749',
  //           border: 0,
  //           fontWeight: 700,
  //         }}
  //       >
  //         RB
  //       </Button>
  //       <Button
  //         value="TE"
  //         onClick={() => handlePositionChange('TE')}
  //         variant="outlined"
  //         style={{
  //           color: selectedPositions.includes('TE') ? '#2c3749' : '#FBAE58',
  //           backgroundColor: selectedPositions.includes('TE')
  //             ? '#FBAE58'
  //             : '#2c3749',
  //           border: 0,
  //           fontWeight: 700,
  //         }}
  //       >
  //         TE
  //       </Button>
  //       <Button
  //         value="DEF"
  //         onClick={() => handlePositionChange('DEF')}
  //         variant="outlined"
  //         style={{
  //           color: selectedPositions.includes('DEF') ? '#2c3749' : '#C480E8',
  //           backgroundColor: selectedPositions.includes('DEF')
  //             ? '#C480E8'
  //             : '#2c3749',
  //           border: 0,
  //           fontWeight: 700,
  //         }}
  //       >
  //         DEF
  //       </Button>
  //       <Button
  //         value="K"
  //         onClick={() => handlePositionChange('K')}
  //         variant="outlined"
  //         style={{
  //           color: selectedPositions.includes('K') ? '#2c3749' : '#F5E679',
  //           backgroundColor: selectedPositions.includes('K')
  //             ? '#F5E679'
  //             : '#2c3749',
  //           border: 0,
  //           fontWeight: 700,
  //         }}
  //       >
  //         K
  //       </Button>
  //       <Button
  //         variant="outlined"
  //         value=""
  //         style={{ backgroundColor: '#2c3749', border: 0, fontWeight: 700 }}
  //         onClick={() => handlePositionChange('')}
  //       >
  //         ALL
  //       </Button>
  //     </Stack>

  //     <Paper sx={{ width: '100%' }}>
  //       <TableContainer className="players" sx={{ maxHeight: 1000 }}>
  //         <Table stickyHeader aria-label="sticky table">
  //           <TableHead className="players__header">
  //             <TableRow className="groupings">
  //               <TableCell align="center" colSpan={5}>
  //                 Player Info
  //               </TableCell>
  //               <TableCell align="center" colSpan={4}>
  //                 Rankings
  //               </TableCell>
  //             </TableRow>
  //             <TableRow>
  //               <TableCell
  //                 width="75"
  //                 className="sort"
  //                 onClick={() => setSort('avg_ranking ASC')}
  //               >
  //                 {sort === 'avg_ranking ASC' ? (
  //                   <ArrowUpwardIcon sx={{ height: 15 }} />
  //                 ) : (
  //                   ''
  //                 )}
  //                 Rank
  //               </TableCell>
  //               <TableCell width="36"></TableCell>
  //               <TableCell width="200" align="left">
  //                 Name
  //               </TableCell>
  //               <TableCell align="left">Position</TableCell>
  //               <TableCell align="left">Bye</TableCell>
  //               <TableCell
  //                 align="left"
  //                 className="sort"
  //                 onClick={() => setSort('espn_ranking ASC')}
  //               >
  //                 {sort === 'espn_ranking ASC' ? (
  //                   <ArrowUpwardIcon sx={{ height: 15 }} />
  //                 ) : (
  //                   ''
  //                 )}
  //                 ESPN
  //               </TableCell>
  //               <TableCell align="left" className="sort">
  //                 NFL
  //               </TableCell>
  //               <TableCell align="left" className="sort">
  //                 Yahoo
  //               </TableCell>
  //               <TableCell align="left" className="sort">
  //                 FP
  //               </TableCell>
  //             </TableRow>
  //           </TableHead>
  //           <TableBody>
  //             {Array.from(Array(16).keys()).map((i) =>
  //               filterByTier(players, i + 1).map((player, j) => (
  //                 <Player key={player.id} player={player} tier={i + 1} />
  //               ))
  //             )}
  //           </TableBody>
  //         </Table>
  //       </TableContainer>
  //     </Paper>
  //   </div>
  // );
};

export default Players;
