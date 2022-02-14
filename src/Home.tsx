import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationDrawer } from './navigationDrawer';

function Home() {
    return (
        <div>
            <p>home</p>
            <Link to="test">test</Link>
            <Link to="viewer">viewer</Link>
        </div>
    );
}

export default Home;
