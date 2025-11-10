const CategoryGrid = ({ categories, onSelect }) => (
  <section className="category-grid">
    <h2>Featured Categories</h2>
    <div className="category-grid__items">
      {categories.map((category) => (
        <button
          key={category.name}
          className="category-card"
          onClick={() => onSelect(category)}
          type="button"
        >
          <span className="category-card__name">{category.name}</span>
          {category.description && <p>{category.description}</p>}
        </button>
      ))}
    </div>
  </section>
)

export default CategoryGrid
