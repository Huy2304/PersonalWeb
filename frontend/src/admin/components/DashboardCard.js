import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const DashboardCard = ({ title, value }) => {
    return (
        <Card style={{ margin: '20px', width: '200px' }}>
            <CardContent>
                <Typography variant="h5">{title}</Typography>
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>{value}</Typography>
            </CardContent>
        </Card>
    );
};

export default DashboardCard;
