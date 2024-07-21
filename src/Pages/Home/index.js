import { Box, Card, Grid, styled } from '@mui/material'
import React, { useEffect, useState } from 'react'
import MuiAlert from "@mui/material/Alert";
import {

    Snackbar,
} from "@mui/material";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });



const MyCard = styled(Card)(({ theme }) => ({
  padding: "45px",
  "& h3": {
    margin: "0"
  }
}))

const Home = (props) => {

  const [seconds, setSeconds] = useState(60);


  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => setSeconds(seconds - 1), 1000);
    } else {
      setSeconds(60);
    }
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
        return;
    }
    props.setOpen(false);
    
};

  return (
    <div>
      <div>
        <Grid container spacing={4}>
        
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
      <Snackbar
        open={props.open}
        autoHideDuration={6000}
        onClose={props.handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
        <Alert
            onClose={handleClose}
            severity={props.messageState}
            sx={{ width: "100%" }}
        >
            {props.message}
        </Alert>
    </Snackbar>
    </div>
  );
};

export default Home;
