import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import DashboardCard from "../components/DashboardCard";
import { Grid } from "@mui/material";

const DashboardPage = () => {
    return (
        <div style={{ display: 'flex' }}>
            {/* Sidebar */}
            <Sidebar />

            <div style={{ flex: 1, padding: '20px' }}>
                {/* Navbar */}
                <Navbar />

                <Grid container spacing={3} style={{ marginTop: '20px' }}>
                    {/* Dashboard Cards */}
                    <Grid item xs={12} sm={6} md={4}>
                        <DashboardCard title="Total Users" value="1,200" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <DashboardCard title="Active Users" value="950" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <DashboardCard title="Total Revenue" value="$30,000" />
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default DashboardPage;
