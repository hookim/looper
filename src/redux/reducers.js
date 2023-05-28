

/*
Data structures for Looper.

Clip data structure represents all the data about the clip.
Loop data structure represents loop inside the clip.

The unit of point is in miliseconds.
*/
const demoLoop = {
    point : null,
    memo : ""
}
const demoClips = {
    title : "untitled",
    link : null,
    id : null,
    curIdx : 0,
    lock : false, 
    loops : [{...demoLoop, point: 0}]
}

/* 
Reducer : It attaches to the redux store and set the rule to modify the data. 
*/
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
            if(target_clip.loops[target_clip.curIdx].point !== action.point){
                const  nextLoop = target_clip.loops[target_clip.curIdx + 1];
                let nextPoint;
                if(nextLoop !== undefined) 
                  nextPoint = nextLoop.point;  
                const newPoint = action.point;

                let availMore = false;
                // if new point is in between the loops
                if(nextPoint !== undefined && newPoint < nextPoint)
                  availMore = true
                /* 
                if it is at the end of the loops. 
                we don't have to check any further becasue this reducer is called only when the point is within the valid range.
                */
                if(nextPoint === undefined)
                  availMore = true;
                if(availMore){
                  target_clip.loops.splice(target_clip.curIdx + 1, 0, {...demoLoop, point : newPoint});
                  target_clip.curIdx += 1;
                }
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
        case 'SET_TITLE':
            target_clip.title = action.title
            return newState
        case 'LOCK_LOOP':
            target_clip.lock = true
            return newState
        case 'UNLOCK_LOOP':
            console.log('hello in switch-case')
            target_clip.lock = false
            return newState
        default:
            return [...state]
    }
}

export default reducer
