import React, { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card } from "react-bootstrap";
import axios from "axios";

const BACKEND_URL = "http://localhost:8080";

// Build 24-hour labels: "00", "01", ..., "23"
const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0")
);

const AnimalTimeActivityChart = ({ selectedAnimal }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchHourlySightings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching data for:', selectedAnimal);
        
        const res = await axios.get(
          `${BACKEND_URL}/api/sightings/time-distribution?animal=${encodeURIComponent(selectedAnimal)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log('📊 Raw API response:', res.data);

        let sightings = [];
        
        if (Array.isArray(res.data)) {
          sightings = res.data;
        } else {
          console.error('❌ Unexpected API response format:', res.data);
          setError("Unexpected data format from server");
          setHourlyData([]);
          return;
        }
        
        console.log('✅ Processed sightings:', sightings);
        console.log('📈 Sightings count:', sightings.length);

        // Check if we have the correct animal data
        if (sightings.length > 0) {
          console.log('🐾 First sighting animal:', sightings[0].animalName);
          console.log('🎯 Expected animal:', selectedAnimal);
          console.log('📅 First sighting date:', sightings[0].dateTime);
        }

        // Initialize all hours to 0
        const hourlyCount = HOURS.reduce((acc, hour) => {
          acc[hour] = 0;
          return acc;
        }, {});

        // Count sightings per hour with detailed logging
        let processedCount = 0;
        sightings.forEach((entry, index) => {
          try {
            if (entry && entry.dateTime) {
              const date = new Date(entry.dateTime);
              
              // Validate the date
              if (isNaN(date.getTime())) {
                console.error('❌ Invalid date:', entry.dateTime, 'at index:', index);
                return;
              }
              
              const hour = date.getHours().toString().padStart(2, "0");
              console.log(`⏰ Sighting ${index + 1}: ${entry.dateTime} -> Hour: ${hour}`);
              
              if (hourlyCount.hasOwnProperty(hour)) {
                hourlyCount[hour]++;
                processedCount++;
              }
            } else {
              console.error('❌ Invalid entry at index:', index, entry);
            }
          } catch (err) {
            console.error('❌ Error parsing date at index:', index, entry?.dateTime, err);
          }
        });

        console.log('🎯 Hourly count:', hourlyCount);
        console.log('✅ Successfully processed:', processedCount, 'out of', sightings.length, 'sightings');

        // Convert to chart-friendly data
        const chartData = HOURS.map((hour) => ({
          hour: `${hour}:00`,
          sightings: hourlyCount[hour],
        }));

        console.log('📊 Final chart data:', chartData);
        setHourlyData(chartData);
      } catch (err) {
        console.error("❌ Failed to fetch hourly sightings", err);
        setError("Failed to load data: " + (err.response?.data?.message || err.message));
        setHourlyData([]);
      } finally {
        setLoading(false);
      }
    };

    if (selectedAnimal) {
      fetchHourlySightings();
    } else {
      setHourlyData([]);
      setLoading(false);
    }
  }, [selectedAnimal, token]);

  const recommendationText = useMemo(() => {
    if (!hourlyData || hourlyData.length === 0) return "";

    const totalSightings = hourlyData.reduce((sum, entry) => sum + entry.sightings, 0);
    
    if (totalSightings === 0) {
      return `No sightings recorded for ${selectedAnimal} in the last 30 days.`;
    }

    const peak = [...hourlyData].sort((a, b) => b.sightings - a.sightings)[0];
    
    if (!peak || peak.sightings === 0) {
      return `No significant sightings for ${selectedAnimal} during park hours.`;
    }

    return `According to data from the last 30 days, ${selectedAnimal}s are most likely to be spotted around ${peak.hour}. Adjust your visit accordingly for the best chance of seeing them.`;
  }, [hourlyData, selectedAnimal]);

  // Debug information
  const totalSightings = hourlyData.reduce((sum, entry) => sum + entry.sightings, 0);

  return (
    <Card className="mt-3 shadow-sm">
      <Card.Header>
        <Card.Title as="h6" className="mb-0 small fw-semibold">
          Time-of-Day Activity for {selectedAnimal}
        </Card.Title>
      </Card.Header>
      <Card.Body className="pt-0">
        {loading ? (
          <div className="small text-muted">Loading chart...</div>
        ) : error ? (
          <div className="small text-danger">Error: {error}</div>
        ) : (
          <>
            {/* Debug info - remove in production */}
            <div className="small text-muted mb-2">
              Debug: {totalSightings} total sightings processed
            </div>
            
            {totalSightings > 0 ? (
              <>
                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="hour" 
                        interval={2}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                        fontSize={12}
                      />
                      <YAxis allowDecimals={false} domain={[0, "dataMax + 1"]} />
                      <Tooltip />
                      <Bar
                        dataKey="sightings"
                        fill="#347358"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {recommendationText && (
                  <div className="mt-3 p-3 border border-primary rounded bg-white shadow-sm small fw-semibold">
                    {recommendationText}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center p-4 text-muted">
                No sightings data available for {selectedAnimal}
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default AnimalTimeActivityChart;