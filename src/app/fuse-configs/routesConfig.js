import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import LoginConfig from 'app/main/Login/LoginConfig'
import FuseLoading from '@fuse/core/FuseLoading';
import Error404Page from 'app/main/404/Error404Page';
import Dashboard from 'app/main/dashboard/index'
import Tickets from 'app/main/tickets'
import Candidates from 'app/main/candidate'
import Calendar from 'app/main/calendar/Calendar'

const routeConfigs = [
  LoginConfig,
];
const isLogin = localStorage.getItem("isLogin")

const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    exact: true,
    path: '/',
    component: () => !isLogin ? <Dashboard /> : <Redirect to="/login" />,
  },
  {
    exact: true,
    path: '/tickets',
    component: () => !isLogin ? <Tickets /> : <Redirect to="/login" />,
  },
  {
    path: '/candidates',
    exact: true,
    component: () => <Candidates />,
  },
  {
    path: '/calendars',
    exact: true,
    component: () => <Calendar />,
  },
  {
    path: '/404',
    component: () => <Error404Page />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
