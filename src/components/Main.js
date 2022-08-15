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
    addClipToMain() {
        const addAction = addClip() 
        this.props.dispatch(addAction)
    }
    delClipFromMain(e) {
        const id = e.target.getAttribute('id')
        const delAction = delClip(id)
        this.props.dispatch(delAction)
    }
    render(){
        return (
            <div>
                <button onClick = {this.addClipToMain}>+</button>
                {this.props.state.map((item, idx) => {
                    return (<div key = {idx}>
                                <Link key = {idx} to = {`/looper/${item.id}`}>{item.title}</Link>
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