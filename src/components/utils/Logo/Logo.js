import React from 'react'
import './logo.css'

const Logo = ({ handleClick, light, dark }) => {
  return (
    <div 
      className={
        'logo' +
        (light ? ' logo--light' : '') +
        (dark ? ' logo--dark' : '')
      }
      onClick={handleClick}
    >
      <div id="logo__background">
        {
          Array.from({length: 10}).map((_, index) => (
            <div 
              key={index} 
              className={`logo__bubble logo__bubble--${index + 1}`}
            ></div>
          ))
        }
      </div>
    </div>
  )
}

export default Logo