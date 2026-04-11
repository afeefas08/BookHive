import { useQuery } from "@tanstack/react-query" 
import api from '../services/api';
import BookCard from '../components/BookCard';

const fetchBooks = async () => {
    const response = await api.get('/books')
    console.log(response.data)
    return response.data;
}

export default function Books() {
    const { data: books, isLoading, error } = useQuery({
        queryKey: ["books"], // unique
        queryFn: fetchBooks,
    })

    if (isLoading) 
        return <p className="p-6">Loading books...</p>
    if (error)
        return <p className="p-6 text-red-500">Error loading books</p>

  return (
    <div>{books.map((book)=>(
        <BookCard key={book.id} book={book} />
    ))}
    </div>
  )
}
