import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Viewer2() {
    const { state } = useLocation();
    console.log(state);
    return (
        <div>
        </div>
    );
}

export default Viewer2;