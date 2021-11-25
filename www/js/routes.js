const routes = [
  {
    name: 'home',
    path: '/',
    url: './index.html',
  },
  {
    name: 'history',
    path: '/history',
    url: './pages/history.html',
  },
  {
    name: 'questions',
    path: '/questions',
    url: './pages/questions.html',
  },
  {
    name: 'about',
    path: '/about',
    url: './pages/about.html',
  },
  {
    path: '/login/',
    el: document.querySelector('.page[data-name="popup-view"]'),
  },
  {
    path: '/register/',
    componentUrl: './pages/register.html',
  },
  {
    path: '/thread/:name/',
    componentUrl: './pages/thread.html',
  },
  // Default Route (404 page). MUST BE THE LAST
  {
    path: '(.*)',
    url: './pages/404.html',
  },
];