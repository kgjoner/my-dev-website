import React, { useEffect } from 'react'
import './indexController.css'

const IndexController = ({ contentLength, selectedIndex, shouldListen, handleIndexChange }) => {
  const nextIndex = () => {
    let nextIndex = selectedIndex + 1
    if(nextIndex > contentLength - 1) nextIndex = 0
    return nextIndex
  }

  const previousIndex = () => {
    let previousIndex = selectedIndex - 1
    if(previousIndex < 0) previousIndex = contentLength - 1
    return previousIndex
  }

  function listenArrows(e) {
    if(e.key === 'ArrowLeft') {
      handleIndexChange(previousIndex())
    } else if(e.key === 'ArrowRight') {
      handleIndexChange(nextIndex())
    }
  }

  useEffect(() => {
    if(shouldListen) {
      window.addEventListener('keydown', listenArrows)
    } else {
      window.removeEventListener('keydown', listenArrows)
    }

    return () => {
      window.removeEventListener('keydown', listenArrows)
    }
  }, [ shouldListen, selectedIndex ])

  return (
    <div className="index-controller">
      <button className="index-controller__action"
        onClick={() => handleIndexChange(previousIndex())}
        aria-label="display previous project">
        <i className="fa fa-chevron-left"></i>
        prev
      </button>
      { Array.from({ length: contentLength }).map((_, index) => (
          <button key={index}
            className={
              'index-controller__marker' +
              (selectedIndex === index ? ' index-controller__marker--selected' : '')
            }
            onClick={() => handleIndexChange(index)}
            aria-label={`display project ${index + 1}`}
          >
          </button>
        ))
      }
      <button className="index-controller__action"
        onClick={() => handleIndexChange(nextIndex())}
        aria-label="display next project">
        next
        <i className="fa fa-chevron-right"></i>
      </button>
    </div>
  )
}

export default IndexController