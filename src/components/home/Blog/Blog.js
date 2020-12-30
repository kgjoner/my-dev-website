import React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import { homeSections } from '../../../constants/systemTypes'

import './blog.css'

const Blog = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark(limit: 10, sort: {order: DESC, fields: frontmatter___date}) {
        nodes {
          id
          frontmatter {
            title
            publishedAt
            slug
          }
        }
      }
    }
  `)

  return (
    <section className="blog" id={homeSections.BLOG}>
      <div className="app__container">
        <h2 className="app__heading">
          Blog
        </h2>
        <ul className="blog__posts-list">
          { data.allMarkdownRemark.nodes.map(post => (
            <li key={post.id}
              className="blog__post">
              <Link to={`blog/${post.frontmatter.slug}`}>
                <i className="fa fa-file-text"></i>
                <div>
                  <h3 className="blog__post-title">
                    {post.frontmatter.title}
                  </h3>
                  <p className="blog__post-date">
                    {post.frontmatter.publishedAt}
                  </p>
                </div>
              </Link>
            </li>
          ))
          }
        </ul>
        <div className="blog__alert">
          <div>
            <div className="blog__point"></div>
            <div className="blog__point"></div>
            <div className="blog__point"></div>
          </div>
          <p className="blog__message">
            More posts coming soon
          </p>
        </div>
      </div>
    </section>
  )
}

export default Blog