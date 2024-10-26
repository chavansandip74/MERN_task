import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Charts.css'; 
import AOS from 'aos';
import 'aos/dist/aos.css';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [priceRangeData, setPriceRangeData] = useState([]);

  useEffect(() => {
    fetchPriceRangeData();
    AOS.init();

  }, [month]);

  const fetchPriceRangeData = async () => {
    const response = await axios.get(`http://localhost:5000/price-range`, {
      params: { month }
    });
    setPriceRangeData(response.data);
  };

  const data = {
    labels: priceRangeData.map((item) => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: priceRangeData.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      }
    ]
  };

  return (
    <div className="chart-container mb-5" data-aos="zoom-out-right">
      <h3 className="text-center">Price Range Bar Chart</h3>
      <Bar data={data} />
    </div>
  );
};

export default BarChart;
