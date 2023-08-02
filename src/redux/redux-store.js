import { createStore } from "redux";
import reducer from "./reducers";

const getReduxStore = () => {
    console.log('it works?')
    const savedStore = (localStorage.getItem('looper-state') === undefined) ? 
        null : 
        JSON.parse(localStorage.getItem('looper-state'))
    //when first created, attach reducer created to redux store
    if(savedStore === null)
        return createStore(reducer)
    else 
        return createStore(reducer, savedStore)
}

export default getReduxStore