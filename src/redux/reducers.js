//loop span for each clips
const demoLoop = {
    //point when down-arrow is clicked.
    point : null,
    memo : null
}

//each video clips
const demoClips = {
    title : null,
    link : null,
    id : null,
    loops : [{...demoLoop, point: 0}]
}



const reducer = (state = [], action) => {
    const target_clip_idx = (action.idx === undefined) ? action.idx : null
    let new_state, target_clip
    if(target_clip_idx !== null){
        new_state = {...state}
        target_clip  = new_state[target_clip_idx]
    }
    switch(action.type){
        case 'ADD_CLIP':
            return [...state, {...demoClips, id : action.id}]
        case 'DEL_CLIP':
            return state.filter(([,idx]) => {
                return idx !== target_clip_idx
            })
        case 'ADD_LOOP':    
            target_clip.loops = [...target_clip.loops.slice(0, action.cur_idx+1), 
            {...demoLoop, point : action.point},
            ...target_clip.loops.slice(action.cur_idx+1)]
            return new_state
        case 'DEL_LOOP':
        default:
            return [...state]
    }
}

export default reducer
