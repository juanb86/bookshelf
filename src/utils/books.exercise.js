import {useQuery, queryCache} from 'react-query'
import {client} from 'utils/api-client'
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

const setQueryDataForBook = index => {
  const bookId = index.id
  queryCache.setQueryData(['book', {bookId}], index)
}

const bookSearchQueryConfig = (token, query) => ({
  queryKey: ['bookSearch', {query}],
  queryFn: () =>
    client(`books?query=${encodeURIComponent(query)}`, {
      token: token,
    }).then(data => data.books),
  config: {
    onSuccess: data => data.forEach(data => setQueryDataForBook(data)),
  },
})

function useBookSearch(token, query) {
  const state = useQuery(bookSearchQueryConfig(token, query))
  return {...state, books: state.data ?? loadingBooks}
}

function prefetchBookSearchQuery(token) {
  queryCache.removeQueries('bookSearch')
  queryCache.prefetchQuery(bookSearchQueryConfig(token, ''))
}

function useBook(token, bookId) {
  const {data} = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token}).then(data => data.book),
  })
  return data ?? loadingBook
}

export {useBook, useBookSearch, prefetchBookSearchQuery, setQueryDataForBook}
