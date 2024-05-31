import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
// Import Chart.js component too since only Bar component won't work for the graph
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import io from 'socket.io-client';

function Analytics({isAdmin}){
    const [hourlyAverage, setHourlyAverage] = useState([]);
    const baseUrl = window.location.origin;
    const serverUrl = 'http://localhost:3000';
    const [predictions, setPredictions] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch the averages from the database. There is no need to use sockets to get this from server. The server does calculations and store it in the database.
        fetch(serverUrl + '/api/parking-spots/admin/analytics')
        .then(response => response.json())
        .then(data => {
            const analytics = data[7];
            let hourlyAvg = [];
            for(let i = 1; i < 25; i++){
                hourlyAvg.push(analytics[`${i}`]);
            }  
            setHourlyAverage(hourlyAvg);      
        });

        
        // Fetch the endpoint to access the future predictions json data
        fetch(serverUrl + '/api/parking-spots/admin/predictions')
        .then(response => response.json())
        .then(data => {
            setPredictions(data);
        })

        // Get the next week predictions from server
        const socket = io(serverUrl);
        socket.on('predictionsUpdated', (updated) => {
            setMessage(updated);
        });
        // Disconnect the socket at the end of the function call
        return () => {
            socket.disconnect();
        };
    },[]);

    // Register all chart.js properties to the Chart object
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );
      
    // Below options will be used in the Bar component when rendered on page
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
        <div className='analytics-page'>
             <h1>Parking Lot Analytics</h1>
            {/**
             * If the admin is logged in, show the current week statistics and the next week predictions for the occupied spots in parking lot
             * Display two different graphs
             */
            (isAdmin) && (
                <div>
                <div className='home-link'>
                <a href={baseUrl}>Go to Home</a>
                </div>
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
                <br/>
                <h1>Predictions for the next week</h1>
                <p>(Note that the predictions are calculated every Sunday morning)</p>
                <p>{message}</p>
                <Bar
                    key={Math.random()}
                    data={{
                        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
                        datasets: [
                        {
                            label: 'Average Occupied Spot predictions for next week',
                            data: predictions,
                            backgroundColor: 'rgba(255, 99, 20, 0.2)',
                            borderColor: 'rgba(255, 99, 10, 1)',
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