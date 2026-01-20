// Notification settings keys
export const NOTIFICATION_KEYS = {
  all: ["notification-settings"] as const,
  settings: () => [...NOTIFICATION_KEYS.all, "settings"] as const,
} as const;

export const conversationQueryKeys = {
  all: ["conversations"] as const,
  list: (params?: {
    page?: number;
    per_page?: number;
    user_website_id?: number;
  }) => [...conversationQueryKeys.all, "list", params] as const,
  listInfinite: (params?: {
    page?: number;
    per_page?: number;
    user_website_id?: number;
  }) => [...conversationQueryKeys.all, "infinite", params] as const,
  details: (id: string | number | undefined) =>
    [...conversationQueryKeys.all, "details", id] as const,
  history: (id: string | number) =>
    [...conversationQueryKeys.all, "history", id] as const,

  //   limit: number;
  // }) => [...conversationQueryKeys.all, "history", params] as const,
};

export const AGENT_KEYS = {
  all: ["agents"] as const,
  byWebsite: (websiteId: number) =>
    [...AGENT_KEYS.all, "website", websiteId] as const,
  current: () => [...AGENT_KEYS.all, "current"] as const,
};

export const REQUEST_HISTORY_KEYS = {
  all: ["request-history"] as const,
  byWebsite: (websiteId: number) =>
    [...REQUEST_HISTORY_KEYS.all, websiteId] as const,
};

export const LANGUAGE_KEYS = {
  all: ["languages"] as const,
  list: () => [...LANGUAGE_KEYS.all, "list"] as const,
} as const;
