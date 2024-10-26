import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import './Charts.css';  
import AOS from 'aos';
import 'aos/dist/aos.css';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ month }) => {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    fetchCategoryData();
    AOS.init();

  }, [month]);

  const fetchCategoryData = async () => {
    const response = await axios.get(`http://localhost:5000/categories`, {
      params: { month }
    });
    setCategoryData(response.data);
  };

  const data = {
    labels: categoryData.map((item) => item.category),
    datasets: [
      {
        label: 'Number of Items',
        data: categoryData.map((item) => item.count),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      }
    ]
  };

  return (
    <div className="chart-container cp2 mb-5" data-aos="zoom-out-left">
      <h3 className="text-center">Category Pie Chart</h3>
      <Pie data={data} />
    </div>
  );
};

export default PieChart;
