import { Atom, atom } from 'jotai'
import { TDuel } from '../types'

const duelAtom: Atom<TDuel> = atom({
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
    link: 'https://unsplash.it/900/1200',
    caption: "IMAGE 1"
  },
  player2: {
    link: 'https://unsplash.it/900/1201',
    caption: "IMAGE 2"
  },
  vote1: 1015,
  vote2: 211
})

export default duelAtom