import React from 'react'
import Files from './FileHandler'
import './style.css';

class Dashboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      files: []
    }
  }

  render () {
    return (
      <div><h1>Hello!</h1></div>
    )
  }
}

export default Dashboard;