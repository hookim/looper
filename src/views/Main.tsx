import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import { addClip, delClip} from "../redux/action-generator";

const mapStateToProps = (state) => ({state})

class WrappedMain extends React.Component{
    constructor(props){
        super(props)
        this.addClipToMain = this.addClipToMain.bind(this)
        this.delClipFromMain = this.delClipFromMain.bind(this)
    }

    /*
    As the name obviously suggests These methods below modify the clip. 
    A clip is the video that we want to chop down and turn them into loops.
    You can make multiple loops for a clip. 
    And Looper controls the whole system.  
    */
   
    addClipToMain() {
        const addAction = addClip() 
        this.props.dispatch(addAction)
        console.log(this.props.state)
    }
    delClipFromMain(e) {
        const id = e.target.getAttribute('id')
        const delAction = delClip(id)
        this.props.dispatch(delAction)  
    }

    render(){
        localStorage.setItem('looper-state', JSON.stringify(this.props.state))
        return (
            <div>
                <button onClick = {this.addClipToMain}>+</button>
                {this.props.state.map((item, idx) => {
                    return (<div key = {idx}>
                                <Link key = {idx} to = {`/enjoy/${item.id}`}>{item.title}</Link>
                                <button id = {item.id} onClick = {this.delClipFromMain}>-</button>
                            </div>
                            )
                })}
            </div>
        )
    }
}

const Main = connect(mapStateToProps)(WrappedMain)


export default Main;