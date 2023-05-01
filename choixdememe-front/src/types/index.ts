interface TGIF{
  link: string,
  caption: string
}

interface TUser{
  id: number
  username: string
  email?: string
}

interface TComment{
  Comment : string
  UserID: number,
  DuelID?: number
  creation_date?: Date
}

interface TDuel {
  duel_id: number
  player1: TGIF
  player2: TGIF
  vote1: number
  vote2: number
  comments: TComment[]
}

export type {TGIF, TUser, TComment, TDuel}