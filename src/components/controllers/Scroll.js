import React, { useEffect } from 'react'

import { useDispatch } from "react-redux"
import { monitorScroll } from '../../store/actions'

const Scroll = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatchMonitorScroll()
    window.addEventListener('scroll', dispatchMonitorScroll)
    return () => {
      window.removeEventListener('scroll', dispatchMonitorScroll)
    }
  }, [])

  function dispatchMonitorScroll() {
    dispatch(monitorScroll())
  }

  return (
    <div></div>
  )
}


export default Scroll