export const queryKeys = {
  users: {
    list: (search?: string, ordering?: string) =>
      ["users", "list", search?.trim() || null, ordering || null] as const,
    detail: (uuid: string) => ["users", "detail", uuid] as const,
  },
  posts: {
    list: (userUuid?: string, search?: string) =>
      ["posts", "list", userUuid ?? null, search?.trim() || null] as const,
    detail: (id: string) => ["posts", "detail", id] as const,
    similar: (id: string) => ["posts", "similar", id] as const,
  },
  stories: {
    list: (userUuid?: string, search?: string) =>
      ["stories", "list", userUuid ?? null, search?.trim() || null] as const,
    detail: (storyId: string) => ["stories", "detail", storyId] as const,
    similar: (storyId: string) => ["stories", "similar", storyId] as const,
  },
};
