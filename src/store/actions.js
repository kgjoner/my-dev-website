import { homeSections, headerHeight } from '../constants/systemTypes'
import { 
  CHANGE_WIDTH, 
  SET_HEADER_TRANSPARENCY, 
  SET_MONITOR_ACTIVE_SECTION, 
  SET_SECTIONS,
  SET_ACTIVE_SECTION, 
  SET_PROJECT,
} from '../constants/actionTypes'


export const updateWidth = () => {
  return {
    type: CHANGE_WIDTH
  }
}

export const updateHeaderTransparency = (boolean) => {
  return {
    type: SET_HEADER_TRANSPARENCY,
    payload: boolean
  }
}

export const updateMonitorActiveSection = (boolean) => {
  return {
    type: SET_MONITOR_ACTIVE_SECTION,
    payload: boolean
  }
}

export const updateSections = (newSections) => {
  return {
    type: SET_SECTIONS,
    payload: newSections
  }
}

export const updateActiveSection = (newSection) => {
  return {
    type: SET_ACTIVE_SECTION,
    payload: newSection
  }
}

export const updateProjectsMail = (newProject) => {
  return {
    type: SET_PROJECT,
    payload: newProject
  }
}

export const clearProjectsMail = () => {
  return {
    type: SET_PROJECT,
    payload: null
  }
}


export const monitorScroll = () => {
  return (dispatch, getState) => {
    const state = getState()
    if(window.location.pathname !== '/') {
      if(state.monitorActiveSection) {
        dispatch(checkActiveSection())
      }
      if(state.isHeaderTransparent) {
        dispatch(updateHeaderTransparency(false))
      }
    } else {
      if(state.monitorActiveSection && window.scrollY > 50) {
        dispatch(checkActiveSection())
      }
  
      if(window.scrollY > 50 && state.isHeaderTransparent) {
        dispatch(updateHeaderTransparency(false))
        if(state.monitorActiveSection) {
          dispatch(updateActiveSection(homeSections.PROJECTS))
        }
      } else if(window.scrollY <= 50 && !state.isHeaderTransparent) {
        dispatch(updateHeaderTransparency(true))
        dispatch(updateActiveSection(homeSections.HERO))
      }
    }
  }
}


export const checkActiveSection = () => {
  return (dispatch, getState) => {
    const state = getState()
    const sectionsElementsLastToFirst = getSectionsElementsLastToFirst(state.sections)
    if(!sectionsElementsLastToFirst.length) return { type: 'NONE' }
    
    let currentActiveSection = null
    sectionsElementsLastToFirst.some(el => {
      if(el.offsetTop <= (window.scrollY + headerHeight + 50)) {
        currentActiveSection = el.id
        return true
      }
      return false
    })

    if(currentActiveSection !== state.activeSection) {
      const correctedActiveSection = currentActiveSection || state.sections[0].id
      dispatch(updateActiveSection(correctedActiveSection))
    }
  }

  function getSectionsElementsLastToFirst(sections) {
    const sectionsElements = sections.map(section => {
      return document.getElementById(section.id)
    })
    return sectionsElements.sort((a, b) => b.offsetTop - a.offsetTop)
  }
}


export const scrollPage = ({ destination, offset, duration }) => {
  return (dispatch) => {
    dispatch(updateActiveSection(destination))
    dispatch(updateMonitorActiveSection(false))
    const destinationEl = document.getElementById(destination)
  
    const isTabUser = document.querySelector('.tab-user')
    const firstFocusableElement = destinationEl.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  
    let start = window.pageYOffset;
    const startTime = 'now' in window.performance ? performance.now() : new Date().getTime();
    const documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
    const windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
    const destinationOffset = destinationEl.offsetTop;
    let destinationOffsetToScroll = Math.round(documentHeight - destinationOffset < windowHeight ? documentHeight - windowHeight : destinationOffset);
    
    function scroll() {
      const now = 'now' in window.performance ? performance.now() : new Date().getTime();
      const time = Math.min(1, ((now - startTime) / duration));
      if(destinationOffsetToScroll > start) {
        window.scroll(0, Math.ceil((time * (destinationOffsetToScroll - start - offset)) + start));
        if(Math.ceil(window.scrollY) < (destinationOffsetToScroll - offset)) {
          window.requestAnimationFrame(scroll);
        } else {
          dispatch(updateMonitorActiveSection(true))
          if(isTabUser && firstFocusableElement) firstFocusableElement.focus()
        }
      } else {
        window.scroll(0, Math.ceil((time * (destinationOffsetToScroll - start - offset)) + start));
        if((Math.ceil(window.scrollY) > (destinationOffsetToScroll - offset)) &&
          window.scrollY !== 0) {
          window.requestAnimationFrame(scroll);
        } else {
          dispatch(updateMonitorActiveSection(true))
          if(isTabUser && firstFocusableElement) firstFocusableElement.focus()
        }
      }
    }
    window.requestAnimationFrame(scroll)
  }
}