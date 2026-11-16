/** Central query keys. `admin` keys include drafts; `public` keys only published content. */
export const queryKeys = {
  media: ["media"] as const,
  labInfo: ["lab-info"] as const,
  dashboard: ["dashboard"] as const,
  users: ["admin-users"] as const,
  projects: {
    all: ["projects"] as const,
    public: () => ["projects", "public"] as const,
    publicDetail: (slug: string) => ["projects", "public", slug] as const,
    admin: () => ["projects", "admin"] as const,
    adminDetail: (id: number) => ["projects", "admin", id] as const,
  },
  members: {
    all: ["members"] as const,
    public: () => ["members", "public"] as const,
    admin: () => ["members", "admin"] as const,
  },
  publications: {
    all: ["publications"] as const,
    public: () => ["publications", "public"] as const,
    admin: () => ["publications", "admin"] as const,
  },
  news: {
    all: ["news"] as const,
    public: () => ["news", "public"] as const,
    publicDetail: (slug: string) => ["news", "public", slug] as const,
    admin: () => ["news", "admin"] as const,
  },
};
