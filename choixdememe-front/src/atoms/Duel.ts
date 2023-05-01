import { Atom, PrimitiveAtom, atom } from 'jotai'
import { TDuel } from '../types'

const duelAtom = atom({
  comments: [
    {
      author: {
        username: "Zeid",
        id: 1
      },
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quisquam sunt eveniet voluptatem quaerat saepe voluptates perspiciatis. Et aspernatur cum sit repellendus quo, numquam illo amet odit delectus rerum corrupti?",
      creation_date: new Date(1682339350706),
    },
    {
      author: {
        username: "Zeid",
        id: 1
      },
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem quisquam sunt eveniet voluptatem quaerat saepe voluptates perspiciatis. Et aspernatur cum sit repellendus quo, numquam illo amet odit delectus rerum corrupti?",
      creation_date: new Date(1682339350706),
    }
  ],
  player1: {
    link: 'https://media.giphy.com/media/l4EoYMyJH91ZR5NRu/giphy.gif',
    caption: "IMAGE 1"
  },
  player2: {
    link: 'https://media.giphy.com/media/utTKp7idjkmxzYbxwj/giphy.gif',
    caption: "IMAGE 2"
  },
  vote1: 1015,
  vote2: 211
})

const myDuelAtom = atom<TDuel[]>([])

export { duelAtom, myDuelAtom }