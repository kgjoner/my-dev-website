import React, { useEffect, useState } from 'react'
import usePrevious from '../../../hooks/usePrevious'
import './notification.css'

const Notification = ({ visible, message, type }) => {
  const [ dismiss, setDismiss ] = useState(false)
  const previousVisible = usePrevious(visible)

  useEffect(() => {
    if(previousVisible && !visible) {
      console.log('dismiss')
      setDismiss(true)
      setTimeout(() => {
        setDismiss(false)
      }, 600)
    }
  }, [ visible ])

  if(!visible && !dismiss) return null
  console.log(dismiss)
  return (
    <div className={`notification notification--${type}`}>
      <div 
        className={
          'notification__container' +
          (dismiss ? ' notification__container--dismiss' : '')
        }
      >
        {message}
      </div>
    </div>
  )
}

export default Notification