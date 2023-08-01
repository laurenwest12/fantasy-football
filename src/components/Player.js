import React from 'react';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Player = ({ player }) => {
  const isPicked = player.picks && player.picks.length > 0;
  const playerClassName = `player ${isPicked ? 'picked' : ''}`;
  const playerImgUrl = `https://sleepercdn.com/content/nfl/players/thumb/${player.id}.jpg`;
  const positionClass = `position ${player.position.toLowerCase()}${
    isPicked ? '__picked' : ''
  }`;

  return (
    <tr className={playerClassName}>
      <td>{player.avg_ranking}</td>
      <td>
        <img src={playerImgUrl} className="player__image" />
      </td>
      <td>{player.full_name}</td>
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

  // return (
  //   <TableRow
  //     className={playerClassName}
  //     over
  //     role="checkbox"
  //     tabIndex={-1}
  //     key={player.id}
  //   >
  //     <TableCell component="th" scope="row">
  //       {player.avg_ranking}
  //     </TableCell>
  //     <TableCell>
  //       <img className="player__image" src={playerImgUrl} />
  //     </TableCell>
  //     <TableCell align="left">{player.full_name}</TableCell>
  //     <TableCell align="left">
  //       <div className={positionClass}>{player.position}</div>
  //     </TableCell>
  //     <TableCell align="left">{player.bye}</TableCell>
  //     <TableCell align="left">{player.espn_ranking}</TableCell>
  //     <TableCell align="left">{player.nfl_ranking}</TableCell>
  //     <TableCell align="left">{player.yahoo_ranking}</TableCell>
  //     <TableCell align="left">{player.fp_ranking}</TableCell>
  //   </TableRow>
  // );
};

export default Player;
