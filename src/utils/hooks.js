import * as React from 'react'
import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

function useSafeDispatch(dispatch) {
  const mounted = React.useRef(false)
  React.useLayoutEffect(() => {
    mounted.current = true
    return () => (mounted.current = false)
  }, [])
  return React.useCallback(
    (...args) => (mounted.current ? dispatch(...args) : void 0),
    [dispatch],
  )
}

// Example usage:
// const {data, error, status, run} = useAsync()
// React.useEffect(() => {
//   run(fetchPokemon(pokemonName))
// }, [pokemonName, run])
const defaultInitialState = {status: 'idle', data: null, error: null}
function useAsync(initialState) {
  const initialStateRef = React.useRef({
    ...defaultInitialState,
    ...initialState,
  })
  const [{status, data, error}, setState] = React.useReducer(
    (s, a) => ({...s, ...a}),
    initialStateRef.current,
  )

  const safeSetState = useSafeDispatch(setState)

  const setData = React.useCallback(
    data => safeSetState({data, status: 'resolved'}),
    [safeSetState],
  )
  const setError = React.useCallback(
    error => safeSetState({error, status: 'rejected'}),
    [safeSetState],
  )
  const reset = React.useCallback(() => safeSetState(initialStateRef.current), [
    safeSetState,
  ])

  const run = React.useCallback(
    promise => {
      if (!promise || !promise.then) {
        throw new Error(
          `The argument passed to useAsync().run must be a promise. Maybe a function that's passed isn't returning anything?`,
        )
      }
      safeSetState({status: 'pending'})
      return promise.then(
        data => {
          setData(data)
          return data
        },
        error => {
          setError(error)
          return Promise.reject(error)
        },
      )
    },
    [safeSetState, setData, setError],
  )

  return {
    // using the same names that react-query uses for convenience
    isIdle: status === 'idle',
    isLoading: status === 'pending',
    isError: status === 'rejected',
    isSuccess: status === 'resolved',

    setData,
    setError,
    error,
    status,
    data,
    run,
    reset,
  }
}

function useListItems(token) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {
        token,
      }).then(data => data.listItems),
  })

  return {listItems}
}

function useListItem(token, bookId) {
  const {listItems} = useListItems(token)

  const listItem = listItems ? listItems.find(i => i.bookId === bookId) : null

  return {listItem}
}

function useUpdateListItem(token) {
  const [update] = useMutation(
    updates => {
      client(`list-items/${updates.id}`, {
        token: token,
        method: 'PUT',
        data: updates,
      })
    },
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )
  return {update}
}

function useRemoveListItem(token) {
  const [remove] = useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        token: token,
        method: 'DELETE',
      }),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )
  return {remove}
}

function useCreateListItem(token) {
  const [create] = useMutation(
    ({bookId}) =>
      client(`list-items`, {
        token: token,
        data: {bookId},
      }),
    {onSettled: () => queryCache.invalidateQueries('list-items')},
  )
  return {create}
}

function useBook(token, bookId) {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: token}),
  })
  return {data}
}

function useBookSearch(token, query) {
  const state = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: token,
      }).then(data => data.books),
  })
  return state
}

export {
  useAsync,
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
  useBook,
  useBookSearch,
}
