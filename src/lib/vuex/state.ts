export const state = {
  auth: {
    token: null,
  } as { token: string | null },
  profile: {
    id: null,
    email: null,
    name: null,
    profilePicture: null,
    role: null,
    createdAt: null
  }
}

export type State = typeof state
