import { createStore } from "redux";
import reducer from "./reducers";

const oldVersion = 'looper-state'
const newVersion = 'looper-state-2'

const getReduxStore = () => {
    localStorage.removeItem(oldVersion)
    const savedStore = (localStorage.getItem(newVersion) === undefined) ? 
        null : 
        JSON.parse(localStorage.getItem(newVersion))
    //when first created, attach reducer created to redux store
    if(savedStore === null)
        return createStore(reducer)
    else 
        return createStore(reducer, savedStore)
}

export default getReduxStore