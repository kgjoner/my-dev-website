import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { headerHeight } from '../../../constants/systemTypes'
import { scrollPage } from '../../../store/actions'
import './navDrawer.css'

const NavDrawer = ({ children, pathname, left }) => {
  const [ showDrawer, setShowDrawer ] = useState(false)
  const [ drawedOnce, setDrawedOnce ] = useState(false)
  const container = useRef(null)

  const windowWidth = useSelector(state => state.windowWidth)
  const sections = useSelector(state => state.sections)
  const activeSection = useSelector(state => state.activeSection)
  const dispatch = useDispatch()

  useEffect(() => {
    scrollContainerToShowSelectedItem()
  }, [ activeSection ])

  useEffect(() => {
    if(showDrawer) {
      scrollContainerToShowSelectedItem()
    }
  }, [ showDrawer ])


  function toggleDrawer() {
    if(!drawedOnce) setDrawedOnce(true)
    setShowDrawer(!showDrawer)
  }

  function scrollTo(id) {
    const offset = pathname === '/' ? 60 : 
      windowWidth > 780 ? 40 : -20
    dispatch(scrollPage({
      destination: id, 
      offset: headerHeight - offset, 
      duration: 900
    }))
    setShowDrawer(false)
  }

  function scrollContainerToShowSelectedItem() {
    const itemEl = document.querySelector('.nav-drawer__link--selected')
    if(!itemEl) return
    
    const containerEl = container.current
    let scrollMod = (itemEl.getBoundingClientRect().top - containerEl.offsetTop 
      - containerEl.getBoundingClientRect().height/2)
    containerEl.scroll(0, containerEl.scrollTop + scrollMod, 0)
  }

  return (
    <div 
      className={
        'nav-drawer' +
        (left ? ' nav-drawer--left' : '')
      }
    >
      {React.cloneElement(children, { onClick: toggleDrawer })}

      <ul 
        className={
          'nav-drawer__container' +
          (showDrawer  
            ? ' nav-drawer__container--draw' 
            : drawedOnce ? ' nav-drawer__container--recoil' : '')
        }
        ref={container}
        role="menu"
      >
        { sections.map((section, index) => (
            <li key={index}
              className={
                'nav-drawer__link' +
                ` nav-drawer__link--${section.depth}` +
                (activeSection === section.id ? ' nav-drawer__link--selected' : '')
              }
              onClick={() => scrollTo(section.id)}
            >
              <a tabIndex={showDrawer ? 0 : -1}>
                {section.depth === 1 ? 'Introduction' : section.value}
              </a>
            </li>
          ))
        }

        <div className="nav-drawer__actions">
          <button className="nav-drawer__btn" 
            onClick={toggleDrawer}
            tabIndex={showDrawer ? 0 : -1}
          >
            <i className="nav-drawer__icon fa fa-close"></i>
          </button>
        </div>
      </ul>
    </div>
  )
}

export default NavDrawer