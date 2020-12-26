import React, { useEffect } from 'react'

import { useDispatch } from "react-redux"
import { updateWidth } from "../../store/actions"


const System = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    console.log('system rerendered!')
    window.addEventListener('resize', checkWidth)
    window.addEventListener('keydown', setTabUser)

    return () => {
      window.removeEventListener('resize', checkWidth)
      window.removeEventListener('keydown', setTabUser)
    }
  }, [ dispatch, checkWidth, setTabUser ])


  function checkWidth() {
    dispatch(updateWidth())
  }

  function setTabUser(e) {
    if(e.key === 'Tab') {
      document.body.classList.add('tab-user')
      window.removeEventListener('keydown', setTabUser)
      window.addEventListener('mousedown', setMouseUser)
    }
  }

  function setMouseUser() {
    document.body.classList.remove('tab-user')
    window.removeEventListener('mousedown', setMouseUser)
    window.addEventListener('keydown', setTabUser)
  }

  return (
    <div></div>
  )
}


export default System