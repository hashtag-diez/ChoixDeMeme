interface TGIF{
  link: string,
  caption: string
}

interface TUser{
  id: number
  username: string
}

interface TComment{
  author: TUser
  content : string
  creation_date: Date
}

interface TDuel {
  player1: TGIF
  player2: TGIF
  vote1: number
  vote2: number
  comments: TComment[]
}

export type {TGIF, TUser, TComment, TDuel}