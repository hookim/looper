import {v4 as  uuid} from 'uuid'

//action-generator for Main
export const addClip = () => ({
    type : 'ADD_CLIP',
    id : uuid()
})
export const delClip = (id) => ({
    type : 'DEL_CLIP',
    id
})

//action-generator for Loop
export const addLoop = (id, point) => ({
    type : 'ADD_LOOP',
    id,
    point
})

export const delLoop = (id, idx) => ({
    type : 'DEL_LOOP',
    id,
    idx
})

export const editMemo = (id, idx, memo) => ({
    type : 'EDIT_MEMO',
    id,
    idx,
    memo
})

export const setLink = (id, link) => ({
    type : 'SET_LINK',
    id,
    link
})

export const setTitle = (id, title) => ({
  type : 'SET_TITLE',
  id,
  title
})

export const nextLoop = (id) => ({
    type : 'NEXT_LOOP',
    id
})

export const prevLoop = (id) => ({
    type : 'PREV_LOOP',
    id
})

export const lockLoop = (id) => ({
  type : 'LOCK_LOOP',
  id
})

export const unlockLoop = (id) => ({
  type : 'UNLOCK_LOOP',
  id
})