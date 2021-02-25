/** @jsx jsx */
import {jsx} from '@emotion/core'

import * as React from 'react'
import * as auth from 'auth-provider'
import {AuthenticatedApp} from './authenticated-app'
import {UnauthenticatedApp} from './unauthenticated-app'
import {client} from 'utils/api-client'
import {FullPageSpinner} from 'components/lib'
import {useAsync} from 'utils/hooks'
import * as colors from 'styles/colors'

async function getUser() {
  let user = null
  const token = await auth.getToken()
  if (token) {
    client('me', {token}).then(data => {
      user = data.user
    })
  }
  return user
}

function App() {
  // const [user, setUser] = React.useState(null)
  const {
    data: user,
    error,
    isIdle,
    isLoading,
    isSuccess,
    isError,
    run,
    setData: setUser,
  } = useAsync()

  React.useEffect(() => {
    run(getUser().then(u => setUser({u})))
  }, [run, setUser])

  const login = form => run(auth.login(form).then(u => setUser(u)))
  const register = form => run(auth.register(form).then(u => setUser(u)))

  const logout = form => run(auth.logout(form).then(u => setUser(null)))

  if (isLoading || isIdle) return <FullPageSpinner />

  if (isError)
    return (
      <div
        css={{
          color: colors.danger,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <p>Uh oh... There's a problem. Try refreshing the app.</p>
        <pre>{error.message}</pre>
      </div>
    )

  if (isSuccess)
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
