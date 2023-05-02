import { Atom, PrimitiveAtom, atom } from 'jotai'
import { TDuel } from '../types'

const duelAtom = atom<TDuel[]>([])

const myDuelAtom = atom<TDuel[]>([])

export { duelAtom, myDuelAtom }