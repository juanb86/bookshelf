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

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}