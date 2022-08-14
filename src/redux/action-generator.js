import {v4 as  uuid} from 'uuid'

//action-generator
const addClip = () => ({
    type : 'ADD_CLIP',
    id : uuid()
})
const delClip = (idx) => ({
    type : 'DEL_CLIP',
    idx
})
