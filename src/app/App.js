import React from 'react'
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import history from '@history';
import { BrowserRouter, Router, Switch } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import withAppProviders from './withAppProviders';
// import axios from 'axios';

/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const App = () => {
  React.useEffect(() => {
    window.addEventListener('storage', (e) => {
      if (e.key == "profile" && e.oldValue) {
        localStorage.removeItem("profile")
        window.location.reload();
      }
    })
  }, [])
  return (
    <Router history={history}>
      <FuseTheme>
        <SnackbarProvider
          maxSnack={5}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          classes={{
            containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
          }}
        >
          <FuseLayout />
        </SnackbarProvider>
      </FuseTheme>
    </Router>
  );
};

export default withAppProviders(App)();
