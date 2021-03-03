import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from 'utils/api-client'

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
  return listItems ? listItems.find(i => i.bookId === bookId) : null
}

const defaultMutationOptions = {
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem(token) {
  return useMutation(updates => {
    client(`list-items/${updates.id}`, {
      token: token,
      method: 'PUT',
      data: updates,
    })
  }, defaultMutationOptions)
}

function useRemoveListItem(token) {
  return useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        token: token,
        method: 'DELETE',
      }),
    defaultMutationOptions,
  )
}

function useCreateListItem(token) {
  return useMutation(
    ({bookId}) =>
      client(`list-items`, {
        token: token,
        data: {bookId},
      }),
    defaultMutationOptions,
  )
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
