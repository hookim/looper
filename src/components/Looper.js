import React from "react";
import YouTube from "react-youtube";
import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import { addLoop, delLoop, setLink, nextLoop, prevLoop} from "../redux/action-generator";
import '../styles/looper.css'

const Looper = () => {
    const {userId} = useParams()
    return <WrappedLooperWithRedux id = {userId}/>
}

class WrappedLooper extends React.Component {
    constructor(props){
        super(props)
        //// this contains the information for clip(copy from state)! ////
        this.clip = this.props.state.find((clip) => {
            return ( clip.id === this.props.id )
        })

        this.isPlaying = false; // if video is being played 
        this.loopIdx = -1;

        //// binding method to this ////
        this.playLoop = this.playLoop.bind(this)
        this.stopLoop = this.stopLoop.bind(this)
        this.onReadyPlayer = this.onReadyPlayer.bind(this) 
        this.onPausePlayer = this.onPausePlayer.bind(this)
        this.sleep = this.sleep.bind(this)
        this.getYoutubeVideoId = this.getYoutubeVideoId.bind(this)
        this.addLoopToLooper = this.addLoopToLooper.bind(this)
        this.setLinkToLooper = this.setLinkToLooper.bind(this)
        this.setEventForKeyboard = this.setEventForKeyboard.bind(this)
        this.saveToStore = this.saveToStore.bind(this)
    }

    // <helper function>
    

    //// synchronously cease execution for ms ////
    sleep(ms){
        return new Promise(res => setTimeout(res, ms))
    }
    //// parse id from youtube url ////
    getYoutubeVideoId(link) {
        if (link === null || link === undefined)
            return link
        else   
            return link.split('=')[1]
    }  
    //// set event for loop keyboard control ////
    setEventForKeyboard() {
        const youtubePlayerElement = document.getElementById('youtube-player')

        //window event listener
        window.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowDown'){
                console.log(this.props.state)
                this.addLoopToLooper((this.player.getCurrentTime()).toFixed(2))
            }
            else if (e.key === ' '){
                if(!this.isPlaying){
                    this.player.playVideo()
                    this.isPlaying = true
                }else{
                    this.player.pauseVideo()
                    this.isPlaying = false
                    this.loopIdx = -1
                }
            }
            else if (e.key === '['){
                this.props.dispatch(prevLoop(this.clip.id))
                this.loopIdx = this.clip.curIdx
                this.stopLoop()
                this.playLoop()
            }
            else if (e.key === ']'){
                this.props.dispatch(nextLoop(this.clip.id))
                this.loopIdx = this.clip.curIdx
                this.stopLoop()
                this.playLoop()
            }
        }, true) 
    }

    //<event handlers>
    
    //// create new loop piece ////
    addLoopToLooper(point){
        this.props.dispatch(addLoop(this.clip.id, point))
    }
    //// set video link //// 
    setLinkToLooper(e){
        const newLink = e.target.parentNode.children[0].value
        this.props.dispatch(setLink(this.clip.id, newLink))
    }
    //// MAIN PART : playing loop ////
    async playLoop(){
        const contextIdx = this.loopIdx; // bind loopIdx to this playLoop process
        const startSeconds = this.clip.loops[this.clip.curIdx].point;
        const endSeconds = this.clip.loops[this.clip.curIdx + 1] === undefined ?  
            this.endTime :
            this.clip.loops[this.clip.curIdx + 1].point
        const interval = (endSeconds - startSeconds) * 1000
        while(contextIdx === this.loopIdx){ // only if locally bound loopIdx is equal to component loopIdx(semi-global).
            this.player.seekTo(startSeconds, true)
            this.player.playVideo()
            await this.sleep(interval)
            if(this.contextIdx === this.clip.curIdx) //avoid side effect(pause video operation is exectued even after changing loop)
                this.player.pauseVideo();
        }
    }
    //// stop loop ////
    stopLoop(){
        this.player.pauseVideo()
    }
    //// save to store every 30 seconds ////
    async saveToStore(){
        console.log(this.props)
        while(1){
            await new Promise(res => {setTimeout(res, 10 * 1000)})
            localStorage.setItem('looper-state', JSON.stringify(this.props.state))
        }
    }


    // <API event handlers>


    async onReadyPlayer(e){
        this.player = e.target
        this.endTime = this.player.getDuration()
        this.setEventForKeyboard() //add keyboard event hanler for window and youtube player
    }
    async onPausePlayer(e){
        // document.getElementsByClassName('ytp-pause-overlay').style.display = 'none'
    }
    
    render(){
        this.saveToStore()
        return (
            <div>
                <div className="youtube-controller">
                    <LinkBar setLinkToLooper ={this.setLinkToLooper} link = {this.clip.link}/>
                    <YouTube id = "youtube-player" 
                        videoId={this.getYoutubeVideoId(this.clip.link)} 
                        onReady={this.onReadyPlayer}
                        onPause={this.onPausePlayer}
                        />
                    <LoopNaviagator loops = {this.clip.loops}/>
                    <MemoInput memo = {this.clip.memo}/>
                </div>
            </div>
        );
    }
}

const LinkBar = (props) => {
    return (
        <div className = "link-bar">
            <input type = "text" defaultValue={props.link}></input>
            <button onClick = {props.setLinkToLooper}>Link</button>
        </div>
    )
}

//// seconds to MM:SS.mm////
const secFormat = (seconds) => {
    let min = Math.floor(seconds / 60)
    if(min < 10) min = `0${min}`
    else min = `${min}`

    let sec = (seconds % 60)
    if(sec < 10) sec = `0${sec}`
    else sec = `${sec}`

    return min + ":" + sec
    
}
const LoopNaviagator = (props) => {
    return (
        <div id = "loop-navigator">
            <br></br>
            {props.loops.map((loop, idx) => {
                return(
                    <div key = {idx}>
                        <div>{secFormat(loop.point)}</div>
                        <button>-</button>
                    </div> 
                )
            })}
        </div>
    )
}

const MemoInput = (props) => {
    return (
        <div className = "memo-input">
            <textarea defaultValue={props.memo} />
        </div>
    )
}

const mapStateToProps = (state) => ({state})


const WrappedLooperWithRedux = connect(mapStateToProps)(WrappedLooper)

export default Looper