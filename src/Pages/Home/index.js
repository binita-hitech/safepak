import { Box, Card, Grid, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'



const MyCard = styled(Card)(({ theme }) => ({
  padding: "45px",
  "& h3": {
    margin: "0"
  }
}))

const Home = () => {
  const [seconds, setSeconds] = useState(60);
 
  const [resume, setResume] = useState(0);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(60);
    }
  });



  return (
    <div>
      <div>
        <Grid container spacing={4}>
          
          {/* {resume === 1 &&
            <Grid item xs={12} sm={6} md={4}>
              <div className="grid-block-timer">
                <h3>Order Process Resuming in:</h3>
                <div className="timer_box">{`${Math.floor(time / 60)}`.padStart(2, 0)}:
                  {`${time % 60}`.padStart(2, 0)}</div>
              </div>
            </Grid>
          } */}
         

          <Grid item xs={12} sm={6} md={6}>
            <div className="grid-block-timer">
              <h3>Refreshing Dashboard in:</h3>
              <div className="timer_box">00:{String(seconds).padStart(2, '0')}</div>
            </div>
          </Grid>

        </Grid>
      </div>
      <style jsx>{`
        .grid-block-timer {
          border: 0.5px solid #gray;
          box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.07);
          background-color: #fff;
          border-radius: 5px;
          padding: 80px;
        }
      `}</style>
    </div>
  );
};

export default Home;
