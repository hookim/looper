import React from "react";
import {Routes, Route, BrowserRouter} from "react-router-dom";
import Main from "./Main";
import Looper from "./Looper";
import AppHeader from "../common/AppHeader";

class App extends React.Component {
    constructor(props : {name? : string}){
        super(props)
    }

    /*
    Routing based on the url path
    */
    render(){
        return(
                
                <BrowserRouter>
                    <AppHeader/>
                    <div className="w-6/12 m-auto flex justify-center rounded-b-md shadow-lg">
                        <Routes>
                            <Route path = "/" element = {<Main/>} />
                            <Route path = "/enjoy/:userId" element = {<Looper/>} />
                        </Routes>
                    </div>
                </BrowserRouter>
                
        ) 
    }

    
}

export default App;
