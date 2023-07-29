import React from 'react';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Player = ({ player }) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Typography>{player.full_name}</Typography>
          <Typography>{player.position}</Typography>
          <Typography>{player.bye}</Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <br />
          Team: {player.team}
          <br />
          Bye: {player.bye}
        </Typography>
      </AccordionDetails>
    </Accordion>
    // <ListItem key={player.id}>
    //   <ListItemText>{player.full_name}</ListItemText>
    //   <ListItemText>{player.bye}</ListItemText>
    // </ListItem>
  );
};

export default Player;
