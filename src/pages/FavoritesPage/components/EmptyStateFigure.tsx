export function EmptyStateFigure() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      <polygon
        points="100,10 120,80 190,80 135,120 150,190 100,145 50,190 65,120 10,80 80,80"
        fill="#CCCCCC"
      />
      <text x="50%" y="50%" textAnchor="middle" fill="#666666" fontSize="24">
        No Favorites
      </text>
    </svg>
  );
}
