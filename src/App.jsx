import { useEffect, useState } from 'react';
import TransactionsTable from './components/TransactionsTable';
import Statistics from './components/Statistics';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import './App.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
function App() {
  const [month, setMonth] = useState('03'); // Default March

  useEffect(() => {
    AOS.init();
  }, []);

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div className="container m-auto">
      <div className="row mb-4">
        <div className="col-md-12 text-center">
          <h1 className="gradient-heading">Product Transactions Dashboard</h1>
        </div>
      </div>

      {/* Dropdown to select the month */}
      <div className="mb-4 text-end">
        <label htmlFor="month" className="form-label fw-bold">Select Month: </label>
        <select
          id="month"
          className="form-select w-auto d-inline-block"
          value={month}
          onChange={handleMonthChange}
        >
          <option value="01">January</option>
          <option value="02">February</option>
          <option value="03">March</option>
          <option value="04">April</option>
          <option value="05">May</option>
          <option value="06">June</option>
          <option value="07">July</option>
          <option value="08">August</option>
          <option value="09">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </div>
      
      {/* Statistics component */}
      <Statistics month={month} />

      {/* Transactions Table */}
      <TransactionsTable month={month} />

      {/* Bar Chart for price ranges */}
      <BarChart month={month} />

      {/* Pie Chart for categories */}
      <PieChart month={month} />
    </div>
  );
}

export default App;
