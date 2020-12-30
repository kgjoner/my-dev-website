import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { scrollPage } from '../../../store/actions'
import './goToTop.css'

const GoToTop = () => {
  const [ scrollY, setScrollY ] = useState(0)
  const dispatch = useDispatch()

  useEffect(() => {
    window.addEventListener('scroll', updateScrollY)
    return () => {
      window.removeEventListener('scroll', updateScrollY)
    }
  }, [])

  function scrollToTop() {
    dispatch(scrollPage({
      destination: 'app',
      offset: 0,
      duration: 900
    }))
  }

  function updateScrollY() {
    setScrollY(window.scrollY)
  }


  return (
    <div 
      className={
        'go-to-top' + 
        (scrollY < 200 ? ' go-to-top--hidden': '')
      }
    >
      <button 
        className="go-to-top__btn"
        onClick={scrollToTop}
      >
        <i className="fa fa-arrow-up"></i>
      </button>
    </div>
  )
}

export default GoToTop