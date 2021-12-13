import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import FuseUtils from '@fuse/utils';
import LoginConfig from 'app/main/Login/LoginConfig'
import Error404PageConfig from 'app/main/404/Error404PageConfig'
import FuseLoading from '@fuse/core/FuseLoading';
import Dashboard from 'app/main/dashboard/index'
import Tickets from 'app/main/tickets'
import Candidates from 'app/main/candidate'
import Calendar from 'app/main/calendar/Calendar'

const routeConfigs = [
  LoginConfig,
  Error404PageConfig
];
const user = JSON.parse(localStorage.getItem("profile"))
const isLogin = user?.isLogin || false
const routes = [
  // if you want to make whole app auth protected by default change defaultAuth for example:
  // ...FuseUtils.generateRoutesFromConfigs(routeConfigs, ['admin','staff','user']),
  // The individual route configs which has auth option won't be overridden.
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, null),
  {
    exact: true,
    path: '/',
    component: () => isLogin ? <Dashboard /> : <Redirect to="dang-nhap" />,
  },
  {
    path: '/ve-tuyen-dung',
    component: () => isLogin ? <Tickets /> : <Redirect to="dang-nhap" />,
  },
  {
    path: '/ung-vien',
    component: () => isLogin ? <Candidates /> : <Redirect to="dang-nhap" />,
  },
  {
    path: '/lich-pv',
    component: () => isLogin ? <Calendar /> : <Redirect to="dang-nhap" />,
  },
  {
    component: () => <Redirect to="/404" />,
  },
];

export default routes;
