import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";

ReactDOM.render(
    <Router>
        <Routes>
            <Route path="/admin" element={<DashboardPage />} />
            {/* Thêm các route khác nếu cần */}
        </Routes>
    </Router>,
    document.getElementById("root")
);
