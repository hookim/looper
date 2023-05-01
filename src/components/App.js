import React from "react";
import {BrowserRouter, Routes, Route, useParams} from "react-router-dom";
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
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Main/>} />
                    <Route path = "/looper/:userId" element = {<Looper/>} />
                </Routes>
            </BrowserRouter>
        ) 
    }

    
}

export default App;
