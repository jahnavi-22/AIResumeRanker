import star from "../assets/star.png";

const Stars = () => {
  const rows = 6;
  const cols = 7;
  const stars = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const left = `${col * (100 / cols) + Math.random() * (100 / cols)}%`;
      const top = `${row * (100 / rows) + Math.random() * (100 / rows)}%`;
      const delay = `${Math.random() * 2}s`;
      const size = Math.random() > 0.5 ? 16 : 8;

      stars.push(
        <img
          key={`${row}-${col}`}
          src={star}
          alt="star"
          className="star"
          style={{
            left,
            top,
            animationDelay: delay,
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      );
    }
  }

  return <>{stars}</>;
};

export default Stars;
