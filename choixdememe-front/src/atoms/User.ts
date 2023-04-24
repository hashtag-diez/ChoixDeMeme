import { Atom, atom } from 'jotai'
import { TUser } from '../types'

const userAtom: Atom<TUser> = atom({
  username: "Zeid",
  id: 1
})

export default userAtom