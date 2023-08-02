import React from "react";
import YouTube from "react-youtube";
import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import { addLoop, delLoop, setLink, setTitle, editMemo , nextLoop, prevLoop, lockLoop, unlockLoop} from "../redux/action-generator";
import '../styles/looper.css'

const Looper = () => {
    const {userId} = useParams() // Parse paramter from url
    return <WrappedLooperWithRedux id = {userId}/>
}

class WrappedLooper extends React.Component {
    constructor(props){
      super(props)

      this.clip = this.props.state.find((clip) => {
        return ( clip.id === this.props.id )
      })
      this.isPlaying = false; 
      this.idx = 0;

      this.playLoop = this.playLoop.bind(this)
      this.stopLoop = this.stopLoop.bind(this)
      this.onReadyPlayer = this.onReadyPlayer.bind(this) 
      this.getYoutubeVideoId = this.getYoutubeVideoId.bind(this)
      this.addLoopToLooper = this.addLoopToLooper.bind(this)
      this.delLoopFromLooper = this.delLoopFromLooper.bind(this)
      this.setLinkToLooper = this.setLinkToLooper.bind(this)
      this.setTitleToLooper = this.setTitleToLooper.bind(this)
      this.setEventForKeyboard = this.setEventForKeyboard.bind(this)
      this.saveToStore = this.saveToStore.bind(this)
      this.changeMemo = this.changeMemo.bind(this)
      this.lockUnlockClip = this.lockUnlockClip.bind(this)
    }

      /*
      Play the Loop
      
      When this function is executed, It runs loop.
      It repeatedely cycles from the beginning of the loop to the end of loop.
      Before next iteration it pauses the video on purpose to avoid interruption.
      Loop is terminated when 
        1) at least one of loops is modified.
        2) pointer to loop changes.
        3) clip is explicitly paused by user
      */
      async playLoop(){
        const contextIdx = this.clip.curIdx; 
        const loopLen = this.clip.loops.length;
        const startSeconds = this.clip.loops[this.clip.curIdx].point;
        const endSeconds = this.clip.loops[this.clip.curIdx + 1] === undefined ?  
            this.endTime :
            this.clip.loops[this.clip.curIdx + 1].point;
        const interval = (endSeconds - startSeconds) * 1000
        
        while(contextIdx === this.clip.curIdx && loopLen === this.clip.loops.length){ 
            this.player.seekTo(startSeconds, true)
            this.player.playVideo()
            this.isPlaying = true;
            await new Promise(res => setTimeout(res, interval))
            if(contextIdx === this.clip.curIdx && loopLen === this.clip.loops.length){
              if(!this.isPlaying)
                break;
              this.stopLoop()
            }
        }
      }

      /*
      Stop the loop

      It pauses the clip and set the playing-flag to false.
      */
      stopLoop(){
          this.player.pauseVideo();
          this.isPlaying = false;
      }

      /*
      Save the state to the storage
      */
      saveToStore(){
        localStorage.setItem('looper-state', JSON.stringify(this.props.state))
      }

      /* 
      Save the state to the storage every 10 seconds.
      Upon initiating it runs until the looper compoent is alive.
      */
      async initAutoSave(){
          while(1){
              await new Promise(res => {setTimeout(res, 10 * 1000)})
              this.saveToStore();
          }
      }

    /* 
    Create new loop
    
    Changes the state using dispatch. and save the changed to the storage.
    */
    addLoopToLooper(point){
      this.props.dispatch(addLoop(this.clip.id, point))
      this.saveToStore(); 
    }

    /*
    Delete a loop

    It looks for the id of the loop to be deleted. 
    Since this function is triggered through the click event, It gets the ID from the ID of the button.
    On successful deletion, It saves to the storage and playLoop. 
    playLoop function decides whether to play the clip or not so we don't have to care about that here. 
    */
    delLoopFromLooper(e){
      const idx = parseInt(e.target.id.split('-')[1])
      if(idx){
        this.props.dispatch(delLoop(this.clip.id, idx))
        this.saveToStore();
        this.playLoop();
      }
    }

    /*
    Set video link 

    On successful update It reloads the whole window for requesting the video data to Youtube.
    */
    setLinkToLooper(e){
        const newLink = e.target.parentNode.children[0].value
        this.props.dispatch(setLink(this.clip.id, newLink))
        this.saveToStore();
        window.location.reload();
    }

    /*
    Set video title
    */
    setTitleToLooper(e){
      const newTitle = e.target.parentNode.children[0].value
      this.props.dispatch(setTitle(this.clip.id, newTitle));
    }

