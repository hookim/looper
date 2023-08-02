import React from "react";
import {HashRouter, Routes, Route} from "react-router-dom";
import Main from "./Main";
import Looper from "./Looper";

class App extends React.Component {
    constructor(props){
        super(props)
    }

    /*
    Routing based on the url path
    */
    render(){
        return(
            <HashRouter>
                <Routes>
                    <Route path = "/" element = {<Main/>} />
                    <Route path = "/enjoy/:userId" element = {<Looper/>} />
                </Routes>
            </HashRouter>
        ) 
    }

    
}

export default App;
