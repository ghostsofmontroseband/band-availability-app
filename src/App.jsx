import { useState, useRef } from "react";

const daysInMay = 31;
const startDay = 3;
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function generateCalendar() {
  const calendar = [];
  let week = Array(startDay).fill(null);
  for (let day = 1; day <= daysInMay; day++) {
    week.push(`May ${day}`);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    calendar.push(week);
  }
  return calendar;
}

export default function AvailabilityGrid() {
  const [members, setMembers] = useState(["Your Name"]);
  const [availability, setAvailability] = useState({});
  const inputRef = useRef(null);

  const toggleCell = (member, date) => {
    const key = `${member}-${date}`;
    setAvailability(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const addMember = (name) => {
    if (name && !members.includes(name)) {
      setMembers([...members, name]);
    }
  };

  const calculateBestDates = () => {
    const counts = {};
    for (const member of members) {
      for (let day = 1; day <= daysInMay; day++) {
        const date = `May ${day}`;
        const key = `${member}-${date}`;
        if (availability[key]) {
          counts[date] = (counts[date] || 0) + 1;
        }
      }
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, 5);
  };

  const getAvailableMembers = (date) => {
    return members.filter(member => availability[`${member}-${date}`]);
  };

  const calendar = generateCalendar();
  const bestDates = calculateBestDates();

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Band Availability Scheduler — May 2025</h1>
      <div className="mb-4 flex gap-2">
        <input ref={inputRef} placeholder="Add member name..." className="border rounded px-2 py-1" />
        <button
          onClick={() => {
            if (inputRef.current) {
              addMember(inputRef.current.value);
              inputRef.current.value = "";
            }
          }}
          className="px-4 py-1 bg-blue-500 text-white rounded"
        >
          Add Member
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}
        {calendar.flat().map((date, idx) => {
          const availableMembers = date ? getAvailableMembers(date) : [];
          return (
            <div
              key={idx}
              onClick={() => {
                if (date) {
                  members.forEach(member => toggleCell(member, date));
                }
              }}
              className={`p-2 h-24 border text-center text-sm cursor-pointer whitespace-pre-wrap ${date ? (availableMembers.length > 0 ? "bg-green-200" : "bg-gray-100") : ""}`}
              title={availableMembers.join(", ")}
            >
              {date ? date.replace("May ", "") : ""}
              {availableMembers.length > 0 && (
                <div className="mt-1 text-xs text-gray-700">
                  {availableMembers.length}/{members.length}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Top 5 Dates (Most Available)</h2>
        <ul className="list-disc list-inside">
          {bestDates.map(([date, count]) => (
            <li key={date}>{date} — {count}/{members.length} available</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
