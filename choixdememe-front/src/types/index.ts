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
  comment : string
  user_id: number,
  username?: string,
  duel_id?: number
  created_at?: string
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