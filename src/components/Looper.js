import React from "react";
import YouTube from "react-youtube";

export default class Looper extends React.Component {
    constructor(props){
        super(props)
        this.player = null;
        this.loopPoints = [];
        this.isLoop = false;

        // binding method to this //
        this.playLoop = this.playLoop.bind(this)
        this.onReadyPlayer = this.onReadyPlayer.bind(this) 
        this.sleep = this.sleep.bind(this)

        console.log(this.props)
    }
    async onReadyPlayer(e){
        this.player = e.target
        // while(1){
        //     await this.sleep(5000)
        //     console.log(this.player.getCurrentTime())
        // }
    }

    sleep(ms){
        return new Promise(res => setTimeout(res, ms))
    }
        
    async playLoop(){
            this.isLoop = true;
            const startSeconds = 40.82;
            const endSeconds = 44.99;
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

    render(){
        return (
            <div>
                <div className="youtube-controllere">
                    <LinkBar/>
                    <YouTube  videoId="5_Zr7qVtc8o" onReady={this.onReadyPlayer}/>
                    <LoopNaviagator/>
                    <MemoInput/>
                </div>
            </div>
        );
    }
}

const LinkBar = (props) => {
    return (
        <div className = "link-bar">
            <input type = "text"></input>
            <button>Link</button>
        </div>
    )
}

const LoopNaviagator = (props) => {
    return (
        <div className = "loop-navigator">
            
        </div>
    )
}

const MemoInput = (props) => {
    return (
        <div className = "memo-input">
            <textarea defaultValue={"this is text area. please check this"}>
            </textarea>
        </div>
    )
}


