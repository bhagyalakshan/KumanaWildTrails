
const Recommendations = ({ peakDay, selectedAnimal }) => {
  return (
    <div className="mt-3">
      <h3 className="small fw-medium text-muted mb-2">
        Management Recommendations
      </h3>
      <div className="border border-primary-subtle rounded p-3 bg-primary bg-opacity-10">
        <ul className="list-group list-group-flush">
          <li className="list-group-item small border-0 px-0">
            <strong>Best viewing times:</strong> Early morning (6-8am)
            and late afternoon (4-6pm) based on historical patterns
          </li>
          <li className="list-group-item small border-0 px-0">
            <strong>Current hotspot:</strong>{" "}
            {peakDay?.locations[selectedAnimal].name || "Northern sector"}{" "}
            - consider increasing ranger patrols in this area
          </li>
          <li className="list-group-item small border-0 px-0">
            <strong>Visitor experience:</strong> Highlight{" "}
            {selectedAnimal} sightings in today's visitor briefing
          </li>
          <li className="list-group-item small border-0 px-0">
            <strong>Conservation note:</strong>{" "}
            {selectedAnimal === "leopard" || selectedAnimal === "bear"
              ? "Monitor human-wildlife conflict potential"
              : "Normal activity patterns observed"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Recommendations;
