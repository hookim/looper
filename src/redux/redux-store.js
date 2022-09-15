import { createStore } from "redux";
import reducer from "./reducers";

console.log(localStorage.getItem('looper-state'))

const getReduxStore = () => {
    const savedStore = (localStorage.getItem('looper-state') === undefined) ? 
        null : 
        JSON.parse(localStorage.getItem('looper-state'))
    if(savedStore === null)
        return createStore(reducer)
    else 
        return savedStore 
}

export default getReduxStore