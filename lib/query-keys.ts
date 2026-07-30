export const queryKeys = {
  users: {
    list: (search?: string) => ["users", "list", search?.trim() || null] as const,
    detail: (uuid: string) => ["users", "detail", uuid] as const,
  },
  posts: {
    list: (userUuid?: string) => ["posts", "list", userUuid ?? null] as const,
    detail: (id: string) => ["posts", "detail", id] as const,
  },
  stories: {
    list: (userUuid?: string) =>
      ["stories", "list", userUuid ?? null] as const,
    detail: (storyId: string) => ["stories", "detail", storyId] as const,
  },
};
