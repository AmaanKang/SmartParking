import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';

function Analytics({onAuth}){
    const [analyticsArray, setAnalyticsArray] = useState([]);
    const [hourlyAverage, setHourlyAverage] = useState([]);

    useEffect(() => {
        // Fetch the averages from the database. There is no need to use sockets to get this from server. The server does calculations and store it in the database.
        fetch('http://localhost:3000/api/parking-spots/admin/analytics')
        .then(response => response.json())
        .then(data => {
            const analytics = data[7];
            let hourlyAvg = [];
            for(let i = 1; i < 25; i++){
                hourlyAvg.push(analytics[`${i}`]);
            }  
            setHourlyAverage(hourlyAvg);      
        });

        const socket = io('http://localhost:3000');
        socket.on('analytics', (analytics) => {
            console.log("Inside analytics page socket");
            setAnalyticsArray(analytics);
          });
          return () => {
            socket.disconnect();
          };
    },[]);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );
      
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Average of occupied spots per hour',
            },
        },
    };

    return (
        <div>
             <h1>Parking Lot Analytics</h1>
            {(onAuth) && (
                <div>
                    <p>Most busy hour: {analyticsArray[0]}</p>
                    <p>Least busy hour: {analyticsArray[1]}</p>
                    <Bar
                    key={Math.random()}
                    data={{
                        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
                        datasets: [
                        {
                            label: 'Average Occupied Spots',
                            data: hourlyAverage,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        },
                        ],
                    }}
                    options={options}
                    />
                </div>  
            )}
        </div>
    );
};

export default Analytics;