import { atom } from 'jotai'
import { TUser } from '../types'

const userAtom = atom({
  id: -1,
  username: "disconnected"
})

export default userAtom