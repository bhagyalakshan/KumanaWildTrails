
import { Button } from "@/components/ui/adminDashboard-ui/Button";
import { MapPinIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/adminDashboard-ui/Popover";
import  MapPopup  from "./MapPopup";
import { formatDate } from "./utils";

const DataTable = ({ filteredData, totalSightings, selectedAnimal, viewMode }) => {
  const renderTableRows = () => {
    if (viewMode === 'month') {
      return filteredData.map((entry, index) => (
        <TableRow 
          key={`month-${index}`}
          entry={entry}
          index={index}
          selectedAnimal={selectedAnimal}
          totalSightings={totalSightings}
        />
      ));
    } else {
      const dayData = filteredData[0];
      if (!dayData) return null;
      
      const sightings = Array(dayData.animals[selectedAnimal]).fill({
        ...dayData,
        id: Math.random().toString(36).substr(2, 9)
      });
      
      return sightings.map((sighting, index) => (
        <TableRow 
          key={`day-${index}-${sighting.id}`}
          entry={sighting}
          index={index}
          selectedAnimal={selectedAnimal}
          totalSightings={totalSightings}
          isDailyView={true}
          sightingNumber={index + 1}
        />
      ));
    }
  };

  return (
    <div className="table-responsive border rounded shadow-sm">
      <table className="table table-sm table-bordered">
        <thead className="table-light">
          <tr>
            {viewMode === 'day' && <th scope="col" className="p-3">#</th>}
            <th scope="col" className="p-3">Date</th>
            <th scope="col" className="p-3">Sightings</th>
            <th scope="col" className="p-3">% of Total</th>
            <th scope="col" className="p-3">Location</th>
          </tr>
        </thead>
        <tbody>
          {renderTableRows()}
        </tbody>
      </table>
    </div>
  );
};

const TableRow = ({ entry, index, selectedAnimal, totalSightings, isDailyView = false, sightingNumber = null }) => {
  const percentOfTotal = totalSightings
    ? ((isDailyView ? 1 : entry.animals[selectedAnimal]) / totalSightings * 100).toFixed(isDailyView ? 2 : 1)
    : 0;
  const location = entry.locations[selectedAnimal];

  return (
    <tr className={`border-top ${index % 2 === 0 ? "" : "table-light"}`}>
      {isDailyView && (
        <td className="p-3">{sightingNumber}</td>
      )}
      <td className="p-3">{formatDate(entry.date)}</td>
      <td className="p-3 fw-medium">{isDailyView ? 1 : entry.animals[selectedAnimal]}</td>
      <td className="p-3">{percentOfTotal}%</td>
      <td className="p-3">
        {location.lat ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="link"
                size="sm"
                className="text-primary bg-primary bg-opacity-10"
              >
                <MapPinIcon className="me-1" size={14} />
                {location.name}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-90vw w-sm-400px p-0">
              <MapPopup
                location={location}
                animalType={selectedAnimal}
                date={entry.date}
                sightingNumber={isDailyView ? sightingNumber : null}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <span className="text-muted">No {selectedAnimal} spotted</span>
        )}
      </td>
    </tr>
  );
};

export default DataTable;
