export interface EmailList {
  id: number
  hasOrder: boolean
  opened: boolean
  message: string
  title: string
  createdAt: date
  from: string
  fromName: string
  usersReceiving: string[]
  copies: string[]
  fromProfilePicture: string
  attachments: []
}

export interface IState {
  auth: {
    token: string | null,
    subject: number | null
  }
  profile: {
    id: number | null
    email: strnig | null
    name: string | null
    profilePicture: string | null
    defaultProfilePicture: string
    role: string | null
    createdAt: Date | null
  }
  stompClient: null | CompatClient
  loadingEmailList: boolean
  selectedEmailId: string | null
  emailList: EmailList[]
  // FIX TYPE
  emailBeingVisualized: null | any
}
