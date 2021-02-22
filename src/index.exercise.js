import React from 'react'
import ReactDOM from 'react-dom'
import {Logo} from 'components/logo'
import {Dialog} from '@reach/dialog'
import '@reach/dialog/styles.css'

function LoginForm({onSubmit, buttonText}) {
  return (
    <form>
      <label htmlFor="username">Username:</label>
      <input type="text" name="username" />
      <br />
      <label htmlFor="password">Password:</label>
      <input type="password" name="password" />
      <br />
      <input type="submit" onSubmit={onSubmit} value={buttonText} />
    </form>
  )
}

function App() {
  const [openModal, setOpenModal] = React.useState('none')

  const openLoginModal = () => setOpenModal('login')
  const openRegisterModal = () => setOpenModal('register')
  const closeModal = () => setOpenModal('none')

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('form submitted!')
    console.log(e)
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
        <LoginForm onSubmit={handleSubmit} buttonText="Login" />
      </Dialog>
      <Dialog
        aria-label="login-form"
        isOpen={openModal === 'register'}
        onDismiss={() => setOpenModal('none')}
      >
        <button className="close-button" onClick={closeModal}>
          <span aria-hidden>×</span>
        </button>
        <h3>Register</h3>
        <LoginForm onSubmit={handleSubmit} buttonText="Register" />
      </Dialog>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
