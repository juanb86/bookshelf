import {useQuery} from 'react-query'
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

function useBookSearch(token, query) {
  const state = useQuery({
    queryKey: ['bookSearch', {query}],
    queryFn: () =>
      client(`books?query=${encodeURIComponent(query)}`, {
        token: token,
      }).then(data => data.books),
  })
  return {...state, books: state.data ?? loadingBooks}
}

function useBook(token, bookId) {
  const state = useQuery({
    queryKey: ['book', {bookId}],
    queryFn: () => client(`books/${bookId}`, {token: token}),
  })
  return {...state, book: state.data?.book ?? loadingBook}
}

export {useBook, useBookSearch}
