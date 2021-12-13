import { combineReducers } from '@reduxjs/toolkit';
import dialog from './dialogSlice';
import message from './messageSlice';
import navbar from './navbarSlice';
import navigation from './navigationSlice';
import settings from './settingsSlice';
import tickets from './ticketsSlice'
import candidates from './candidateSlice'
import user from './userSlice'
const fuseReducers = combineReducers({
  navigation,
  settings,
  navbar,
  message,
  dialog,
  tickets,
  candidates,
  user
});

export default fuseReducers;
