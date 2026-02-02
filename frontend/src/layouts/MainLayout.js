import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import '../styles/global.css';

const MainLayout = () => {
    return (
        <div className="app-container">
            <Header />
            <main className="main-content" style={{ minHeight: '80vh', padding: '20px' }}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
