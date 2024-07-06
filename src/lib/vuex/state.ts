export const state = {
  auth: {
    token: null,
    subject: null,
  } as { token: string | null, subject: number | null },
  profile: {
    id: null,
    email: null,
    name: null,
    profilePicture: null,
    defaultProfilePicture: 'https://i.pinimg.com/736x/09/21/fc/0921fc87aa989330b8d403014bf4f340.jpg',
    role: null,
    createdAt: null
  }
}

export type State = typeof state
