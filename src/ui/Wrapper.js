import React from 'react'
import { connect } from 'react-redux'
import Left from './Left'
import Login from './../pages/Login/Login'
import './Wrapper.css'

const Wrapper = props => {
  return (
    <>
      {props.authState.isLoggedIn ?
        <>
          <Left />
          <div className="Wrapper">
            {props.children}
          </div>
        </> : <Login />
      }
    </>
  )
}

const mapStateToProps = state => {
  return {
    authState: state.authReducer
  }
}

export default connect(mapStateToProps)(Wrapper)