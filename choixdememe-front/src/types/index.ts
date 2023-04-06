enum AvatarType {
  adventurer = "adventurer",
  adventurerNeutral = "adventurerNeutral",
  avataaars = "avataaars",
  avataaarsNeutral = "avataaarsNeutral",
  bigEars = "bigEars",
  bigEarsNeutral = "bigEarsNeutral",
  bigSmile = "bigSmile",
  bottts = "bottts",
  botttsNeutral = "botttsNeutral",
  croodles = "croodles",
  croodlesNeutral = "croodlesNeutral",
  funEmoji = "funEmoji",
  thumbs = "thumbs",
  icons = "icons",
  identicon = "identicon",
  initials = "initials",
  lorelei = "lorelei",
  loreleiNeutral = "loreleiNeutral",
  micah = "micah",
  miniavs = "miniavs",
  notionists = "notionists",
  notionistsNeutral = "notionistsNeutral",
  openPeeps = "openPeeps",
  personas = "personas",
  pixelArt = "pixelArt",
  pixelArtNeutral = "pixelArtNeutral",
  shapes = "shapes"
}

interface TGIF{
  link: string,
  caption: string
}

interface TUser{
  username: string
  avatar_style : AvatarType

}
interface TComment{
  author: TUser
  content : string
  creation_date: Date
  link_count : number
}

interface TDuel {
  player1: TGIF
  player2: TGIF
  vote1: number
  vote2: number
  comments: Comment[]
}

export type {TGIF, TUser, TComment, TDuel, AvatarType}