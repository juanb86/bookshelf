import {useQuery, useMutation, queryCache} from 'react-query'
import {client} from './api-client'
import {setQueryDataForBook} from './books'

function useListItems(token) {
  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {
        token,
      }).then(data => data.listItems),
    config: {
      onSuccess: data => data.forEach(data => setQueryDataForBook(data.book)),
    },
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

const optimisticUpdatesOptions = func => ({
  onMutate: param => {
    queryCache.cancelQueries('list-items')

    const previousListItems = queryCache.getQueryData('list-items')

    queryCache.setQueryData('list-items', listItems => func(listItems, param))

    return () => queryCache.setQueryData('list-items', previousListItems)
  },
  onError: rollback => rollback(),
})

function optimisticUpdateFunction(listItems, param) {
  return listItems.map(item =>
    item.id === param.id ? {...item, ...param} : item,
  )
}

function useUpdateListItem(token, options) {
  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
        token,
      }),
    {
      ...optimisticUpdatesOptions(optimisticUpdateFunction),
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function optimisticRemoveFunction(listItems, param) {
  return listItems.filter(item => item.id !== param.id)
}

function useRemoveListItem(token, options) {
  return useMutation(
    ({id}) =>
      client(`list-items/${id}`, {
        method: 'DELETE',
        token: token,
      }),
    {
      ...optimisticUpdatesOptions(optimisticRemoveFunction),
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function optimisticCreateFunction(listItems, param) {
  return [...listItems, {bookId: param.bookId}]
}

function useCreateListItem(token, options) {
  return useMutation(
    ({bookId}) =>
      client(`list-items`, {
        token: token,
        data: {bookId},
      }),
    {
      ...optimisticUpdatesOptions(optimisticCreateFunction),
      ...defaultMutationOptions,
      ...options,
    },
  )
}

export {
  useListItems,
  useListItem,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
