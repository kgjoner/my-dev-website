import { homeSections } from '../constants/systemTypes'
import { 
  CHANGE_WIDTH, 
  SET_HEADER_TRANSPARENCY,
  SET_MONITOR_ACTIVE_SECTION, 
  SET_SECTIONS,
  SET_ACTIVE_SECTION, 
  SET_PROJECT,
} from '../constants/actionTypes'


export const initialState = {
  windowWidth: typeof window !== 'undefined' ? window.innerWidth : 1280,
  isHeaderTransparent: true,
  monitorActiveSection: true,
  sections: [],
  activeSection: homeSections.HERO,
  projectsMail: null
}

export const reducer = (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case CHANGE_WIDTH:
      return Object.assign({}, state, {
        windowWidth: window.innerWidth
      })

    case SET_HEADER_TRANSPARENCY:
      return Object.assign({}, state, {
        isHeaderTransparent: payload
      })

    case SET_MONITOR_ACTIVE_SECTION:
      return Object.assign({}, state, {
        monitorActiveSection: payload
      })

    case SET_SECTIONS:
      return Object.assign({}, state, {
        sections: payload
      })

    case SET_ACTIVE_SECTION:
      return Object.assign({}, state, {
        activeSection: payload
      })

    case SET_PROJECT:
      return Object.assign({}, state, {
        projectsMail: payload
      })

    default:
      return state
  }
}