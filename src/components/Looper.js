import React from "react";
import YouTube from "react-youtube";
import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import { addLoop, delLoop, setLink, nextLoop, prevLoop} from "../redux/action-generator";

const Looper = () => {
    const {userId} = useParams()
    return <WrappedLooperWithRedux id = {userId}/>
}

class WrappedLooper extends React.Component {
    constructor(props){
        super(props)
        //this contains the information for clip!
        this.clip = this.props.state.find((clip) => {
            return ( clip.id === this.props.id )
        })
        this.isPlaying = false;
        this.isLoop = false;

        // binding method to this //
        this.playLoop = this.playLoop.bind(this)
        this.onReadyPlayer = this.onReadyPlayer.bind(this) 
        this.sleep = this.sleep.bind(this)
        this.getYoutubeVideoId = this.getYoutubeVideoId.bind(this)
        this.addLoopToLooper = this.addLoopToLooper.bind(this)
        this.setLinkToLooper = this.setLinkToLooper.bind(this)
        this.setEventForKeyboard = this.setEventForKeyboard.bind(this)
    }

    //helper function 
    sleep(ms){
        return new Promise(res => setTimeout(res, ms))
    }
    getYoutubeVideoId(link) {
        if (link === null || link === undefined)
            return link
        else   
            return link.split('=')[1]
    }
    setEventForKeyboard() {
        const youtubePlayerElement = document.getElementById('youtube-player')
        //window event listener
        window.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowDown'){
                this.addLoopToLooper(Math.floor(this.player.getCurrentTime()))
            }
            else if (e.key === ' '){
                console.log('space')
                if(!this.isPlaying){
                    this.player.playVideo()
                    this.isPlaying = true
                }else{
                    this.player.pauseVideo()
                    this.isPlaying = false
                }
            }
            else if (e.key === '['){
                this.props.dispatch(prevLoop(this.clip.id))
                console.log(this.clip.curIdx)
            }
            else if (e.key === '['){
                this.props.dispatch(nextLoop(this.clip.id))
                console.log(this.clip.curIdx)
            }
        })
        youtubePlayerElement.addEventListener('keydown', (e) => {
            if(e.key === 'ArrowDown'){
                this.addLoopToLooper(Math.floor(this.player.getCurrentTime()))
            }
            else if (e.key === '['){
                this.props.dispatch(prevLoop(this.clip.id))
            }
            else if (e.key === '['){
                this.props.dispatch(nextLoop(this.clip.id))
            }
        })
        

    }

    //event handlers 
    addLoopToLooper(point){
        this.props.dispatch(addLoop(this.clip.id, point))
    }
    setLinkToLooper(e){
        const newLink = e.target.parentNode.children[0].value
        this.props.dispatch(setLink(this.clip.id, newLink))
    }

    async playLoop(){
        this.isLoop = true;
        const startSeconds = this.clip.loops[this.clip.curIdx];
        const endSeconds = this.clip.loops[this.clip.curIdx + 1] === undefined ?  
            this.endTime :
            this.clip.loops[this.clip.curIdx + 1]
        const interval = (endSeconds - startSeconds) * 1000
        let idx =10
        while(this.isLoop){
            console.log(startSeconds)
            this.player.seekTo(startSeconds, true)
            this.player.playVideo()
            await this.sleep(interval)
            this.player.pauseVideo();
        }
    }

    //API event handlers
    async onReadyPlayer(e){
        this.player = e.target
        this.endTime = this.player.getDuration()
        //add keyboard event hanler for window and youtube player
        this.setEventForKeyboard()
    }

    render(){
        return (
            <div>
                <div className="youtube-controller">
                    <LinkBar setLinkToLooper ={this.setLinkToLooper} link = {this.clip.link}/>
                    <YouTube id = "youtube-player" videoId={this.getYoutubeVideoId(this.clip.link)} onReady={this.onReadyPlayer}/>
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
            <input type = "text"></input>
            <button onClick = {props.setLinkToLooper}>Link</button>
        </div>
    )
}

// helper function for  LoopNavigator
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
        <div className = "loop-navigator">
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