    /* 
    Set keyboard control event for looper 
    
    [Create Loop, Pause or Play Loop, Change Loop, Explicit Save to Storage, Unlock]
    When Looper component is alive we use keyboard event listener of the window. 
    If the clip is locked keyboard input doesn't work
    */
    setEventForKeyboard(){
        window.addEventListener('keydown', (e) => {
            if(!this.clip.lock){
                if(e.key === 'ArrowDown'){
                    if(this.isPlaying)
                      this.addLoopToLooper((this.player.getCurrentTime()).toFixed(2))
                }
                else if (e.key === 'p' || e.key === 'P'){
                    if(!this.isPlaying)
                      this.playLoop()
                    else
                      this.stopLoop()
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
                else if (e.key === 's' || e.key === 'S'){
                  this.saveToStore()
                }
            }
            // unlock it
            if(e.key === 'Escape'){
              this.lockUnlockClip()
            }
        }, true) 
    }

    /*
      Youtube API (When player is ready to be loaded)
    */ 
    async onReadyPlayer(e){
        this.player = e.target
        this.endTime = this.player.getDuration();
        this.setEventForKeyboard(); 
        this.initAutoSave();
    }

    sleep(ms){
      return new Promise(res => setTimeout(res, ms))
    }
    getYoutubeVideoId(link) {
        if (link === null || link === undefined)
          return link
        else if(link.split('=')[0] === link ){
          const parsed = link.split('/')
          return parsed[parsed.length - 1]
        }
        else 
          return link.split('=')[1].split('&')[0]
    } 

    changeMemo(e){ 
      if(this.clip.lock){
        e.target.disabled = false
        this.props.dispatch(editMemo(this.clip.id, this.clip.curIdx, e.target.value))
      }
      else 
        e.target.disabled = true
      
    }
    lockUnlockClip(){
      if(!this.clip.lock)
        this.props.dispatch(lockLoop(this.clip.id));
      else 
        this.props.dispatch(unlockLoop(this.clip.id));
    }
 

    render(){
        this.clip = this.props.state.find((clip) => {
            return ( clip.id === this.props.id )
        })
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
                    <LinkBar setLinkToLooper ={this.setLinkToLooper} link = {this.clip.link} locker ={this.lockUnlockClip}/>
                    <TitleBar setTitleToLooper ={this.setTitleToLooper} title = {this.clip.title}/>
                    <YouTube id = "youtube-player" 
                        videoId={this.getYoutubeVideoId(this.clip.link)} 
                        onReady={this.onReadyPlayer}
                    />
                    <LockButton isLocked ={this.clip.lock}/>
                    <LoopNaviagator loops = {this.clip.loops} handler = {this.delLoopFromLooper}/>
                    <MemoInput lock = {this.clip.lock} memo = {this.clip.loops[this.clip.curIdx].memo} handler = {this.changeMemo} locker = {this.lockUnlockClip}/>
                    <div class = "looper__helper--hidden" id = "helper">
                        <ul>
                          <li>Nav mode is required to control video.</li>
                          <li>Memo mode is required to take notes.</li>
                          <li>Esc : toggle the modes</li>
                          <li>⬇ : create loop point</li>
                          <li>p : play or pause the video</li>
                          <li>s : save current looper state to local stroage. but autosave is enabled as well!</li>
                          <li>[ : previous loop point</li>
                          <li>] : next loop point</li>
                        </ul>
                      <button onClick = {() => {
                        const helper = document.getElementById('helper')
                        helper.className = "looper__helper--hidden"
                      }}>X</button>
                    </div>
                    <button onClick = {() => {
                      const helper = document.getElementById('helper')
                      helper.className = "looper__helper--show"
                    }}>Help</button>
                </div>
            </div>
        );
    }
}


/* 
LinkBar Component : input value for the URL of the clip
*/
const LinkBar = (props) => {
    return (
        <div className = "link-bar">
            <input type = "text" defaultValue={props.link} onChange = {props.locker}></input>
            <button onClick = {props.setLinkToLooper}>Link</button>
        </div>
    )
}

/*
TitleBar Compoent : input value for the title of the clip
*/
const TitleBar = (props) =>{
  return (
    <div className = "title-bar">
      <input type = "text" defaultValue={props.title}></input>
      <button onClick = {props.setTitleToLooper} >Title</button>
    </div>
  )
}


const secFormat = (seconds) => {
    let min = Math.floor(seconds / 60)
    if(min < 10) min = `0${min}`
    else min = `${min}`

    let sec = (seconds % 60)
    if(sec < 10) sec = `0${sec}`
    else sec = `${sec}`

    return min + ":" + sec
    
}
/*
LoopNavigator Component : the points where loops were created and the navigator to the points.
*/
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

/*
LockButton Component : When it is locked, You cannot control the video with keyboards. only memo!
*/
const LockButton = (props) => {
  return (
      <span>{props.isLocked ? "MEMO MODE" : "NAV MODE"}</span>
  )
}

/*
MememoInput Component : input area where you can take notes.
*/
class MemoInput extends React.Component {
    constructor(props){
      super(props);
    }
    componentDidUpdate(){
      const memo = document.getElementById('memo')
      memo.focus()
    }
    render(){
      return (
          <div className = "memo-input">
              <textarea id = 'memo' value={this.props.memo} onChange={this.props.handler} disabled = {!this.props.lock}/>
          </div>
        )
    }
}


/* 
This part is connecting componenet to redux store
Whenever store changes it automatically passes on to the component as props 
Compenet state(original) -> component props(copy)
 */
const mapStateToProps = (state) => ({state})
const WrappedLooperWithRedux = connect(mapStateToProps)(WrappedLooper)

export default Looper