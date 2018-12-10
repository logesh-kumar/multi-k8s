import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Fib from './Fib'
import OtherPage from './OtherPage'
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

class App extends Component {
  render() {
    return (
      <Router>
        <div className='App'>
          <div>
            <Switch>
              <Route exact path='/' component={Fib} />
              <Route exact path='/otherPage' component={OtherPage} />
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}

export default App
