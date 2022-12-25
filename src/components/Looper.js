import React from "react";
import YouTube from "react-youtube";
import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import { addLoop, delLoop, setLink, editMemo ,nextLoop, prevLoop, lockLoop, unlockLoop} from "../redux/action-generator";
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
        this.idx = 0;

        //// binding method to this ////
        this.playLoop = this.playLoop.bind(this)
        this.stopLoop = this.stopLoop.bind(this)
        this.onReadyPlayer = this.onReadyPlayer.bind(this) 
        this.getYoutubeVideoId = this.getYoutubeVideoId.bind(this)
        this.addLoopToLooper = this.addLoopToLooper.bind(this)
        this.delLoopFromLooper = this.delLoopFromLooper.bind(this)
        this.setLinkToLooper = this.setLinkToLooper.bind(this)
        this.setEventForKeyboard = this.setEventForKeyboard.bind(this)
        this.saveToStore = this.saveToStore.bind(this)
        this.changeMemo = this.changeMemo.bind(this)
        this.lockClip = this.lockClip.bind(this)
        this.unlockClip = this.unlockClip.bind(this)
      }

      //<LOOPER>
      async playLoop(){
        const contextIdx = this.clip.curIdx; 
        const loopLen = this.clip.loops.length;
        const startSeconds = this.clip.loops[this.clip.curIdx].point;
        const endSeconds = this.clip.loops[this.clip.curIdx + 1] === undefined ?  
            this.endTime :
            this.clip.loops[this.clip.curIdx + 1].point
        const interval = (endSeconds - startSeconds) * 1000
        // loop breaks when idx is not equal anymore or one of loops is deleted 
        while(contextIdx === this.clip.curIdx && loopLen === this.clip.loops.length){ 
            this.player.seekTo(startSeconds, true)
            this.player.playVideo()
            this.isPlaying = true;
            await new Promise(res => setTimeout(res, interval))
            // loop doesn't stop when idx has changed. and the process will be done.
            // this code is for not interrupting the other processes 
            if(contextIdx === this.clip.curIdx && loopLen === this.clip.loops.length){
              // when the video stopped explicitly from somewhere else, break out of loop
              if(!this.isPlaying)
                break;
              this.stopLoop()
            }
            console.log('loop')
        }
      }

      stopLoop(){
          this.player.pauseVideo();
          this.isPlaying = false;
      }

      saveToStore(){
        localStorage.setItem('looper-state', JSON.stringify(this.props.state))
      }

      async initAutoSave(){
          while(1){
              await new Promise(res => {setTimeout(res, 10 * 1000)})
              localStorage.setItem('looper-state', JSON.stringify(this.props.state))
          }
      }



    // create new loop piece
    addLoopToLooper(point){
      this.props.dispatch(addLoop(this.clip.id, point))
      this.saveToStore(); // change state by dispatch and save!
    }

    // this method will exploit button's id 
    delLoopFromLooper(e){
      const idx = parseInt(e.target.id.split('-')[1])
      if(idx){
        this.props.dispatch(delLoop(this.clip.id, idx))
        this.saveToStore();
        this.playLoop();
      }
    }

    // set video link 
    setLinkToLooper(e){
        const newLink = e.target.parentNode.children[0].value
        this.props.dispatch(setLink(this.clip.id, newLink))
    }

    // <event handler>
    // set keyboard control event for looper 
    setEventForKeyboard() {
        const youtubePlayerElement = document.getElementById('youtube-player')
  
        //window event listener
        window.addEventListener('keydown', (e) => {
          // only if the clip is unlocked, command keys work
            console.log('e.key', e.key)
            if(!this.clip.lock){
                if(e.key === 'ArrowDown'){
                    if(this.isPlaying)
                      this.addLoopToLooper((this.player.getCurrentTime()).toFixed(2))
                }
                else if (e.key === ' '){
                    if(!this.isPlaying)
                      this.playLoop();
                    else
                      this.stopLoop();
                }
                else if (e.key === '['){
                    this.props.dispatch(prevLoop(this.clip.id))
                    this.stopLoop()
                    this.playLoop()
                }
                else if (e.key === ']'){
                    this.props.dispatch(nextLoop(this.clip.id))
                    this.stopLoop()
                    this.playLoop()
                }
                else if (e.key === 's'){
                  this.saveToStore()
                }
            }
            if(e.key === 'Escape'){
              this.unlockClip()
              
            }
        }, true) 
    }


    // <API>
    async onReadyPlayer(e){
        console.log('hello?')
        this.player = e.target
        this.endTime = this.player.getDuration()

        // when the youtube player is ready, configure basic things
        this.setEventForKeyboard() 
        this.initAutoSave();
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
    
    changeMemo(e){
      this.props.dispatch(editMemo(this.clip.id, this.clip.curIdx, e.target.value))
      console.log(this.clip.loops)
    }

    lockClip(){
      console.log(this.clip.lock)
      if(!this.clip.lock){
        this.props.dispatch(lockLoop(this.clip.id))
      }
    }
    unlockClip(){
      if(this.clip.lock){
        console.log('this.clip.lock' , this.clip.lock)
        this.props.dispatch(unlockLoop(this.clip.id))
      }
    }
      
    render(){
        this.clip = this.props.state.find((clip) => {
            return ( clip.id === this.props.id )
        })
        console.log(this.isPlaying, this.clip)
        //for indicating current loop!! change class name. 
        const elem = document.getElementsByClassName('delButtons')
        for(let i = 0 ; i < elem.length; i++){
          elem.item(i).classList.remove('current-loop')
        }
        const target = document.getElementById(`delButton-${this.clip.curIdx}`)
        if(target)
          target.classList.add('current-loop')

        return (
            <div>
                <div className="youtube-controller">
                    <LinkBar setLinkToLooper ={this.setLinkToLooper} link = {this.clip.link}/>
                    <YouTube id = "youtube-player" 
                        videoId={this.getYoutubeVideoId(this.clip.link)} 
                        onReady={this.onReadyPlayer}
                    />
                    <LoopNaviagator loops = {this.clip.loops} handler = {this.delLoopFromLooper}/>
                    <MemoInput memo = {this.clip.loops[this.clip.curIdx].memo} handler = {this.changeMemo} locker = {this.lockClip}/>
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
                        <button class = 'delButtons' id ={`delButton-${idx}`} onClick={props.handler}>-</button>
                    </div> 
                )
            })}
        </div>
    )
}

class MemoInput extends React.Component {
    constructor(props){
      super(props);
    }

    render(){
      return (
          <div className = "memo-input">
              <textarea value={this.props.memo} onChange={this.props.handler} onFocus={this.props.locker}/>
          </div>
        )
    }
}


// this part is connecting componenet to redux store
// whenever store changes it automatically passes on to the component as props 
// compenet state(original) -> component props(copy)
const mapStateToProps = (state) => ({state})
const WrappedLooperWithRedux = connect(mapStateToProps)(WrappedLooper)

export default Looper