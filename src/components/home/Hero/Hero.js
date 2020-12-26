import React from 'react'
import { homeSections } from '../../../constants/systemTypes'

const Hero = () => {
  return (
    <div className="app__container"
      id={homeSections.HERO}
      style={{ height: '100vh' }}
    >
      <h1>Hero</h1>
    </div>
  )
}

export default Hero