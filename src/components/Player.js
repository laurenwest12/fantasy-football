import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Player = ({ player }) => {
  const isPicked = player.picks && player.picks.length > 0;
  const playerClassName = `player${isPicked ? ' picked' : ''}`;
  const imageClassName = `player__image${isPicked ? '__picked' : ''}`;
  const playerImgUrl = `https://sleepercdn.com/content/nfl/players/thumb/${player.id}.jpg`;
  const positionClass = `position ${player.position.toLowerCase()}${
    isPicked ? '__picked' : ''
  }`;

  return (
    <tr className={playerClassName}>
      <td style={{ width: '25px' }}>{player.avg_ranking}</td>
      <td>
        <img src={playerImgUrl} className={imageClassName} />
      </td>
      <td style={{ width: '200px' }}>{player.full_name}</td>
      <td className={positionClass}>{player.position}</td>
      <td>{player.age}</td>
      <td>{player.bye}</td>
      <td>{player.personal_ranking}</td>
      <td>{player.espn_ranking}</td>
      <td>{player.nfl_ranking}</td>
      <td>{player.yahoo_ranking}</td>
      <td>{player.fp_ranking}</td>
      <td>{player.espn_adp}</td>
      <td>{player.nfl_adp}</td>
      <td>{player.yahoo_adp}</td>
      <td>{player.fp_adp}</td>
      <td>{player.avg_adp}</td>
      <td>{player.espn_adp - player.espn_ranking || '-'}</td>
      <td>{player.nfl_adp - player.nfl_ranking || '-'}</td>
      <td>{player.yahoo_adp - player.yahoo_ranking || '-'}</td>
      <td>{player.fp_adp - player.fp_ranking || '-'}</td>
      <td>{player.avg_adp - player.avg_ranking || '-'}</td>
    </tr>
  );
};

export default Player;
