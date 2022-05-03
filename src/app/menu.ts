import { NbMenuItem } from '@nebular/theme';

  
  
export const SIDE_MENU_ITEMS: NbMenuItem[]=  [
    {
      title: 'Home',
      icon: 'home-outline',
      link: '/home',
      home: true
    },
    {
      title: 'apps',
      icon: 'grid-outline',
      link: '/apps'
    },
    {
        title: 'signout',
        icon: 'people-outline',
        link: '/apps'
      }
  ];