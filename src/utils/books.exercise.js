// 🐨 we're going to use React hooks in here now so we'll need React
import * as React from 'react'
import {useQuery, queryCache} from 'react-query'
import {useAuth, useClient} from 'context/auth-context'
import {client} from './api-client'
import bookPlaceholderSvg from 'assets/book-placeholder.svg'

const authenticatedClient = useClient()

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

const getBookSearchConfig = query => ({
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
  const result = useQuery(getBookSearchConfig(query))
  return {...result, books: result.data ?? loadingBooks}
}

function useBook(bookId) {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () =>
      authenticatedClient(`books/${bookId}`).then(data => data.book),
  })
  return data ?? loadingBook
}

function useRefetchBookSearchQuery() {
  return React.useCallback(async function refetchBookSearchQuery() {
    queryCache.removeQueries('bookSearch')
    await queryCache.prefetchQuery(getBookSearchConfig(''))
  }, [])
}

const bookQueryConfig = {
  staleTime: 1000 * 60 * 60,
  cacheTime: 1000 * 60 * 60,
}

function setQueryDataForBook(book) {
  queryCache.setQueryData(['book', {bookId: book.id}], book, bookQueryConfig)
}

export {useBook, useBookSearch, useRefetchBookSearchQuery, setQueryDataForBook}
