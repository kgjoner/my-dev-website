import React, { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { homeSections } from '../../../constants/systemTypes'

import Notification from '../../utils/Notification'
import './contact.css'

const Contact = () => {
  const [ formName, setFormName ] = useState('')
  const [ formEmail, setFormEmail ] = useState('')
  const [ formMessage, setFormMessage ] = useState('')
  const [ isLoading, setIsLoading ] = useState('')
  const [ hasAlert, setHasAlert ] = useState(false)
  const [ alertMessage, setAlertMessage ] = useState('')
  const [ alertType, setAlertType ] = useState('')
  const windowWidth = useSelector(state => state.windowWidth)

  function handleSubmit(e) {
    e.preventDefault()
    setFormMessage(formMessage + ' /from .dev subdomain.')
    setIsLoading(true)
    setTimeout(() => {
      
    }, 3000)
    axios
      .post('/', encode({
          'form-name': 'Contact',
          name: formName,
          email: formEmail,
          text: formMessage
        }),
        {
          header: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      )
      .then(() => {
        setAlertMessage('Message has been sent!')
        setAlertType('success')
        setFormName('')
        setFormEmail('')
        setFormMessage('')
      })
      .catch(() => {
        setAlertMessage('Error: Message could NOT been sent!')
        setAlertType('error')
      })
      .finally(() => {
        setIsLoading(false)
        setHasAlert(true)
        setTimeout(() => {
          setHasAlert(false)
        }, 3000)
      })
    

    function encode (data) {
      return Object.keys(data)
        .map(
          key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
        )
        .join("&");
    } 
  }

  return (
    <section className="contact" id={homeSections.CONTACT}>
      <div className="app__container">
        <h2 className="app__heading">
          Contact
        </h2>
        <div className="contact__container">
          <div className="contact__info">
            <h3>Email and Social Media</h3>
            <div className="contact__wrap">
              <div className="contact__media">
                <a className="contact__link" 
                  href="mailto:contact@kgjoner.com"
                  title="email">
                    <i className="fa fa-envelope"></i>
                </a>
                { windowWidth > 780
                  ? <p>contact@kgjoner.com</p>
                  : null
                }
              </div>
              <div className="contact__media">
                <a className="contact__link git" 
                  href="https://github.com/kgjoner" 
                  target="_blank"
                  rel="noopener"
                  title="Github">
                    <i className="fa fa-github"></i>
                </a>
                { windowWidth > 780
                  ? <p>/kgjoner</p>
                  : null
                }
              </div>
              <div className="contact__media">
                <a className="contact__link in"
                  href="https://www.linkedin.com/in/kaio-gabriel-63938011a/" 
                  target="_blank"
                  rel="noopener"  
                  title="Linkedin">
                    <i className="fa fa-linkedin"></i>
                </a>
                { windowWidth > 780
                  ? <p>kaio gabriel</p>
                  : null
                }
              </div>
            </div>
            { windowWidth <= 780
              ? <div className="contact__media">
                  <p>contact@kgjoner.com</p>
                </div>
              : null
            }
          </div>

          <form className="contact__form" name="Contact" 
            onSubmit={handleSubmit} method="post" 
            data-netlify="true" data-netlify-honeypot="bot-field">

            <input type="hidden" name="form-name" value="Contact" />

            <h3>Let a message!</h3>
            <div className="contact__input-group">
                <label htmlFor="contact-name" 
                  className="contact__label">
                  Name
                </label>
                <input id="contact-name"
                  className="contact__input" 
                  name="name" type="text" 
                  placeholder="Name"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  v-model="form.name" 
                  required />
            </div>
            <div className="contact__input-group">
                <label htmlFor="contact-email" 
                  className="contact__label">
                  Email	
                </label>
                <input id="contact-email"
                  className="contact__input" 
                  name="email" type="text" 
                  placeholder="Email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)} 
                  required />
            </div>
            <div className="contact__input-group">
              <label htmlFor="contact-content" 
                className="contact__label">
                Message
              </label>
              <textarea id="contact-content"
                className="contact__input contact__input--textarea"  
                name="text" rows="4" max-rows="4" 
                value={formMessage}
                onChange={e => setFormMessage(e.target.value)}
                placeholder="Message"/>
            </div>

            <div className="contact__input-group send">
              <button type="submit">
                { isLoading
                  ? <i className="fa fa-circle-o-notch contact__loading"></i>
                  : 'Send'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
      <Notification 
        visible={hasAlert}
        message={alertMessage}
        type={alertType}
      />
    </section>
  )
}

export default Contact