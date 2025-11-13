import { useParams } from 'react-router-dom'

const CategoryPage = () => {
  const { category } = useParams()
  return (
    <div style={{padding:40}}>
      <h2>Category: {category}</h2>
      <p>Placeholder page — quizzes for the "{category}" category.</p>
    </div>
  )
}
export default CategoryPage
