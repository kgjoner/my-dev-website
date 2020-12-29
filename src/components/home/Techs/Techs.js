import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { homeSections } from '../../../constants/systemTypes'
import { scrollPage, updateProjectsMail } from '../../../store/actions'

import './techs.css'

const Techs = () => {
  const techs = [
    {
      name: 'React', 
      including: 'gatsby, redux, react-router, testing-library...',
      example: 'Vegmap'
    }, {
      name: 'Vue', 
      including: 'nuxt, gridsome, vuex, vue-router, vuetify...',
      example: 'Ficcionados, FreeFlow'
    }, {
      name: 'Node', 
      including: 'express, pm2, nodemailer, node-schedule, multer...',
      example: 'Ficcionados, Vegmap'
    }, {
      name: 'MongoDB', 
      including: 'atlas, mongolab, mongoose',
      example: 'Vegmap, Ficcionados',
    }, {
      name: 'Postgres', 
      including: 'knex, heroku integration',
      example: 'Ficcionados',
    }, {
      name: 'Redis',
      including: 'node redis, heroku integration',
      example: 'Vegmap'
    }, {
      name: 'Websocket', 
      including: 'socket.io',
      example: 'Vegmap'
    }, {
      name: 'PWA', 
      including: 'workbox',
      example: 'Vegmap'
    }, {
      name: 'JAMstack',
      including: 'gatsby, gridsome',
      example: 'Ficcionados'
    }, {
      name: 'Automated Tests',
      including: 'jest, cypress',
      example: 'Vegmap'
    }, {
      name: 'Netlify',
      including: 'plugins, forms, subdomains',
      example: 'Ficcionados, FreeFlow, Vegmap'
    }, {
      name: 'Heroku',
      including: 'integrations with postgres, mysql, cloudinary, redis...',
      example: 'Ficcionados, Vegmap'
    },
  ]

  const [ openTech, setOpenTech ] = useState(null)
  const [ closingTech, setClosingTech ] = useState(null)
  const dispatch = useDispatch()

  function toggleTech(techName) {
    setClosingTech(openTech)
    setOpenTech(openTech === techName ? null : techName)
    setTimeout(() => setClosingTech(null), 500)
  }

  function toProjects(project) {
    const destination = 'projects'
    dispatch(scrollPage({ destination, offset: 0, duration: 500 }))
    setTimeout(() => {
      dispatch(updateProjectsMail(project))
    }, 150)
  }

  return (
    <section className="presentation" id={homeSections.TECHS}>
      <div className="app__container">
        <h2 className="app__heading">
          Techs
        </h2>
        <div className="presentation__list-of-techs">
          { techs.map((tech, index) => (
              <button key={index}
                className={
                  'presentation__tech' + 
                  (openTech === tech.name || closingTech === tech.name ? ' presentation__tech--open' : '') +
                  (closingTech === tech.name ? ' presentation__tech--closing' : '')
                }
                aria-label={tech.name}
                onClick={() => toggleTech(tech.name)}
              >
                <div className="presentation__tech-name">
                  <i className={`presentation__icon fa ${openTech === tech.name 
                      ? 'fa-minus' : 'fa-plus'}`}>
                  </i>
                  <h3 className="presentation__text presentation__text--bigger-line">
                    {tech.name}
                  </h3>
                </div>
                { openTech === tech.name || closingTech === tech.name
                  ? <div className="presentation__tech-info">
                      <p className="presentation__text">
                        <i className="fa fa-wrench"></i>
                        {tech.including}
                      </p>
                      <p className="presentation__text">
                        { tech.example.split(', ').map((project, index) => (
                            <a key={index}
                              className="presentation__link"
                              onClick={() => toProjects(project)}>
                                {project || 'Not in portfolio'}
                            </a>
                          ))
                        }
                      </p>
                    </div>
                  : null
                }
              </button>
            ))
          }
        </div>
      </div>
    </section>
  )
}

export default Techs