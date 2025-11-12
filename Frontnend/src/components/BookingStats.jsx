import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import { isMobile } from "react-device-detect";

// Bright colors suited for dark background
const STATUS_COLORS = {
  assigned: "#a9f3bcff", // green
  rejected: "#f47d7dff", // light red
  new: "#b7f3fdff",  // amber
  checked: "#f6fa0aff", // gray
};

const PACKAGE_COLORS = [
  "#64b5f6", // light blue
  "#81c784", // light green
  "#ffb74d", // amber
  "#e57373", // light red
  "#ba68c8", // purple
  "#4dd0e1", // cyan
  "#f06292", // pink
  "#4db6ac", // teal
];

const DATE_COLORS = [
  "#a1defdff",
  "#fbb68bff",
  "#dce5e4ff",
  "#c1f083ff",
  "#f5ec83ff",
  "#f9ffcaff",
];

const DRIVER_COLORS = [
  "#c2ccc5ff",
  "#73d2e5ff",
  "#baedd9ff",
  "#f7cdcaff",
  "#fdd3d3ff",
  "#f6c3beff",
];

// Utility for last N dates (unchanged)
function getLastNDates(n) {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

// Linear regression prediction (unchanged)
function predictNextWeek(data) {
  const n = data.length;
  if (n === 0) return [];
  let sumX = 0,
    sumY = 0,
    sumXY = 0,
    sumXX = 0;

  data.forEach((point, i) => {
    const x = i;
    const y = point.bookingCount;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumXX += x * x;
  });

  const a = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX || 1);
  const b = (sumY - a * sumX) / n;

  const predictions = [];
  for (let i = n; i < n + 7; i++) {
    predictions.push({
      date: new Date(Date.now() + (i - n + 1) * 86400000)
        .toISOString()
        .slice(0, 10),
      bookingCount: Math.max(0, Math.round(a * i + b)),
    });
  }
  return predictions;
}

