import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useStaticQuery, graphql } from "gatsby"
import { homeSections, root } from '../../../constants/systemTypes'
import { clearProjectsMail } from '../../../store/actions'
import usePrevious from '../../../hooks/usePrevious'

import IndexController from '../../utils/IndexController'
import presentationSprite from '../../../assets/img/presentations_sprite.png'
import presentationSpriteMob from '../../../assets/img/presentations_sprite-mob.png'
import logosSprite from '../../../assets/img/logos_sprite.png'
import './projects.css'

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      allProjectsJson {
        edges {
          node {
            name
            mainColor
            logo {
              top
              left
            }
            description
            link
            github
            text
            technicalInfo {
              backend {
                tech
                infrastructure
                database
                modules
              }
              frontend {
                tech
                infrastructure
                modules
              }
            }
            presentation {
              top
              left
            }
          }
        }
      }
    }
  `)

  const [ projects, setProjects ] = useState([])
  const [ selectedIndex, setSelectedIndex ] = useState(0)
  const [ selectedProject, setSelectedProject ] = useState({})
  const [ presentationPosition, setPresentationPosition ] = useState({})
  const [ isChanging, setIsChanging ] = useState(false)
  const [ isActive, setIsActive ] = useState(false)
  const presentationFigure = useRef(null)

  const projectsMail = useSelector(state => state.projectsMail)
  const activeSection = useSelector(state => state.activeSection)
  const windowWidth = useSelector(state => state.windowWidth)
  const previousActiveSection = usePrevious(activeSection)
  const dispatch = useDispatch()

  useEffect(() => {
    const projectsFromData = data.allProjectsJson.edges.map(p => p.node) || []
    setProjects(projectsFromData)
    setSelectedProject(projectsFromData[selectedIndex])

    changePresentationFigureHeight()

    return () => {
      const mainColor = projectsFromData[0]?.mainColor || root.MAIN_COLOR
      const mainRGB = hexToRgb(mainColor)
      document.documentElement.style.setProperty('--project-color', mainColor)
      document.documentElement.style.setProperty('--project-rgb', mainRGB)
      document.documentElement.style.setProperty('--main-color', root.MAIN_COLOR)
      document.documentElement.style.setProperty('--main-rgb', root.MAIN_RGB)
    }
  }, [])

  useEffect(() => {
    if(!projects.length) return

    const newSelectedProject = projects[selectedIndex]
    setSelectedProject(newSelectedProject)

    const scale = presentationFigure.current
      ? presentationFigure.current.getBoundingClientRect().width / 700
      : 1
    setPresentationPosition({
      top: newSelectedProject?.presentation?.top * scale,
      left: newSelectedProject?.presentation?.left * scale,
    })
  }, [ selectedIndex ])

  useEffect(() => {
    if(activeSection === homeSections.PROJECTS) {
      document.documentElement.style.setProperty('--main-color', selectedProject.mainColor)
      document.documentElement.style.setProperty('--main-rgb', hexToRgb(selectedProject.mainColor))
      setIsActive(true)
    } else if (previousActiveSection === homeSections.PROJECTS) {
      document.documentElement.style.setProperty('--main-color', root.MAIN_COLOR)
      document.documentElement.style.setProperty('--main-rgb', root.MAIN_RGB)
      setIsActive(false)
    }
  }, [ activeSection, previousActiveSection ])

  useEffect(() => {
    changePresentationFigureHeight()
  }, [ windowWidth ])

  useEffect(() => {
    if(!projectsMail) return
    projects.some((project, index) => {
      if(project.name.toLowerCase() === projectsMail.toLowerCase()) {
        changeSelectedProject(index)
        return true
      }
    })
    dispatch(clearProjectsMail())
  }, [ projectsMail ])


  function changeSelectedProject(newIndex) {
    const mainColor = projects[newIndex].mainColor
    const mainRGB = hexToRgb(mainColor)
    setIsChanging(true)

    setTimeout(() => {
      document.documentElement.style.setProperty('--project-color', mainColor)
      document.documentElement.style.setProperty('--project-rgb', mainRGB)
      document.documentElement.style.setProperty('--main-color', mainColor)
      document.documentElement.style.setProperty('--main-rgb', mainRGB)
      document.documentElement.style.setProperty('--mask-position', 
        `${projects[newIndex].logo.left}px ` +
        `${projects[newIndex].logo.top}px`
      )
      setSelectedIndex(newIndex)
    }, 120)

    setTimeout(() => setIsChanging(false), 600)
  }

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
  }

  function changePresentationFigureHeight() {
    const pictureWidth = presentationFigure.current.getBoundingClientRect().width
    const pictureHeight = pictureWidth * ( 450 / 700 )
    presentationFigure.current.style.height = `${pictureHeight}px`
  }

  return (
    <section className="projects" id={homeSections.PROJECTS}>
      <div className="app__container">
        <IndexController 
          contentLength={projects.length}
          selectedIndex={selectedIndex}
          shouldListen={isActive}
          handleIndexChange={changeSelectedProject}
        />

        <div  
          className={
            'projects__container' + 
            (isChanging ? ' slow-blink' : '')
          }
        >
          <div className="projects__header">
            <div className="projects__title">
              <figure className="projects__logo">
                <img src={logosSprite} alt="logo"
                  className={selectedProject === projects[0] ? 'ficcionados': ''}
                  style={{
                    'top': selectedProject?.logo?.top + 'px',
                    'left': selectedProject?.logo?.left + 'px'
                  }}
                />
              </figure>
              <h3 className="projects__name">
                {selectedProject?.name}
              </h3>
            </div>
            <p className="projects__description">
              {selectedProject?.description}
            </p>
            <div className="projects__links">
              { selectedProject?.link
                ? <a className="projects__link"
                    href={selectedProject.link} 
                    target="_blank"
                    rel="noopener">
                    Website
                  </a>
                : null
              }
              { selectedProject?.github
                ? <a className="projects__link"
                    href={selectedProject.github} 
                    target="_blank"
                    rel="noopener">
                    Github
                  </a>
                : null
              }
            </div>
            <figure className="projects__picture"
              ref={presentationFigure}
            >
              <img
                src={windowWidth < 1000 && windowWidth >= 700
                    ? presentationSpriteMob
                    : presentationSprite} 
                alt={`${selectedProject?.name} presentation`}
                style={{
                  'top': presentationPosition?.top + 'px',
                  'left': presentationPosition?.left + 'px'
                }}
              />
            </figure>
          </div>

          <div className="projects__info">
            { selectedProject?.text?.map((paragraph, index) => (
                <p className="projects__details" 
                  key={index}>
                  {paragraph}
                </p>
              ))
            }
            { selectedProject?.technicalInfo?.backend
              ? <figure className="projects__details projects__details--extra-margin">
                  <figcaption>Backend ({selectedProject?.technicalInfo.backend.tech}):</figcaption>
                  <ul>
                    { selectedProject?.technicalInfo.backend.infrastructure
                      ? <li>
                          Infrastructure: {selectedProject?.technicalInfo.backend.infrastructure}
                        </li>
                      : null
                    }
                    <li>Database: {selectedProject?.technicalInfo.backend.database}</li>
                    <li>Major Modules: {selectedProject?.technicalInfo.backend.modules}</li>
                  </ul>
                </figure>
              : null
            }
            { selectedProject?.technicalInfo?.frontend
              ? <figure className="projects__details">
                  <figcaption>Frontend ({selectedProject?.technicalInfo.frontend.tech}):</figcaption>
                  <ul>
                    { selectedProject?.technicalInfo.frontend.infrastructure
                      ? <li>
                          Infrastructure: {selectedProject?.technicalInfo.frontend.infrastructure}
                        </li>
                      : null
                    }
                    <li>Major Modules: {selectedProject?.technicalInfo.frontend.modules}</li>
                  </ul>
                </figure>
              : null
            }            
          </div>

        </div>
      </div>
    </section>
  )
}

export default Projects