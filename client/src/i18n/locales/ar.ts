const ar = {
  nav: {
    home: "الرئيسية",
    hello: "مرحباً، {{name}}",
    logout: "تسجيل الخروج",
    logoutConfirmTitle: "هل أنت متأكد أنك تريد تسجيل الخروج؟",
    logoutConfirmDesc: "سيتم تسجيل خروجك وتحويلك إلى شاشة تسجيل الدخول.",
    cancel: "إلغاء",
    logoutConfirm: "نعم، سجّل الخروج",
  },

  login: {
    title: "تسجيل الدخول إلى حسابك",
  },

  common: {
    back: "رجوع",
    toggleSidebar: "إظهار/إخفاء القائمة",
    comingSoon: "قريباً",
    loading: {
      title: "جارٍ التحميل...",
      buttonText: "جارٍ التحميل...",
      fetchData: "جارٍ التحميل...",
    },
  },

  notFound: {
    description: "الصفحة غير موجودة",
    goHome: "إلى الرئيسية",
  },
} as const;

export default ar;
