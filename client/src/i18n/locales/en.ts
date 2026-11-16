const en = {
  nav: {
    home: "Home",
    hello: "Hello, {{name}}",
    logout: "Logout",
    logoutConfirmTitle: "Are you sure you want to log out?",
    logoutConfirmDesc: "You will be logged out and redirected to the login screen.",
    cancel: "Cancel",
    logoutConfirm: "Yes, log out",
  },

  login: {
    title: "Sign in to your account",
  },

  common: {
    back: "Back",
    toggleSidebar: "Toggle sidebar",
    comingSoon: "Coming soon",
    loading: {
      title: "Loading...",
      buttonText: "Loading...",
      fetchData: "Loading...",
    },
  },

  notFound: {
    description: "Page not found",
    goHome: "Go home",
  },
} as const;

export default en;
