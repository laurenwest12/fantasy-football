import logo from './logo.svg';
import './App.css';
import Players from './components/Players';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { lime, purple } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    // <ThemeProvider theme={darkTheme}>
    <div className="App">
      <Players />
    </div>
    // </ThemeProvider>
  );
}

export default App;
