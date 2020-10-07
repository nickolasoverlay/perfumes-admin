import React from 'react'
import { connect } from 'react-redux'
import Wrapper from './../../ui/Wrapper'

import './Home.css'

const Home = () => {
  return <Wrapper>{null}</Wrapper>
}

const mapStateToProps = state => {
  return {
    authState: state.authReducer
  }
}

export default connect(mapStateToProps)(Home)