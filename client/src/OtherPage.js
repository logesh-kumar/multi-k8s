import React, { Component } from 'react'
import { Link } from "react-router-dom";

export default class OtherPage extends Component {
    render() {
        return (
            <div>
                Im Some other page
                <Link to="/">GO Back Home</Link>
            </div>
        )
    }
}
