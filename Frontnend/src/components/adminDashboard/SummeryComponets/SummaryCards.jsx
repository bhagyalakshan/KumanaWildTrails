import { useEffect } from "react";
import { Card } from "react-bootstrap";
import * as Tooltip from "@radix-ui/react-tooltip";
import { fetchAnimalHotspots, formatMonth } from "./utils";

const SummaryCards = ({ totalSightings, averageSightings, maxSightings, peakDay, hotspots, setHotspots, selectedAnimal, selectedMonth }) => {
  useEffect(() => {
    const loadHotspots = async () => {
      const hotspotData = await fetchAnimalHotspots();
      const mapped = {};

      // Normalize animal names to match selectedAnimal values
      hotspotData.forEach((item) => {
        let normalizedName;
        if (item.animalName.toLowerCase() === "elephant") {
          normalizedName = "elephant";
        } else if (item.animalName.toLowerCase() === "tiger") {
          normalizedName = "leopard"; // Map "tiger"/"Tiger" to "leopard"
        } else if (item.animalName.toLowerCase() === "sloth bear") {
          normalizedName = "bear"; // Map "Sloth Bear" to "bear"
        } else {
          return; // Skip unrecognized animals
        }

        // Use the most recent or highest sighting count if multiple entries exist
        if (!mapped[normalizedName] || item.sightingsCount > mapped[normalizedName].sightingsCount) {
          mapped[normalizedName] = {
            lat: item.lat,
            lng: item.lng,
            sightingsCount: item.sightingsCount,
            locationName: `Lat: ${item.lat.toFixed(4)}, Lng: ${item.lng.toFixed(4)}`,
          };
        }
      });

      setHotspots(mapped);
    };
    loadHotspots();
  }, [setHotspots]);

  return (
    <div className="row row-cols-2 row-cols-sm-4 g-3 mb-3">
      <Card className="shadow-sm">
        <Card.Header className="pb-2">
          <Card.Title as="h6" className="small fw-medium text-muted">
            Total Sightings
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="fs-4 fw-bold">{totalSightings}</div>
          <div className="small text-muted mt-1">
            {selectedAnimal.charAt(0).toUpperCase() + selectedAnimal.slice(1)} sightings
          </div>
        </Card.Body>
      </Card>
      <Card className="shadow-sm">
        <Card.Header className="pb-2">
          <Card.Title as="h6" className="small fw-medium text-muted">
            Daily Average
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="fs-4 fw-bold">{averageSightings}</div>
          <div className="small text-muted mt-1">
            {formatMonth(selectedMonth)}
          </div>
        </Card.Body>
      </Card>
      <Card className="shadow-sm">
        <Card.Header className="pb-2">
          <Card.Title as="h6" className="small fw-medium text-muted">
            Peak Day
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="fs-4 fw-bold">{maxSightings}</div>
          <div className="small text-muted mt-1">
            {peakDay ? formatMonth(peakDay.date) : "N/A"}
          </div>
        </Card.Body>
      </Card>
      <Card className="shadow-sm">
        <Card.Header className="pb-2">
          <Card.Title as="h6" className="small fw-medium text-muted">
            Current Hotspot
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <div className="d-flex align-items-center gap-2">
            <div className="fs-4 fw-bold text-truncate">
              {hotspots[selectedAnimal]?.locationName || "Unknown Area"}
            </div>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div className="text-muted hover-text-dark cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-20px w-20px"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10A8 8 0 112 10a8 8 0 0116 0zM9 8a1 1 0 112 0v4a1 1 0 01-2 0V8zm1-4a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="bg-light text-dark small p-2 rounded shadow"
                    side="top"
                    sideOffset={6}
                  >
                    This shows the highest sighted area within the last 30 days
                    <Tooltip.Arrow className="fill-dark" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
          {hotspots[selectedAnimal]?.lat && hotspots[selectedAnimal]?.lng ? (
            <div className="small text-muted mt-1 text-truncate">
              <a
                href={`https://www.google.com/maps?q=${hotspots[selectedAnimal].lat},${hotspots[selectedAnimal].lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-decoration-underline"
              >
                {hotspots[selectedAnimal].lat.toFixed(4)},{" "}
                {hotspots[selectedAnimal].lng.toFixed(4)}
              </a>
            </div>
          ) : (
            <div className="small text-muted mt-1">
              No location data
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SummaryCards;