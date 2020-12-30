import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { graphql } from 'gatsby'
import { updateSections } from '../store/actions'

import NavDrawer from '../components/template/NavDrawer/NavDrawer'
import './post.css'


const Post = ({ data, location }) => {
  const { markdownRemark } = data
  const { frontmatter, html } = markdownRemark

  const windowWidth = useSelector(state => state.windowWidth)
  const dispatch = useDispatch()

  useEffect(() => {
    const headings = markdownRemark.headings
      .filter(h => h.depth < 4)
    dispatch(updateSections(headings))
  }, [])

  return (
    <div className="post">
      { windowWidth && windowWidth > 780
        ? <aside className="post__menu">
            <NavDrawer
              pathname={location.pathname} 
              left  
            >
              <button className="post__side-btn">
                Table of Contents
              </button>
            </NavDrawer>
          </aside>
        : null
      }


      <div className="app__container">
        <div className="post__content">
          <h1 id={markdownRemark.headings[0].id}>
            {markdownRemark.headings[0].value}
          </h1>
          <div className="post__details">
            <time className="post__detail"
              dateTime={frontmatter.publishedAt}>
              { frontmatter.publishedAt }
            </time>
            <p className="post__detail">
              {markdownRemark.timeToRead}min read
            </p>
          </div>
        </div>
        <div 
          className="post__content"
          dangerouslySetInnerHTML={{ __html: html.split('</h1>')[1] }}
        >
        </div>
        <div className="post__comments">
          {/* <Disqus
            :identifier="$route.params.slug"
            :url="'https://dev.kgjoner.com.br' + $route.fullPath.split('#')[0]"
          ></Disqus> */}
        </div>
      </div>
    </div>
  )
}

export const pageQuery = graphql`
  query($slug: String!) {
    markdownRemark(frontmatter: { slug: { eq: $slug } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        publishedAt
        slug
        title
      }
      headings {
        id
        depth
        value
      }
      timeToRead
    }
  }
`

export default Post