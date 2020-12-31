import React, { useEffect } from "react"
import { useDispatch } from 'react-redux'
import { updateSections } from "../store/actions"
import { homeSections } from "../constants/systemTypes"

import SEO from '../components/seo'
import Hero from '../components/home/Hero'
import Projects from '../components/home/Projects'
import Presentation from '../components/home/Techs'
import Blog from '../components/home/Blog'
import Contact from '../components/home/Contact'

const HomePage = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateSections(Object.values(homeSections).slice(1).map(section => ({
      id: section,
      value: section.charAt(0).toUpperCase() + section.slice(1),
      depth: 2
    }))))
  })

  return (
    <>
      <SEO />
      <Hero />
      <Projects />
      <Presentation />
      <Blog />
      <Contact />
    </>
  )
}

export default HomePage
