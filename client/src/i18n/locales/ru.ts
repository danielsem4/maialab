const ru = {
  nav: {
    home: "Главная",
    hello: "Здравствуйте, {{name}}",
    logout: "Выйти",
    logoutConfirmTitle: "Вы уверены, что хотите выйти?",
    logoutConfirmDesc: "Вы выйдете из системы и будете перенаправлены на экран входа.",
    cancel: "Отмена",
    logoutConfirm: "Да, выйти",
  },

  login: {
    title: "Вход в аккаунт",
  },

  common: {
    back: "Назад",
    toggleSidebar: "Показать/скрыть меню",
    comingSoon: "Скоро",
    loading: {
      title: "Загрузка...",
      buttonText: "Загрузка...",
      fetchData: "Загрузка...",
    },
  },

  notFound: {
    description: "Страница не найдена",
    goHome: "На главную",
  },
} as const;

export default ru;
