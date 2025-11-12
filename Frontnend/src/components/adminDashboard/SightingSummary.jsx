import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { Card } from "../../components/ui/adminDashboard-ui/card";
import { Button } from "react-bootstrap";
import { RefreshCwIcon } from "lucide-react";
// import { Calendar } from "../../components/ui/adminDashboard-ui/Calendar";
import CustomCalendar  from "./SummeryComponets/CustomCalendar";
import SpeciesSelection from "./SummeryComponets/SpeciesSelection";
import SummaryCards from "./SummeryComponets/SummaryCards";
import DataTable from "./SummeryComponets/DataTable";
import Recommendations from "./SummeryComponets/Recommendations";
import { formatDate } from "./SummeryComponets/utils";
import AnimalTimeActivityChart from "./SummeryComponets/AnimalTimeActivityChart";

const token = localStorage.getItem("token");
const BACKEND_URL = "http://localhost:8080";

const SightingSummary = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedAnimal, setSelectedAnimal] = useState("leopard");
  const [sightingsData, setSightingsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hotspots, setHotspots] = useState({});
  const [viewMode, setViewMode] = useState("month");
  const [daysWithData, setDaysWithData] = useState([]);

  // Data fetching function
  const fetchData = useCallback(
    async (url, setData) => {
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = Array.isArray(response.data) ? response.data : [];
        setData(data);
        return data;
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data. Please try again.");
        setData([]);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  // Fetch last 30 days data
  useEffect(() => {
    fetchData(
      `${BACKEND_URL}/api/sightings/last-30-days`,
      setSightingsData
    ).then((data) => {
      if (data.length > 0) {
        const latestDate = new Date(data[data.length - 1].date);
        setSelectedDate(latestDate);
        setSelectedMonth(
          new Date(latestDate.getFullYear(), latestDate.getMonth(), 1)
        );
      }
    });
  }, [fetchData]);

  // Fetch month data
  useEffect(() => {
    fetchData(
      `${BACKEND_URL}/api/sightings/month?year=${selectedMonth.getFullYear()}&month=${
        selectedMonth.getMonth() + 1
      }`,
      setSightingsData
    );
  }, [selectedMonth, fetchData]);

  // Data normalization
  const normalizedData = useMemo(() => {
    return sightingsData
      .filter(
        (entry) => entry && entry.date && entry.animals && entry.locations
      )
      .map((entry) => ({
        date: new Date(entry.date),
        animals: {
          elephant: entry.animals?.elephant || 0,
          leopard: entry.animals?.leopard || entry.animals?.tiger || 0,
          bear: entry.animals?.bear || entry.animals?.["sloth bear"] || 0,
        },
        locations: {
          elephant: entry.locations?.elephant || {
            lat: null,
            lon: null,
            name: "No sightings",
          },
          leopard: entry.locations?.leopard ||
            entry.locations?.tiger || {
              lat: null,
              lon: null,
              name: "No sightings",
            },
          bear: entry.locations?.bear ||
            entry.locations?.["sloth bear"] || {
              lat: null,
              lon: null,
              name: "No sightings",
            },
        },
      }));
  }, [sightingsData]);

  // Track days with data
  useEffect(() => {
    if (normalizedData.length > 0) {
      const days = normalizedData.map(
        (entry) =>
          new Date(
            entry.date.getFullYear(),
            entry.date.getMonth(),
            entry.date.getDate()
          )
      );
      setDaysWithData(days);
    }
  }, [normalizedData]);

  // Date and month handlers
  const handleDateSelect = useCallback(
    (date) => {
      if (!date) return;

      const hasData = daysWithData.some(
        (day) =>
          day.getDate() === date.getDate() &&
          day.getMonth() === date.getMonth() &&
          day.getFullYear() === date.getFullYear()
      );

      if (hasData) {
        setSelectedDate(date);
        setViewMode("day");
      }
    },
    [daysWithData]
  );

  const handleMonthSelect = useCallback((month) => {
    setSelectedMonth(month);
    setViewMode("month");
  }, []);

  // Data filtering
  const filteredData = useMemo(() => {
    return viewMode === "month"
      ? normalizedData.filter(
          (entry) =>
            entry.date.getFullYear() === selectedMonth.getFullYear() &&
            entry.date.getMonth() === selectedMonth.getMonth()
        )
      : normalizedData.filter(
          (entry) => entry.date.toDateString() === selectedDate.toDateString()
        );
  }, [normalizedData, viewMode, selectedMonth, selectedDate]);

  // Calculations
  const { totalSightings, averageSightings, maxSightings, peakDay } =
    useMemo(() => {
      const total = filteredData.reduce(
        (sum, day) => sum + day.animals[selectedAnimal],
        0
      );
      const avg = filteredData.length
        ? (total / filteredData.length).toFixed(1)
        : 0;
      const max = filteredData.length
        ? Math.max(...filteredData.map((day) => day.animals[selectedAnimal]))
        : 0;
      const peak = filteredData.find(
        (day) => day.animals[selectedAnimal] === max
      );

      return {
        totalSightings: total,
        averageSightings: avg,
        maxSightings: max,
        peakDay: peak,
      };
    }, [filteredData, selectedAnimal]);

  // Available months calculation
  const availableMonths = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 11,
      1
    );
    const months = [];
    for (
      let date = new Date(currentMonth);
      date >= startDate;
      date.setMonth(date.getMonth() - 1)
    ) {
      months.push(new Date(date));
    }
    return months.sort((a, b) => b - a);
  }, []);

  // Refresh handler
  const handleRefresh = useCallback(() => {
    fetchData(
      viewMode === "month"
        ? `${BACKEND_URL}/api/sightings/month?year=${selectedMonth.getFullYear()}&month=${
            selectedMonth.getMonth() + 1
          }`
        : `${BACKEND_URL}/api/sightings/last-30-days`,
      setSightingsData
    );
  }, [fetchData, viewMode, selectedMonth]);

  // Loading and error states
  if (loading) {
    return (
      <Card className="card">
        <div className="card-body text-center">
          <div className="text-muted">Loading data...</div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card">
        <div className="card-body text-center">
          <div className="text-danger">{error}</div>
          <Button
            variant="outline-primary"
            size="sm"
            className="mt-3"
            onClick={handleRefresh}
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  if (!loading && !error && normalizedData.length === 0) {
    return (
      <Card className="card">
        <div className="card-body text-center">
          <div className="text-muted">No sighting data available.</div>
          <Button
            variant="outline-primary"
            size="sm"
            className="mt-3"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="card">
      <div className="card-header">
        <h5 className="card-title d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
          <span>Wildlife Sighting Dashboard</span>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={handleRefresh}
          >
            <RefreshCwIcon className="me-1" size={14} />
            Refresh Data
          </Button>
        </h5>
        <small className="text-muted">
          Comprehensive wildlife tracking with location mapping and trend
          analysis
          <b>
            {" "}
            (
            {viewMode === "month"
              ? "Monthly View"
              : `Daily View - ${formatDate(selectedDate)}`}
            )
          </b>
        </small>
      </div>
      <div className="card-body">
        <SpeciesSelection
          selectedAnimal={selectedAnimal}
          setSelectedAnimal={setSelectedAnimal}
          filteredData={filteredData}
        />

        <SummaryCards
          totalSightings={totalSightings}
          averageSightings={averageSightings}
          maxSightings={maxSightings}
          peakDay={peakDay}
          hotspots={hotspots}
          setHotspots={setHotspots}
          selectedAnimal={selectedAnimal}
          selectedMonth={selectedMonth}
          viewMode={viewMode}
          selectedDate={selectedDate}
        />

        <div className="row">
          <div className="col-md-4 mb-3">
            <Card className="card">
              <div className="card-body">
                <CustomCalendar
                  selected={viewMode === "day" ? selectedDate : undefined}
                  onSelect={handleDateSelect}
                  daysWithData={daysWithData}
                  mode="single"
                  defaultMonth={selectedMonth}
                  onMonthChange={handleMonthSelect}
                  className="rounded"
                />
                {viewMode === "day" && (
                  <Button
                    variant="outline-primary"
                    className="w-100 mt-3"
                    onClick={() => setViewMode("month")}
                  >
                    Show Full Month
                  </Button>
                )}
              </div>
            </Card>
          </div>

          <div className="col-md-8">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="d-flex align-items-center gap-2">
                <h6 className="text-muted mb-0">
                  {selectedAnimal.charAt(0).toUpperCase() +
                    selectedAnimal.slice(1)}{" "}
                  Analysis
                </h6>
              </div>
              <select
                className="form-select form-select-sm"
                value={selectedAnimal}
                onChange={(e) => setSelectedAnimal(e.target.value)}
              >
                {["elephant", "leopard", "bear"].map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <DataTable
              filteredData={filteredData}
              totalSightings={totalSightings}
              selectedAnimal={selectedAnimal}
              viewMode={viewMode}
            />
            {/* <Recommendations
              peakDay={peakDay}
              selectedAnimal={selectedAnimal}
              viewMode={viewMode}
              selectedDate={selectedDate}
            /> */}

            <AnimalTimeActivityChart selectedAnimal={selectedAnimal} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SightingSummary;