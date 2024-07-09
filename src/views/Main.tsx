import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {addClip, delClip} from "../redux/action-generator";
import Dots from "/assets/dots.svg?react"
import ContextMenu from "../common/ContextMenu";

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
        if(window.confirm("정말 생성하시겠습니까?")){
            const addAction = addClip() 
            this.props.dispatch(addAction)
        }
    }
    delClipFromMain(id) {
        if(window.confirm("정말 삭제하시겠습니까?")){
            const delAction = delClip(id)
            this.props.dispatch(delAction)  

            const lists = document.getElementsByClassName('context-boxes')
            for(let i = 0; i < lists.length; i++){
                lists[i].classList.remove("hidden")
                lists[i].classList.add("hidden")
            }
        }
    }

    toggleVisiblity(id) {
        const el = document.getElementById(id);
        if(el?.classList.contains("hidden")){
            el?.classList.remove("hidden")
        }
        else{
            el?.classList.add("hidden")
        }

    }

    render(){
        localStorage.setItem('looper-state', JSON.stringify(this.props.state))
        return (
            <div className="w-full relative">
                <div className="border-b border-solid border-gray-900 mt-3 mb-3"></div>
                <div className="mb-7 flex justify-center relative">
                    <div className="text-2xl text-center w-4/5">비디오 목록</div>
                    <button onClick = {this.addClipToMain} className="text-lg p-2 rounded-md bg-gray-700 hover:text-gray-950 absolute right-0" >생성하기</button>
                </div>
                <div className="grid grid-cols-3  border-solid border-gray-900 border rounded-md p-2">
                    {this.props.state.map(item => {
                        return (<div key = {item.id} className="border-solid border-gray-700 border rounded-md h-28 w-11/12 relative mb-2">
                                    <div className="h-6 bg-gray-700 absolute top-0 left-0 w-full rounded-t-md flex justify-end ">
                                        <button onClick={() => this.toggleVisiblity('context-' + item.id)}>
                                            <Dots className="text-white w-4 h-4"/>
                                        </button>
                                    </div>
                                    <Link key = {item.id} to={`/enjoy/${item.id}`} className="block h-full w-full pt-10 text-center hover:bg-gray-900">{item.title}</Link>
                                    
                                    <div id={`context-${item.id}`} className="context-boxes absolute right-0 top-7 z-10 w-16 bg-gray-700 rounded-sm hidden">  
                                        <button onClick={() => this.delClipFromMain(item.id)} className="block text-center w-full m-auto h-10 bg-gray-600 rounded-sm hover:text-gray-950">삭제</button>
                                    </div>  
                                </div>
                                )
                    })}
                </div>
            </div>
        )
    }
}

const Main = connect(mapStateToProps)(WrappedMain)


export default Main;