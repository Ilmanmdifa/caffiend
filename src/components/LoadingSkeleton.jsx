// Mirrors the Stats + History layout with pulsing blocks
// so the page doesn't jump when real data arrives.
function SkeletonCard(props) {
  const { lg, lines } = props;
  return (
    <div
      className={"card stat-card " + (lg ? " col-span-2" : "")}
      aria-hidden="true"
    >
      <div className="skeleton" style={{ height: "1.25rem", width: "40%" }} />
      {Array.from({ length: lines || 2 }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: "1rem", marginTop: "0.5rem" }}
        />
      ))}
    </div>
  );
}

export default function LoadingSkeleton() {
  return (
    <div role="status" aria-label="Loading your data">
      <div className="section-header">
        <h2>Stats</h2>
      </div>
      <div className="stats-grid">
        <SkeletonCard lg lines={3} />
        <SkeletonCard lines={1} />
        <SkeletonCard lines={1} />
        <SkeletonCard lines={1} />
        <SkeletonCard lines={1} />
      </div>
      <div className="section-header">
        <h2>History</h2>
      </div>
      <div className="coffee-history">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            aria-hidden="true"
            style={{ width: "2.5rem", height: "2.5rem", borderRadius: "50%" }}
          />
        ))}
      </div>
    </div>
  );
}
