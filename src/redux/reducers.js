//loop span for each clips
const demoLoop = {
    //the point when down-arrow is pressed.
    point : null,
    memo : ""
}

//each video clips
const demoClips = {
    title : "untitled",
    link : 'https://www.youtube.com/watch?v=ENNnFu-rS9U',
    id : null,
    curIdx : 0, 
    loops : [{...demoLoop, point: 0}]
}

// reducer handles state concerning with action generated. action object need to contain data the state will be change with.
const reducer = (state = [], action) => {
    let newState , target_idx, target_clip
    if(action.id !== undefined){
        newState = [...state]
        // we will use pointer to the object in state object
        target_idx = newState.findIndex((clip) => (clip.id === action.id));
        target_clip = newState[target_idx];
    }
    switch(action.type){
        case 'ADD_CLIP':
            return newState.concat({...demoClips, id : action.id});
        case 'DEL_CLIP':
            return newState.filter(item => {
                return item.id !== action.id
            });
        case 'ADD_LOOP':
            // if the point is already indexed then do nothing
            if((target_clip.loops[target_clip.curIdx].point).toString() !== (action.point).toString()){
                target_clip.loops.splice(target_clip.curIdx + 1, 0, {...demoLoop, point : action.point})
                target_clip.curIdx += 1
            }
            return newState;
        case 'DEL_LOOP':
            if(action.idx){
              target_clip.loops.splice(action.idx, 1);
              if(action.idx <= target_clip.curIdx)
                target_clip.curIdx -= 1;
            }
            return newState;
        case 'NEXT_LOOP':
            if(target_clip.curIdx + 1 !== target_clip.loops.length)
                target_clip.curIdx += 1
            return newState
        case 'PREV_LOOP':
            if(target_clip.curIdx - 1 >= 0)
                target_clip.curIdx -= 1
            return newState
        case 'EDIT_MEMO':
            target_clip.loops[action.idx].memo = action.memo
            return newState 
        case 'SET_LINK':
            target_clip.link = action.link
            return newState    
        default:
            return [...state]
    }
}

export default reducer
