import React from "react"
import PropTypes from "prop-types"

import Header from '../components/template/Header'
import './default.css'

const Layout = ({ location, children }) => {
  return (
    <div className="app">
      <Header pathname={location.pathname} />
      <main>{children}</main>
      <footer style={{
        marginTop: `2rem`
      }}>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
