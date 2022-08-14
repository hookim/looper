import React from "react";
import {connect} from "react-redux"
import {Link} from "react-router-dom"

const mapStateToProps = (state) => {
    return {state}
}

class WrappedMain extends React.Component{
    constructor(props){
        super(props)
        console.log(this.props.state)
    }

    render(){
        return (
            <div>
                {this.props.state.map((item, idx) => {
                    return <Link to = {`/looper#${item.id}`}>{item.title}</Link>
                })}
            </div>
        )
    }
}

const Main = connect(mapStateToProps)(WrappedMain)


export default Main;