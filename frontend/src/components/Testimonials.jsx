const Testimonials = ({ testimonials }) => (
  <section className="testimonials">
    <h2>Player Buzz</h2>
    <div className="testimonials__list">
      {testimonials.map((item) => (
        <article key={item.name} className="testimonial-card">
          <p>&quot;{item.quote}&quot;</p>
          <span>- {item.name}</span>
        </article>
      ))}
    </div>
  </section>
)

export default Testimonials
