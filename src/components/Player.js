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
        <td style={{ borderRight: '1px solid' }}>{player.bye}</td>
        <td>{player.personal_ranking}</td>
        <td>{player.espn_ranking}</td>
        <td>{player.nfl_ranking}</td>
        <td>{player.yahoo_ranking}</td>
        <td>{player.ringer_ranking}</td>
        <td style={{ borderRight: '1px solid' }}>{player.fp_ranking}</td>
        <td>{Math.round(player.espn_adp)}</td>
        <td>{Math.round(player.nfl_adp)}</td>
        <td>{Math.round(player.yahoo_adp)}</td>
        <td>{Math.round(player.fp_adp)}</td>
        <td style={{ borderRight: '1px solid' }}>
          {Math.round(player.avg_adp)}
        </td>
        <td>{Math.round(player.espn_adp - player.espn_ranking) || '-'}</td>
        <td>{Math.round(player.nfl_adp - player.nfl_ranking) || '-'}</td>
        <td>{Math.round(player.yahoo_adp - player.yahoo_ranking) || '-'}</td>
        <td>{Math.round(player.fp_adp - player.fp_ranking) || '-'}</td>
        <td>{Math.round(player.avg_adp - player.avg_ranking) || '-'}</td>
        <td>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</td>
      </tr>
      {expanded && (
        <tr className="player__expanded">
          <td colSpan="22">
            <div className="expanded__heading">DEPTH CHART</div>
            <div className="roster">
              <div style={{ marginLeft: '50px' }}>
                <div className="roster__position">QB</div>
                {player.team.qb &&
                  Object.entries(player.team.qb)
                    .sort((a, b) => a[1] - b[1])
                    .map((qb) => <div className="roster__name">{qb[0]}</div>)}
              </div>
              <div>
                <div className="roster__position">RB</div>
                {player.team.rb &&
                  Object.entries(player.team.rb)
                    .sort((a, b) => a[1] - b[1])
                    .map((rb) => <div className="roster__name">{rb[0]}</div>)}
              </div>
              <div>
                <div className="roster__position">WR1</div>
                {player.team.wr1 &&
                  Object.entries(player.team.wr1)
                    .sort((a, b) => a[1] - b[1])
                    .map((wr1) => <div className="roster__name">{wr1[0]}</div>)}
              </div>
              <div>
                <div className="roster__position">WR2</div>
                {player.team.wr2 &&
                  Object.entries(player.team.wr2)
                    .sort((a, b) => a[1] - b[1])
                    .map((wr2) => <div className="roster__name">{wr2[0]}</div>)}
              </div>
              <div>
                <div className="roster__position">WR3</div>
                {player.team.wr3 &&
                  Object.entries(player.team.wr3)
                    .sort((a, b) => a[1] - b[1])
                    .map((wr3) => <div className="roster__name">{wr3[0]}</div>)}
              </div>
              <div>
                <div className="roster__position">TE</div>
                {player.team.te &&
                  Object.entries(player.team.te)
                    .sort((a, b) => a[1] - b[1])
                    .map((te) => <div className="roster__name">{te[0]}</div>)}
              </div>{' '}
            </div>
            <div className="injury">
              <div>INJURY STATUS</div>
              <div className="injury__body">
                <div>{player.injury_status || 'No injuries reported'}</div>
                <div>{player.injury_body_part}</div>
                <div>{player.injury_start_date}</div>
              </div>
            </div>

            <div className="tiers">
              <div>{player.fp_tier}</div>
              <div>{player.ringer_tier}</div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default Player;
