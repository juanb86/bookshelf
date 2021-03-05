import {useQuery, useMutation, queryCache} from 'react-query'
import {useClient} from 'context/auth-context'
import {setQueryDataForBook} from './books'

function useListItems() {
  const authenticatedClient = useClient()
  const {data} = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      authenticatedClient(`list-items`).then(data => data.listItems),
    config: {
      onSuccess: async listItems => {
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
    },
  })
  return data ?? []
}

function useListItem(bookId) {
  const listItems = useListItems()
  return listItems.find(li => li.bookId === bookId) ?? null
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.invalidateQueries('list-items'),
}

function useUpdateListItem(options) {
  const authenticatedClient = useClient()
  return useMutation(
    updates =>
      authenticatedClient(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })

        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useRemoveListItem(options) {
  const authenticatedClient = useClient()
  return useMutation(
    ({id}) =>
      authenticatedClient(`list-items/${id}`, {
        method: 'DELETE',
      }),
    {
      onMutate(removedItem) {
        const previousItems = queryCache.getQueryData('list-items')

        queryCache.setQueryData('list-items', old => {
          return old.filter(item => item.id !== removedItem.id)
        })

        return () => queryCache.setQueryData('list-items', previousItems)
      },
      ...defaultMutationOptions,
      ...options,
    },
  )
}

function useCreateListItem(options) {
  const authenticatedClient = useClient()
  return useMutation(
    ({bookId}) => authenticatedClient(`list-items`, {data: {bookId}}),
    {...defaultMutationOptions, ...options},
  )
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
