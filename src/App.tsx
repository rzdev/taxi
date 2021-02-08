import React from 'react';
import { ThemeProvider } from 'styled-components';
import {QueryClient, QueryClientProvider} from 'react-query';
import MapView from './pages/MapView/MapView.container';
import NoSsr from '@material-ui/core/NoSsr';
import { createMuiTheme } from '@material-ui/core/styles';

//create react query client
const queryClient = new QueryClient();

//create material ui theme
const theme = createMuiTheme();

function App() {
  return (
    <NoSsr>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <MapView />
        </QueryClientProvider>
      </ThemeProvider>
    </NoSsr>
  );
}

export default App;
