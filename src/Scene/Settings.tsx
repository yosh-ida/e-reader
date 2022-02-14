import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationDrawer } from '../navigationDrawer';

function SettingsScene() {
    return (
        <div>
            <NavigationDrawer nav="SETTINGS" anchor="left" />
        </div>
    );
}

export default SettingsScene;
