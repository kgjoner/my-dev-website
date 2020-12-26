import React from 'react'
import { homeSections } from '../../../constants/systemTypes'

import './hero.css'

const Hero = () => {
  return (
    <section className="hero" id={homeSections.HERO}>
      <div className="app__container">
        <div className="hero__container">
          <p className="hero__text hero__text--first">
            Hi, I'm Kaio
          </p>
          <p className="hero__text">
            Let's build a website
          </p>
        </div>
      </div>
    </section>
  )
}

export default Hero