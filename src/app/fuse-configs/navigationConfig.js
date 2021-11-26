import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'home',
    url: '/',
    exact: true,
  },
  {
    id: 'list-tickets',
    title: 'Tin tuyển dụng',
    type: 'item',
    icon: 'work',
    url: '/tickets',
    exact: true,
  },
  {
    id: 'candidates',
    title: 'Ứng viên',
    type: 'item',
    icon: 'face',
    url: '/candidates',
    exact: true,
  },
  {
    id: 'calendars',
    title: 'Lịch phỏng vấn',
    type: 'item',
    icon: 'event',
    url: '/calendars',
    exact: true,
  },

];

export default navigationConfig;
