import React from "react";
import YouTube from "react-youtube";
import {connect} from "react-redux";
import {useParams} from "react-router-dom";
import { addLoop, delLoop, setLink, setTitle, editMemo , nextLoop, prevLoop, lockLoop, unlockLoop, jumpLoop} from "../redux/action-generator";

import NextBtn from "/assets/next.svg?react"
import PrevBtn from "/assets/prev.svg?react"
import PlayBtn from "/assets/play.svg?react"
import PauseBtn from "/assets/pause.svg?react"
import DeleteBtn from "/assets/delete.svg?react"
import AddBtn from '/assets/add.svg?react'
import QuestionBtn from "/assets/question.svg?react"




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
      this.state = {isPlaying : false}
    //   this.idx = 0;

      this.playLoop = this.playLoop.bind(this)
      this.stopLoop = this.stopLoop.bind(this)
      this.onReadyPlayer = this.onReadyPlayer.bind(this) 
      this.getYoutubeVideoId = this.getYoutubeVideoId.bind(this)
      this.addLoopToLooper = this.addLoopToLooper.bind(this)
      this.delLoopFromLooper = this.delLoopFromLooper.bind(this)
      this.setLinkToLooper = this.setLinkToLooper.bind(this)
      this.setTitleToLooper = this.setTitleToLooper.bind(this)
    //   this.setEventForKeyboard = this.setEventForKeyboard.bind(this)
      this.saveToStore = this.saveToStore.bind(this)
      this.changeMemo = this.changeMemo.bind(this)
      this.lockUnlockClip = this.lockUnlockClip.bind(this)
      this.nextLoop = this.nextLoop.bind(this)
      this.prevLoop = this.prevLoop.bind(this)
      this.jumpToLoop = this.jumpToLoop.bind(this)
      this.onStateChange = this.onStateChange.bind(this)
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
        console.log(this.clip.curIdx)
        const contextIdx = this.clip.curIdx; 
        const loopLen = this.clip.loops.length;
        const startSeconds = this.clip.loops[this.clip.curIdx].point;
        const endSeconds = this.clip.loops[this.clip.curIdx + 1]?.point ?? this.endTime
        const interval = (endSeconds - startSeconds) * 1000    
    
        while(contextIdx === this.clip.curIdx && loopLen === this.clip.loops.length){ 
    
            this.player.seekTo(startSeconds, true)
            this.player.playVideo()
            this.setState({isPlaying : true});

            await new Promise(res => setTimeout(res, interval))
            if(contextIdx === this.clip.curIdx && loopLen === this.clip.loops.length){
              if(!this.state.isPlaying)
                break;
              this.stopLoop()
            }
        }
      }

      nextLoop(){
        console.log(this.clip.curIdx)
        this.props.dispatch(nextLoop(this.clip.id))
        this.stopLoop()
        this.playLoop()

        document.getElementById(`looper-display-${this.clip.curIdx}`)?.scrollIntoView()

      }

      prevLoop(){
        this.props.dispatch(prevLoop(this.clip.id))
        this.stopLoop()
        this.playLoop()

        
        document.getElementById(`looper-display-${this.clip.curIdx}`)?.scrollIntoView()
      }

      /*
      Stop the loop

      It pauses the clip and set the playing-flag to false.
      */
      stopLoop(){
          this.player.pauseVideo();
          this.setState({isPlaying : false});
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

      document.getElementById(`looper-display-${this.clip.curIdx}`)?.scrollIntoView()
    }

    /*
    Delete a loop

    It looks for the id of the loop to be deleted. 
    Since this function is triggered through the click event, It gets the ID from the ID of the button.
    On successful deletion, It saves to the storage and playLoop. 
    playLoop function decides whether to play the clip or not so we don't have to care about that here. 
    */
    delLoopFromLooper(idx){
      if(idx){
        this.props.dispatch(delLoop(this.clip.id, idx ))
        this.stopLoop()
        this.playLoop();
      }

      console.log(this.clip)
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
      console.log(this.clip.id, newTitle)
      this.props.dispatch(setTitle(this.clip.id, newTitle));
      this.saveToStore()
    //   window.location.reload();
    }

    /* 
    Set keyboard control event for looper 
    
    [Create Loop, Pause or Play Loop, Change Loop, Explicit Save to Storage, Unlock]
    When Looper component is alive we use keyboard event listener of the window. 
    If the clip is locked keyboard input doesn't work
    */
    // setEventForKeyboard(){
    //     window.addEventListener('keydown', (e) => {
    //         if(!this.clip.lock){
    //             if(e.key === 'ArrowDown'){
    //                 if(this.state.isPlaying)
    //                   this.addLoopToLooper((Math.floor(this.player.getCurrentTime())))
                    
    //                 document.getElementById(`looper-display-${this.clip.curIdx}`)?.scrollIntoView()
    //                 console.log(document.getElementById(`looper-display-${this.clip.curIdx}`))
    //             }
    //             else if (e.key === 'p' || e.key === 'P'){
    //                 if(!this.state.isPlaying)
    //                   this.playLoop()
    //                 else
    //                   this.stopLoop()
    //             }
    //             else if (e.key === '['){
    //                 this.prevLoop();
                    

    //             }
    //             else if (e.key === ']'){
    //                 this.nextLoop()
    //             }
    //             else if (e.key === 's' || e.key === 'S'){
    //               this.saveToStore()
    //             }
    //         }
    //         // unlock it
    //         if(e.key === 'Escape'){
    //           this.lockUnlockClip()
    //         }
    //     }, true) 
    // }

    onStateChange(e){
        if(e.data === 3){
            const curTime = Math.floor(e.target.getCurrentTime());
            const idx = this.clip.loops.findIndex(el=> {
                return el.point > curTime
            })
            console.log(idx)
            if(idx-1 === this.clip.curIdx){
                return;
            }
    
            if(idx === -1){
                this.jumpToLoop(this.clip.loops.length - 1)
            }
            else{
                this.jumpToLoop(idx - 1)
            }
        }

    }

    /*
      Youtube API (When player is ready to be loaded)
    */ 
    async onReadyPlayer(e){
        this.player = e.target
        this.endTime = this.player.getDuration();
        // this.setEventForKeyboard(); 
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
        this.props.dispatch(editMemo(this.clip.id, this.clip.curIdx, e.target.value))
    }
    lockUnlockClip(){
      if(!this.clip.lock)
        this.props.dispatch(lockLoop(this.clip.id));
      else 
        this.props.dispatch(unlockLoop(this.clip.id));
    }

    jumpToLoop(idx){
        // console.log(this.clip.curIdx)
        // console.log(e.target)
        // console.log(e.target.id.split('-')[2])
        this.props.dispatch(jumpLoop(this.clip.id, idx))
        this.stopLoop()
        this.playLoop()
        console.log(this.clip.curIdx)
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
        <div className="w-full h-full">
            <div className="mb-2 relative">
                <div className = "text-center w-11/12 m-auto">
                    <input type = "text" defaultValue={this.clip.title} onChange={(e) => {console.log(e.target.value)}} className="bg-gray-700 w-5/12 rounded-md p-1 text-center"></input>
                    <button onClick = {this.setTitleToLooper} className="bg-gray-800 m-2 p-1 rounded-lg w-2/12 hover:bg-gray-600">set</button>
                </div>
  
                <div className = "text-center w-11/12 m-auto">
                    <input type = "text" defaultValue={this.clip.link} className="bg-gray-700 w-5/12 rounded-md p-1 text-center"></input>
                    <button onClick = {this.setLinkToLooper} className="bg-gray-800 m-2 p-1 rounded-lg w-2/12 hover:bg-gray-600">import</button>
                </div>
  
            </div>

            <div className="h-[75vh] grid grid-cols-12 grid-rows-12 realtive border-gray-800 border rounded-md p-4">    
                <YouTube 
                    id = "youtube-player" 
                    videoId={this.getYoutubeVideoId(this.clip.link)}
                    onReady={this.onReadyPlayer}
                    onStateChange={this.onStateChange}
                    className="col-span-9 row-span-8"
                    iframeClassName="w-full h-full"
                />
                <div id="loopers-display" className="col-span-3 row-span-8 w-full overflow-y-scroll overflow-x-hidden">
                    
                    {this.clip.loops.map((loop, idx) => {
   
                        return(
                            <button onClick={() => this.jumpToLoop(idx)} key={idx} id={`looper-display-${idx}`} className={(idx === this.clip.curIdx) ?  "bg-gray-300 w-11/12 p-2 border-gray-500 border-2 m-2 flex text-black justify-between rounded-md" : "bg-gray-900 w-11/12 p-2 border-gray-500 border m-2 flex justify-between rounded-md "}>
                                <div className="">{secFormat(loop.point)}</div>
                                <button className = "" onClick={(e) => {e.stopPropagation();this.delLoopFromLooper(idx)}}>
                                    <DeleteBtn />
                                </button>
                            </button> 
                        )
                    })}        
                </div>
                <div className="col-start-12 flex justify-end mt-4">
                    {/* <div className="flex items-center justify-center mr-2 mt-1">
                        <button className="bg-gray-800 p-2 rounded-md  hover:bg-gray-600" onClick={this.addLoopToLooper}>Loop!</button>
                    </div> */}
                    
                    <div className="flex items-center justify-center mr-1">
                    {
                        this.state.isPlaying? 
                        <button onClick={this.stopLoop}>
                            <PauseBtn/>
                        </button> 
                        :
                        <button onClick={this.playLoop}>
                            <PlayBtn/>
                        </button>
                    }
                    </div>

                    <div className="flex items-center justify-center">
                        <button onClick={() => this.addLoopToLooper((Math.floor(this.player.getCurrentTime())))}>
                            <AddBtn />
                        </button>
                    </div>
                </div>
            
                
                <button className="col-start-1 row-start-10 flex items-center justify-end mr-4" onClick={this.prevLoop}>
                    <PrevBtn/>
                </button>
                <div className="col-start-2 col-span-8 row-start-9 row-span-3 mt-4"> 

                    <textarea id='memo' value={this.clip.loops[this.clip.curIdx]?.memo} onChange={this.changeMemo} className="h-full w-full m-auto resize-none bg-gray-900 rounded-md p-3"/>
                    
                </div>
                <button className="col-start-10 row-start-10 flex items-center justfify-start ml-4" onClick={this.nextLoop}>
                    <NextBtn/>
                </button>
               
            </div>
                
                {/* <div className = "hidden" id = "helper">
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
                }}>Help</button> */}
        </div>
            
        );
    }
}


/* 
LinkBar Component : input value for the URL of the clip
*/
const LinkBar = (props) => {
    return (
        <div className = "">
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
const LockDisplay = (props) => {
    if(props.isLocked){
        return (
            <Lock />
        )
    }
    else{
        return (
            <Unlock />
        )
    }
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
    //   memo.focus()
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