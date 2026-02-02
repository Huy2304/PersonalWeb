import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>403 - Forbidden</h1>
            <p>You do not have permission to view this page.</p>
            <Link to="/">Go Home</Link>
        </div>
    );
};

export default Forbidden;
