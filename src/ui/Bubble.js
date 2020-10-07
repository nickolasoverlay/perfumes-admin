import React from 'react'
import './Bubble.css'

const Bubble = props => {
  return <div className="Bubble" {...props}>{props.children}</div>
}

export default Bubble