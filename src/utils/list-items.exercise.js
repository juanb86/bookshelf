import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from './api-client'

function useListItems(token) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {
        token,
      }).then(data => data.listItems),
  })

  return listItems ?? []
}

function useListItem(token, bookId) {
  const listItems = useListItems(token)
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem(token,options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token,
      }),
    {...defaultMutationOptions,...options},
  )
}

function useRemoveListItem(token, options) {
  return useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        method: 'DELETE',
        token: token,
      }),
    {...defaultMutationOptions, ...options},
  )
}

function useCreateListItem(token, options) {
  return useMutation(
    ({bookId}) =>
      client(`list-items`, {
        token: token,
        data: {bookId},
      }),
    {...defaultMutationOptions, ...options},
  )
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
