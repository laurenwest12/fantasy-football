import React, { useState } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const Player = ({ player, tier }) => {
  const [expanded, setExpanded] = useState(false);
  const isPicked = player.picks && player.picks.length > 0;
  const playerClassName = `player${isPicked ? ' picked' : ''}${
    tier % 2 === 0 ? ' even' : ' odd'
  }`;
  const imageClassName = `player__image${isPicked ? '__picked' : ''}`;
  const playerImgUrl = `https://sleepercdn.com/content/nfl/players/thumb/${player.id}.jpg`;
  const positionClass = `position ${player.position.toLowerCase()}${
    isPicked ? '__picked' : '__selected'
  }`;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <tr className={playerClassName} onClick={toggleExpanded}>
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
        <td>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</td>
      </tr>
      {expanded && (
        <tr className="player__expanded">
          <td colSpan="22">
            <div className="expanded__heading">DEPTH CHART</div>
            <div className="roster">
              <div style={{ marginLeft: '50px' }}>
                <div className="roster__position">QB</div>
                <div className="roster__name">Joe Burrow</div>
                <div className="roster__name">Trevor Siemian</div>
              </div>
              <div>
                <div className="roster__position">RB</div>
                <div className="roster__name">Joe Mixon</div>
                <div className="roster__name">Chase Brown</div>
              </div>
              <div>
                <div className="roster__position">WR1</div>
                <div className="roster__name">Ja'Marr Chase</div>
                <div className="roster__name">Charlie Jones</div>
              </div>
              <div>
                <div className="roster__position">WR2</div>
                <div className="roster__name">Tee Higgins</div>
                <div className="roster__name">Stanley Morgan</div>
              </div>
              <div>
                <div className="roster__position">WR3</div>
                <div className="roster__name">Tyler Boyd</div>
              </div>

              <div>
                <div className="roster__position">TE</div>
                <div className="roster__name">Irv Smith</div>
                <div className="roster__name">Nick Bowers</div>
                <div className="roster__name">Devin Asiasi</div>
              </div>
            </div>
            <div className="injury">
              <div>INJURY STATUS</div>
              <div className="injury__body">
                <div>{player.injury_status || 'No injuries reported'}</div>
                <div>{player.injury_body_part}</div>
                <div>{player.injury_start_date}</div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default Player;
