import React from "react"
import { Provider } from "react-redux"

import DefaultLayout from "./src/layouts/Default"
import System from './src/components/controllers/System'
import Scroll from './src/components/controllers/Scroll'
import { store } from './src/store'

import './src/assets/css/global.css'
import './src/assets/css/custom-icon.css'
import './src/assets/css/code-highlight.css'
import 'font-awesome/css/font-awesome.css'


export const wrapPageElement = ({ element, props }) => {
  return (
    <DefaultLayout {...props}>
      <System />
      <Scroll />
      {element}
    </DefaultLayout>
  )
}

export const wrapRootElement = ({ element }) => {
  return <Provider store={store}>{element}</Provider>
}