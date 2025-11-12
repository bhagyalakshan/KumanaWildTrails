
import { getAnimalIcon } from "./utils";

const SpeciesSelection = ({ selectedAnimal, setSelectedAnimal, filteredData }) => {
  return (
    <div className="mb-3">
      <h3 className="small fw-medium text-muted mb-2">All Species</h3>
      <div className="card border rounded p-3 bg-white shadow-sm">
        <div className="row row-cols-2 row-cols-sm-3 g-2">
          {["elephant", "leopard", "bear"].map((animal) => {
            const total = filteredData.reduce(
              (sum, day) => sum + day.animals[animal],
              0
            );
            return (
              <div
                key={animal}
                className={`d-flex align-items-center justify-content-between p-2 rounded ${
                  animal === selectedAnimal
                    ? "bg-primary bg-opacity-10 border border-primary-subtle shadow-sm"
                    : "border border-transparent hover-bg-light"
                }`}
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedAnimal(animal)}
              >
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-4">{getAnimalIcon(animal)}</span>
                  <div>
                    <div className="text-capitalize fw-medium">{animal}</div>
                    <div className="small text-muted">
                      {total} total sightings
                    </div>
                  </div>
                </div>
                {animal === selectedAnimal && (
                  <div
                    className="rounded-circle bg-primary"
                    style={{ width: "8px", height: "8px" }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SpeciesSelection;
