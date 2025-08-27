import React from "react";
import DashboardCard from "../components/DashboardCard";
import { Grid } from "@mui/material";

const Dashboard = () => {
    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div style={{ flex: 1, padding: '20px' }}>
                <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    <Grid item xs={12} md={4}>
                        <DashboardCard title="Total Users" value="1,200" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardCard title="Active Users" value="950" />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <DashboardCard title="Total Revenue" value="$30,000" />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Dashboard;