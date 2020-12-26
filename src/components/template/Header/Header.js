import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { navigate } from 'gatsby'
import { homeSections, headerHeight } from '../../../constants/systemTypes'
import { scrollPage } from '../../../store/actions'

import Navbar from '../Navbar'
import Logo from '../../utils/Logo'
import './header.css'


const Header = ({ pathname = '' }) => {
  const [notFixed, setNotFixed] = useState()

  const windowWidth = useSelector(state => state.windowWidth)
  const isHeaderTransparent = useSelector(state => state.isHeaderTransparent)
  const dispatch = useDispatch()

  useEffect(() => {
    setNotFixed( pathname.includes('/blog') && windowWidth > 780 )
  }, [ pathname, setNotFixed ])

  function toHome() {
    if(pathname === '/') {
      dispatch(scrollPage({
        destination: homeSections.HERO, 
        offset: headerHeight, 
        duration: 900
      }))
    } else {
      navigate('/')
    }
  }

  return (
    <header 
      className={
        'header' + 
        (isHeaderTransparent ? ' header--transparent' : '') +
        (notFixed ? ' header--not-fixed' : '')
      }
    >
      <div className="app__container">
        <div className="header__container">

          <Logo 
            handleClick={toHome}
            light={isHeaderTransparent}
          />
          <Navbar pathname={pathname} />
          {/* <NavDrawer 
            v-if="wasMounted && windowWidth && windowWidth <= 780"
            v-slot="{ toggleDrawer }"
          >
            <button 
              class="header__action" 
              @click="toggleDrawer"
            >
              <i class="header__icon fa fa-bars"></i>
            </button>
          </NavDrawer> */}
        </div>
      </div>
    </header>
  )
}

export default Header