export default function BookingStatsDashboard() {
  const [statusData, setStatusData] = useState([]);
  const [packageData, setPackageData] = useState([]);
  const [last7DaysData, setLast7DaysData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [dateClassificationData, setDateClassificationData] = useState([]);
  const [driverClassificationData, setDriverClassificationData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://localhost:8080/api/bookings");
      const bookings = await res.json();

      const statusMap = {};
      const packageMap = {};
      const dailyMap = {};
      const dateMap = {};
      const driverMap = {};

      const last7Dates = getLastNDates(7);

      bookings.forEach((b) => {
        // Status
        statusMap[b.status] = (statusMap[b.status] || 0) + 1;
        // Package
        packageMap[b.safariPackageName] =
          (packageMap[b.safariPackageName] || 0) + 1;
        // Last 7 days
        if (last7Dates.includes(b.safariDate)) {
          dailyMap[b.safariDate] = (dailyMap[b.safariDate] || 0) + 1;
        }
        // Date classification
        if (b.safariDate) {
          dateMap[b.safariDate] = (dateMap[b.safariDate] || 0) + 1;
        }
        // Driver classification
        if (b.assignedDriver) {
          driverMap[b.assignedDriver] = (driverMap[b.assignedDriver] || 0) + 1;
        }
      });

      setStatusData(
        Object.entries(statusMap).map(([status, count]) => ({
          status,
          bookingCount: count,
        }))
      );

      setPackageData(
        Object.entries(packageMap).map(([name, count]) => ({
          packageName: name,
          bookingCount: count,
        }))
      );

      setLast7DaysData(
        last7Dates.map((date) => ({
          date,
          bookingCount: dailyMap[date] || 0,
        }))
      );

      setPredictedData(predictNextWeek(last7Dates.map((date) => ({
        date,
        bookingCount: dailyMap[date] || 0,
      }))));

      setDateClassificationData(
        Object.entries(dateMap)
          .map(([date, count]) => ({ safariDate: date, count }))
          .sort((a, b) => new Date(a.safariDate) - new Date(b.safariDate))
      );

      setDriverClassificationData(
        Object.entries(driverMap).map(([driver, count]) => ({
          assignedDriver: driver,
          count,
        }))
      );
    }

    fetchData();
  }, []);

  // Responsive header font size
  const headerFontSize = isMobile ? "1.25rem" : "1.75rem";

  // Responsive column class: full width on mobile, half on tablet/desktop
  const colClass = isMobile ? "col-12" : "col-12 col-md-6 col-lg-6";

  return (
    <div
      className="container-fluid py-4"
      style={{ backgroundColor: "#121212", minHeight: "100vh", color: "#eee" }}
    >
      <h2 className="text-center mb-5" style={{ fontSize: headerFontSize }}>
        Safari Booking Stats Dashboard
      </h2>

      <div className="row g-4">
        {/* Status Pie Chart */}
        <div className={colClass}>
          <div
            className="card shadow-sm h-100"
            style={{ backgroundColor: "#1e1e1e", color: "#eee" }}
          >
            <div className="card-body">
              <h5 style={{ fontSize: headerFontSize }} className="card-title">
                Status Distribution
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    dataKey="bookingCount"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => entry.status}
                    labelStyle={{ fill: "#eee" }}
                  >
                    {statusData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.status] || "#93f9f2ff"}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderRadius: 8 }}
                    itemStyle={{ color: "#eee" }}
                  />
                  <Legend
                    wrapperStyle={{ color: "#eee" }}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Package Bar Chart */}
        <div className={colClass}>
          <div
            className="card shadow-sm h-100"
            style={{ backgroundColor: "#1e1e1e", color: "#eee" }}
          >
            <div className="card-body">
              <h5 style={{ fontSize: headerFontSize }} className="card-title">
                Bookings by Safari Package
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={packageData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="packageName"
                    stroke="#eee"
                    tick={{ fill: "#eee" }}
                  />
                  <YAxis stroke="#eee" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderRadius: 8 }}
                    itemStyle={{ color: "#eee" }}
                  />
                  <Bar dataKey="bookingCount">
                    {packageData.map((_, index) => (
                      <Cell
                        key={`bar-package-${index}`}
                        fill={PACKAGE_COLORS[index % PACKAGE_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Last 7 Days Line Chart */}
        <div className={colClass}>
          <div
            className="card shadow-sm h-100"
            style={{ backgroundColor: "#1e1e1e", color: "#eee" }}
          >
            <div className="card-body">
              <h5 style={{ fontSize: headerFontSize }} className="card-title">
                Last 7 Days Bookings
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={last7DaysData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    stroke="#eee"
                    tick={{ fill: "#eee" }}
                  />
                  <YAxis stroke="#eee" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderRadius: 8 }}
                    itemStyle={{ color: "#eee" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookingCount"
                    stroke="#4caf50"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Prediction Line Chart */}
        <div className={colClass}>
          <div
            className="card shadow-sm h-100"
            style={{ backgroundColor: "#1e1e1e", color: "#eee" }}
          >
            <div className="card-body">
              <h5 style={{ fontSize: headerFontSize }} className="card-title">
                Predicted Bookings (Next 7 Days)
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={predictedData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    stroke="#eee"
                    tick={{ fill: "#eee" }}
                  />
                  <YAxis stroke="#eee" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderRadius: 8 }}
                    itemStyle={{ color: "#eee" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="bookingCount"
                    stroke="#ffb300"
                    strokeWidth={3}
                    strokeDasharray="5 5"
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Safari Date Classification Bar Chart (Next 7 Days Only) */}
<div className={colClass}>
  <div
    className="card shadow-sm h-100"
    style={{ backgroundColor: "#1e1e1e", color: "#eee" }}
  >
    <div className="card-body">
      <h5 style={{ fontSize: headerFontSize }} className="card-title">
        Bookings by Safari Date (Next 7 Days)
      </h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={
            dateClassificationData
              .filter((entry) => {
                const today = new Date();
                const safariDate = new Date(entry.safariDate);
                const next7 = new Date();
                next7.setDate(today.getDate() + 6); // today + 6 = 7 days total
                return safariDate >= today && safariDate <= next7;
              })
              .sort((a, b) => new Date(a.safariDate) - new Date(b.safariDate))
          }
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          barCategoryGap="20%"
        >
          <CartesianGrid stroke="#333" strokeDasharray="3 3" />
          <XAxis
            dataKey="safariDate"
            stroke="#eee"
            tick={{ fill: "#eee" }}
          />
          <YAxis stroke="#eee" />
          <Tooltip
            contentStyle={{ backgroundColor: "#222", borderRadius: 8 }}
            itemStyle={{ color: "#eee" }}
          />
          <Bar dataKey="count">
            {dateClassificationData
              .filter((entry) => {
                const today = new Date();
                const safariDate = new Date(entry.safariDate);
                const next7 = new Date();
                next7.setDate(today.getDate() + 6);
                return safariDate >= today && safariDate <= next7;
              })
              .map((_, index) => (
                <Cell
                  key={`bar-date-${index}`}
                  fill={DATE_COLORS[index % DATE_COLORS.length]}
                />
              ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>


        {/* Assigned Driver Classification Bar Chart */}
        <div className={colClass}>
          <div
            className="card shadow-sm h-100"
            style={{ backgroundColor: "#1e1e1e", color: "#eee" }}
          >
            <div className="card-body">
              <h5 style={{ fontSize: headerFontSize }} className="card-title">
                Bookings by Assigned Driver
              </h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={driverClassificationData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                  <XAxis
                    dataKey="assignedDriver"
                    stroke="#eee"
                    tick={{ fill: "#eee" }}
                  />
                  <YAxis stroke="#eee" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#222", borderRadius: 8 }}
                    itemStyle={{ color: "#eee" }}
                  />
                  <Bar dataKey="count">
                    {driverClassificationData.map((_, index) => (
                      <Cell
                        key={`bar-driver-${index}`}
                        fill={DRIVER_COLORS[index % DRIVER_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
