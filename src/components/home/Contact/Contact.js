import React, { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { homeSections } from '../../../constants/systemTypes'

import './contact.css'

const Contact = () => {
  const [ formName, setFormName ] = useState('')
  const [ formEmail, setFormEmail ] = useState('')
  const [ formMessage, setFormMessage ] = useState('')
  const windowWidth = useSelector(state => state.windowWidth)

  function handleSubmit() {
    setFormMessage(formMessage + ' /from .dev subdomain.')
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
      // .then(() => this.$toasted.success('Message sent!', { icon: 'check' }))
      .then(() => {
        setFormName('')
        setFormEmail('')
        setFormMessage('')
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
    <section class="contact" id={homeSections.CONTACT}>
      <div class="app__container">
        <h2 class="app__heading">
          Contact
        </h2>
        <div class="contact__container">
          <div class="contact__info">
            <h3>Email and Social Media</h3>
            <div class="contact__wrap">
              <div class="contact__media">
                <a class="contact__link" 
                  href="mailto:contact@kgjoner.com"
                  title="email">
                    <i class="fa fa-envelope"></i>
                </a>
                { windowWidth > 780
                  ? <p>contact@kgjoner.com</p>
                  : null
                }
              </div>
              <div class="contact__media">
                <a class="contact__link git" 
                  href="https://github.com/kgjoner" 
                  target="_blank"
                  rel="noopener"
                  title="Github">
                    <i class="fa fa-github"></i>
                </a>
                { windowWidth > 780
                  ? <p>/kgjoner</p>
                  : null
                }
              </div>
              <div class="contact__media">
                <a class="contact__link in"
                  href="https://www.linkedin.com/in/kaio-gabriel-63938011a/" 
                  target="_blank"
                  rel="noopener"  
                  title="Linkedin">
                    <i class="fa fa-linkedin"></i>
                </a>
                { windowWidth > 780
                  ? <p>kaio gabriel</p>
                  : null
                }
              </div>
            </div>
            { windowWidth <= 780
              ? <div class="contact__media">
                  <p>contact@kgjoner.com</p>
                </div>
              : null
            }
          </div>

          <form class="contact__form" name="Contact" 
            submit={handleSubmit} method="post" 
            data-netlify="true" data-netlify-honeypot="bot-field">

            <input type="hidden" name="form-name" value="Contact" />

            <h3>Let a message!</h3>
            <div class="contact__input-group">
                <label for="contact-name" 
                  class="contact__label">
                  Name
                </label>
                <input id="contact-name"
                  class="contact__input" 
                  name="name" type="text" 
                  placeholder="Name"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  v-model="form.name" 
                  required />
            </div>
            <div class="contact__input-group">
                <label for="contact-email" 
                  class="contact__label">
                  Email	
                </label>
                <input id="contact-email"
                  class="contact__input" 
                  name="email" type="text" 
                  placeholder="Email"
                  value={formEmail}
                  onChange={e => setFormEmail(e.target.value)} 
                  required />
            </div>
            <div class="contact__input-group">
              <label for="contact-content" 
                class="contact__label">
                Message
              </label>
              <textarea id="contact-content"
                class="contact__input contact__input--textarea"  
                name="text" rows="4" max-rows="4" 
                value={formMessage}
                onChange={e => setFormMessage(e.target.value)}
                placeholder="Message"/>
            </div>

            <div class="contact__input-group send">
              <button type="submit">Send</button>
            </div>
          </form>
        </div>

      </div>
    </section>
  )
}

export default Contact