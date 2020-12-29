import React from 'react'
import './footer.css'


const Footer = () => (
  <footer className="footer">
    <span className="copyright">
      © {new Date().getFullYear()} Kaio Gabriel
    </span>
  </footer>
)

export default Footer