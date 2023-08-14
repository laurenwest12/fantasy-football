import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Player from './Player';
import Board from './Board';
import socketIOClient from 'socket.io-client';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [picks, setPicks] = useState([]);
  const [selectedPositions, setSelectedPositions] = useState([]);
  const [sort, setSort] = useState('avg_ranking ASC');
  const [display, setDisplay] = useState('list');
  const [tierFilter, setTierFilter] = useState('avg_tier');

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

      const players = await axios.get(url);
      setPlayers(players.data);

      const picks = await axios.get(`/api/picks`);
      setPicks(picks.data);
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

  const groupPlayersByTier = () => {
    if (tierFilter) {
      const groupedPlayers = {};
      players.forEach((player) => {
        const tier = player[tierFilter];
        if (!groupedPlayers[tier]) {
          groupedPlayers[tier] = [];
        }
        groupedPlayers[tier].push(player);
      });

      if (groupedPlayers[0]) {
        const noTier = groupedPlayers[0];
        groupedPlayers['null'] = noTier;
        delete groupedPlayers[0];
      }
      return groupedPlayers;
    } else {
      return { ALL: players };
    }
  };

  const Tiers = () => (
    <div className="views__header">
      <div>TIERS</div>
      <div className="filters__views">
        <div
          className="views__option"
          style={{
            fontWeight: tierFilter === 'avg_tier' ? 550 : 400,
            textDecoration: tierFilter === 'avg_tier' ? 'underline' : '',
          }}
          onClick={() => setTierFilter('avg_tier')}
        >
          AVG
        </div>
        <div
          className="views__option"
          style={{
            fontWeight: tierFilter === 'fp_tier' ? 550 : 400,
            textDecoration: tierFilter === 'fp_tier' ? 'underline' : '',
          }}
          onClick={() => setTierFilter('fp_tier')}
        >
          FP
        </div>
        <div
          className="views__option"
          style={{
            fontWeight: tierFilter === 'ringer_tier' ? 550 : 400,
            textDecoration: tierFilter === 'ringer_tier' ? 'underline' : '',
          }}
          onClick={() => setTierFilter('ringer_tier')}
        >
          RING
        </div>
        <div
          className="views__option"
          style={{
            fontWeight: tierFilter === '' ? 550 : 400,
            textDecoration: tierFilter === '' ? 'underline' : '',
          }}
          onClick={() => setTierFilter('')}
        >
          NONE
        </div>
      </div>
    </div>
  );

  const Views = () => (
    <div className="views__header">
      <div>VIEW BY</div>
      <div className="filters__views">
        <div
          className="views__option"
          style={{
            fontWeight: display === 'list' ? 550 : 400,
            textDecoration: display === 'list' ? 'underline' : '',
          }}
          onClick={() => setDisplay('list')}
        >
          LIST
        </div>
        <div
          className="views__option"
          style={{
            fontWeight: display === 'tiers' ? 550 : 400,
            textDecoration: display === 'tiers' ? 'underline' : '',
          }}
          onClick={() => setDisplay('tiers')}
        >
          TIERS
        </div>
        <div
          className="views__option"
          style={{
            fontWeight: display === 'board' ? 550 : 400,
            textDecoration: display === 'board' ? 'underline' : '',
          }}
          onClick={() => setDisplay('board')}
        >
          BOARD
        </div>
      </div>
    </div>
  );

  const Positions = () => (
    <div className="filters__position">
      <div>
        <div>POSITION</div>
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
    </div>
  );

  if (display === 'list') {
    return (
      <div className="players__container">
        <div className="players__filters">
          <Tiers />
          <Views />
          <Positions />
        </div>
        <div className="players__table">
          <table style={{ borderCollapse: 'collapse' }}>
            <tr className="players__table__groupings">
              <th colspan="6" className="players__table__grouping">
                INFO
              </th>
              <th colspan="6" className="players__table__grouping">
                RANKINGS
              </th>
              <th colspan="5" className="players__table__grouping">
                ADP
              </th>
              <th colspan="6" className="players__table__grouping">
                VAL
              </th>
            </tr>
            <tr className="players__table__header">
              <th
                className="players__table__sort"
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
                className="players__table__sort"
                onClick={() => setSort('espn_ranking ASC')}
                style={{
                  textDecoration:
                    sort === 'espn_ranking ASC' ? 'underline' : '',
                  fontWeight: sort === 'espn_ranking ASC' ? '900' : '700',
                }}
              >
                ESPN
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('nfl_ranking ASC')}
                style={{
                  textDecoration: sort === 'nfl_ranking ASC' ? 'underline' : '',
                  fontWeight: sort === 'nfl_ranking ASC' ? '900' : '700',
                }}
              >
                NFL
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('yahoo_ranking ASC')}
                style={{
                  textDecoration:
                    sort === 'yahoo_ranking ASC' ? 'underline' : '',
                  fontWeight: sort === 'yahoo_ranking ASC' ? '900' : '700',
                }}
              >
                YAH
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('ringer_ranking ASC')}
                style={{
                  textDecoration:
                    sort === 'ringer_ranking ASC' ? 'underline' : '',
                  fontWeight: sort === 'ringer_ranking ASC' ? '900' : '700',
                }}
              >
                RING
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('fp_ranking ASC')}
                style={{
                  textDecoration: sort === 'fp_ranking ASC' ? 'underline' : '',
                  fontWeight: sort === 'fp_ranking ASC' ? '900' : '700',
                }}
              >
                FP
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('espn_adp ASC')}
                style={{
                  textDecoration: sort === 'espn_adp ASC' ? 'underline' : '',
                  fontWeight: sort === 'espn_adp ASC' ? '900' : '700',
                }}
              >
                ESPN
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('nfl_adp ASC')}
                style={{
                  textDecoration: sort === 'nfl_adp ASC' ? 'underline' : '',
                  fontWeight: sort === 'nfl_adp ASC' ? '900' : '700',
                }}
              >
                NFL
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('yahoo_adp ASC')}
                style={{
                  textDecoration: sort === 'yahoo_adp ASC' ? 'underline' : '',
                  fontWeight: sort === 'yahoo_adp ASC' ? '900' : '700',
                }}
              >
                YAH
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('fp_adp ASC')}
                style={{
                  textDecoration: sort === 'fp_adp ASC' ? 'underline' : '',
                  fontWeight: sort === 'fp_adp ASC' ? '900' : '700',
                }}
              >
                FP
              </th>
              <th
                className="players__table__sort"
                onClick={() => setSort('avg_adp ASC')}
                style={{
                  textDecoration: sort === 'avg_adp ASC' ? 'underline' : '',
                  fontWeight: sort === 'avg_adp ASC' ? '900' : '700',
                }}
              >
                AVG
              </th>
              <th>ESPN</th>
              <th>NFL</th>
              <th>YAH</th>
              <th>FP</th>
              <th>AVG</th>
              <th></th>
            </tr>
            {Object.entries(groupPlayersByTier()).map(([tier, tierPlayers]) => (
              <React.Fragment key={tier}>
                <tr>
                  <th colSpan="23" className="tier">
                    TIER {tier}
                  </th>
                </tr>
                {tierPlayers.map((player) => (
                  <Player key={player.id} player={player} tier={tier} />
                ))}
              </React.Fragment>
            ))}
          </table>
        </div>
      </div>
    );
  } else if (display === 'tiers') {
    return (
      <div className="players__container">
        <div className="players__filters">
          <Tiers />
          <Views />
          <Positions />
        </div>
        <div className="players__table"></div>
      </div>
    );
  } else {
    return (
      <div className="draft__container">
        <div className="draft__filters">
          <Tiers />
          <Views />
          <Positions />
        </div>
        <div className="draft__table">
          <Board picks={picks} />
        </div>
      </div>
    );
  }
};

export default Players;
