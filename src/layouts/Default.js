import React from "react"
import PropTypes from "prop-types"

import Header from '../components/template/Header'
import Footer from '../components/template/Footer'
import './default.css'

const Layout = ({ location, children }) => {
  return (
    <div className="app" id="app">
      <Header pathname={location.pathname} />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
