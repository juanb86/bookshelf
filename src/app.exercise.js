/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from 'utils/api-client'

function App() {
  const [user, setUser] = React.useState(null)

  const login = form => auth.login(form).then(u => setUser(u))
  const register = form => auth.register(form).then(u => setUser(u))

  const logout = form => auth.logout(form).then(u => setUser(null))

  // React.useEffect(() => {
  //   const token = await auth.getToken()
  //   if (token) {
  //     console.log('token found')
  //     client('me', {token}).then(data => {
  //       setUser(data.user)
  //     })
  //   } else {
  //     console.log('token not found')
  //   }
  // })

  return user ? (
    <AuthenticatedApp user={user} logout={logout} />
  ) : (
    <UnauthenticatedApp login={login} register={register} />
  )
}

export {App}

/*
eslint
  no-unused-vars: "off",
*/
