import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Statistics.css';  // Still using custom CSS

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSaleAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    const response = await axios.get(`http://localhost:5000/statistics`, {
      params: { month },
    });
    setStatistics(response.data);
  };

  return (
    <div className="row text-center mb-5">
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-primary">Total Sale Amount</h5>
            <p className="card-text display-4 text-success">${statistics.totalSaleAmount}</p>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-primary">Total Sold Items</h5>
            <p className="card-text display-4 text-warning">{statistics.totalSoldItems} items</p>
          </div>
        </div>
      </div>
      <div className="col-lg-4 col-md-6 mb-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="card-title text-primary">Total Not Sold Items</h5>
            <p className="card-text display-4 text-danger">{statistics.totalNotSoldItems} items</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
