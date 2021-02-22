import React from 'react'
import ReactDOM from 'react-dom'
import {Logo} from 'components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

function LoginForm({onSubmit, buttonText}) {
  const handleSubmit = e => {
    e.preventDefault()
    const username = e.target.elements.username.value
    const password = e.target.elements.password.value
    onSubmit({username, password})
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Username:</label>
        <input type="text" name="username" />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" />
      </div>
      <div>
        <button type="submit">{buttonText}</button>
      </div>
    </form>
  )
}

function App() {
  const [openModal, setOpenModal] = React.useState('none')

  const openLoginModal = () => setOpenModal('login')
  const openRegisterModal = () => setOpenModal('register')
  const closeModal = () => setOpenModal('none')

  const login = formData => {
    console.log('login', formData)
  }

  const register = formData => {
    console.log('register', formData)
  }

  return (
    <div>
      <Logo />
      <h1>Bookshelf</h1>
      <button onClick={openLoginModal}>Login</button>
      <button onClick={openRegisterModal}>Register</button>
      <Dialog
        aria-label="login-form"
        isOpen={openModal === 'login'}
        onDismiss={() => setOpenModal('none')}
      >
        <button className="close-button" onClick={closeModal}>
          <span aria-hidden>×</span>
        </button>
        <h3>Login</h3>
        <LoginForm onSubmit={login} buttonText="Login" />
      </Dialog>
      <Dialog
        aria-label="register-form"
        isOpen={openModal === 'register'}
        onDismiss={() => setOpenModal('none')}
      >
        <button className="close-button" onClick={closeModal}>
          <span aria-hidden>×</span>
        </button>
        <h3>Register</h3>
        <LoginForm onSubmit={register} buttonText="Register" />
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
