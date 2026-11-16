const he = {
  nav: {
    home: "דף הבית",
    hello: "שלום, {{name}}",
    logout: "התנתקות",
    logoutConfirmTitle: "האם אתה בטוח שברצונך להתנתק?",
    logoutConfirmDesc: "תנותק מהמערכת ותועבר למסך ההתחברות.",
    cancel: "ביטול",
    logoutConfirm: "כן, התנתק",
  },

  login: {
    title: "התחברות לחשבון שלך",
  },

  common: {
    back: "חזרה",
    toggleSidebar: "הצג/הסתר תפריט",
    comingSoon: "בקרוב",
    loading: {
      title: "טוען...",
      buttonText: "טוען...",
      fetchData: "טוען...",
    },
  },

  notFound: {
    description: "הדף לא נמצא",
    goHome: "לדף הבית",
  },
} as const;

export default he;
