import {loadDevTools} from './dev-tools/load'
import './bootstrap'
import * as React from 'react'
import ReactDOM from 'react-dom'
import {ReactQueryConfigProvider} from 'react-query'
import {App} from './app'

const queryConfig = {
  queries: {
    retry(failureCount, error) {
      if (error.status === 404) return false
      if (failureCount < 2) return true
      return false
    },
    refetchOnWindowFocus: false,
    useErrorBoundary: true,
  },
}

loadDevTools(() => {
  ReactDOM.render(
    <ReactQueryConfigProvider config={queryConfig}>
      <App />
    </ReactQueryConfigProvider>,
    document.getElementById('root'),
  )
})
