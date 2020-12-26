import React from 'react'
import { homeSections } from '../../../constants/systemTypes'

const Blog = () => {
  return (
    <div className="app__container"
      id={homeSections.BLOG}
      style={{ height: '100vh' }}
    >
      <h1>Blog</h1>
    </div>
  )
}

export default Blog