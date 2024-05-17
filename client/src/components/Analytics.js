import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

function Analytics({onAuth}){
    const [analyticsArray, setAnalyticsArray] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:3000');
        socket.on('analytics', (analytics) => {
            console.log("Inside analytics page socket");
            setAnalyticsArray(analytics);
          });
          return () => {
            socket.disconnect();
          };
    },[]);

    return (
        <div>
            <h1>Parking Lot Analytics</h1>
            <p>Most busy hour: {analyticsArray[0]}</p>
            <p>Least busy hour: {analyticsArray[1]}</p>
            {/* Add your analytics content here */}
        </div>
    );
};

export default Analytics;