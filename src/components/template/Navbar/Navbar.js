import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { navigate } from 'gatsby'

import { homeSections, headerHeight } from "../../../constants/systemTypes"
import { scrollPage } from '../../../store/actions'
import './navbar.css'


const Navbar = ({ pathname }) => {
  const [isBlogPage, setIsBlogPage] = useState()

  const windowWidth = useSelector(state => state.windowWidth)
  const isHeaderTransparent = useSelector(state => state.isHeaderTransparent)
  const activeSection = useSelector(state => state.activeSection)
  const dispatch = useDispatch()

  useEffect(() => {
    setIsBlogPage(pathname.includes('/blog'))
  }, [ pathname, setIsBlogPage ])


  function handleNavigation(section) {
    if(pathname === '/') {
      scrollTo(section)
    } else {
      navigate('/')
      setTimeout(() => scrollTo(section), 300)
    }
  }

  function scrollTo(section) {
    dispatch(scrollPage({
      destination: section, 
      offset: headerHeight - 60, 
      duration: 900
    }))
  }

  return (
    <nav className={`navbar ${isHeaderTransparent && "navbar--transparent"}`}>
      <ul className="navbar__menu" role="menu">
        {Object.values(homeSections).map((section, index) => (
          <React.Fragment key={index}>
            {index !== 0 
              && (windowWidth > 780 ||
                (activeSection == section && windowWidth >= 350)) 
              ? <li
                  className={`navbar__link 
                      ${
                        (activeSection === section ||
                        (section === homeSections.BLOG && isBlogPage) )
                          ? "navbar__link--active"
                          : ""
                      }`}
                  role="menuitem"
                  onClick={() => handleNavigation(section)}
                >
                  <a>{section}</a>
                </li>
              : null
            }
          </React.Fragment>
        ))}
      </ul>
    </nav>
  )
}

export default Navbar
