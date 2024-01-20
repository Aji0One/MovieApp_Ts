import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import "../Styles/Loading.css";

export default function CircularIndeterminate() {

    return (
        <div className='loading'>
            <Box sx={{ display: 'flex', marginTop: "30%", flexDirection: "column", alignItems: "center" }}>

                <CircularProgress />
            </Box>
        </div>
    );
}