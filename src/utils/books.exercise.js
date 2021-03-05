import * as React from 'react'
import {useQuery, queryCache} from 'react-query'
import {useClient} from 'context/auth-context'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const loadingBook = {
  title: 'Loading...',
  author: 'loading...',
  coverImageUrl: bookPlaceholderSvg,
  publisher: 'Loading Publishing',
  synopsis: 'Loading...',
  loadingBook: true,
}

const loadingBooks = Array.from({length: 10}, (v, index) => ({
  id: `loading-book-${index}`,
  ...loadingBook,
}))

const getBookSearchConfig = (query, authenticatedClient) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    authenticatedClient(`books?query=${encodeURIComponent(query)}`).then(
      data => data.books,
    ),
  config: {
    onSuccess(books) {
      for (const book of books) {
        setQueryDataForBook(book)
      }
    },
  },
})

function useBookSearch(query) {
  const authenticatedClient = useClient()
  const result = useQuery(getBookSearchConfig(query, authenticatedClient))
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId) {
  const authenticatedClient = useClient()
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      authenticatedClient(`books/${bookId}`).then(data => data.book),
  })
  return data ?? loadingBook
}

function useRefetchBookSearchQuery() {
  const authenticatedClient = useClient()
  return React.useCallback(
    async function refetchBookSearchQuery() {
      queryCache.removeQueries('bookSearch')
      await queryCache.prefetchQuery(
        getBookSearchConfig('', authenticatedClient),
      )
    },
    [authenticatedClient],
  )
}

const bookQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book, bookQueryConfig)
}

export {useBook, useBookSearch, useRefetchBookSearchQuery, setQueryDataForBook}
