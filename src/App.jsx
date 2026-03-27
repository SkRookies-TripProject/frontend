// Vite + React + Tailwind 기반
// npm install 후 npm run dev 실행

import { useState } from "react";

const mockTrips = [
  { id: 1, title: "일본 여행", country: "일본", city: "도쿄", budget: 1000000 },
];

const mockExpenses = [
  { id: 1, tripId: 1, amount: 50000, category: "식비", date: "2026-03-20", memo: "라멘" },
];

export default function App() {
  const [view, setView] = useState("trip");
  const [trips, setTrips] = useState(mockTrips);
  const [expenses, setExpenses] = useState(mockExpenses);
  const [selectedTrip, setSelectedTrip] = useState(null);

  return (
    <div className="h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-[400px] h-[800px] bg-white rounded-2xl shadow-xl overflow-hidden">
        <Header setView={setView} />

        {view === "trip" && (
          <TripPage
            trips={trips}
            setTrips={setTrips}
            setSelectedTrip={setSelectedTrip}
            setView={setView}
          />
        )}

        {view === "expense" && selectedTrip && (
          <ExpensePage
            trip={selectedTrip}
            expenses={expenses}
            setExpenses={setExpenses}
          />
        )}
      </div>
    </div>
  );
}

function Header({ setView }) {
  return (
    <div className="p-4 bg-blue-500 text-white flex justify-between">
      <span>여행 가계부</span>
      <button onClick={() => setView("trip")}>홈</button>
    </div>
  );
}

function TripPage({ trips, setTrips, setSelectedTrip, setView }) {
  const [form, setForm] = useState({ title: "", country: "", city: "", budget: "" });

  const addTrip = () => {
    const newTrip = { ...form, id: Date.now() };
    setTrips([...trips, newTrip]);
    setForm({ title: "", country: "", city: "", budget: "" });
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">여행 관리</h2>

      <div className="space-y-2">
        <input placeholder="제목" className="input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="국가" className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <input placeholder="도시" className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <input placeholder="예산" className="input" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
        <button className="btn" onClick={addTrip}>추가</button>
      </div>

      <div className="space-y-2">
        {trips.map((trip) => (
          <div key={trip.id} className="p-3 border rounded flex justify-between">
            <div>
              <div>{trip.title}</div>
              <div className="text-sm text-gray-500">{trip.city}</div>
            </div>
            <button
              onClick={() => {
                setSelectedTrip(trip);
                setView("expense");
              }}
            >
              보기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExpensePage({ trip, expenses, setExpenses }) {
  const [form, setForm] = useState({ amount: "", category: "", date: "", memo: "" });

  const addExpense = () => {
    const newExpense = { ...form, id: Date.now(), tripId: trip.id };
    setExpenses([...expenses, newExpense]);
    setForm({ amount: "", category: "", date: "", memo: "" });
  };

  const filtered = expenses.filter((e) => e.tripId === trip.id);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-lg font-bold">지출 관리 ({trip.title})</h2>

      <div className="space-y-2">
        <input placeholder="금액" className="input" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
        <input placeholder="카테고리" className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
        <input type="date" className="input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input placeholder="메모" className="input" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
        <button className="btn" onClick={addExpense}>추가</button>
      </div>

      <div className="space-y-2">
        {filtered.map((exp) => (
          <div key={exp.id} className="p-3 border rounded">
            <div>{exp.category} - {exp.amount}원</div>
            <div className="text-sm text-gray-500">{exp.date}</div>
            <div className="text-sm">{exp.memo}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tailwind utility
const style = document.createElement("style");
style.innerHTML = `
.input { width:100%; padding:8px; border:1px solid #ddd; border-radius:8px; }
.btn { width:100%; padding:10px; background:#3b82f6; color:white; border-radius:8px; }
`;
document.head.appendChild(style);
