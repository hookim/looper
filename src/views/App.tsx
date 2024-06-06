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
                    <div className="border-b border-solid border-gray-900 mt-3 mb-3"></div>
                    <div className="w-10/12 m-auto flex justify-center rounded-b-md shadow-lg">
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
