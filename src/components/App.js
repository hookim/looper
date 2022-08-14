import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Main from "./Main";
import Looper from "./Looper";

class App extends React.Component {
    constructor(props){
        super(props)
    }

    render(){
        return(
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Main/>} />
                    <Route path = "/looper" element = {<Looper/>}/>
                </Routes>
            </BrowserRouter>
        ) 
    }

    
}

export default App;
