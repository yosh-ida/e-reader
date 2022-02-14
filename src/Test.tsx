import React, { useEffect, useMemo, useState } from 'react';
import { Link, NavigateFunction, useNavigate, useRoutes } from 'react-router-dom';
import Viewer from './viewer';

function Test() {
    const [dir, setDir] = useState<FileSystemDirectoryHandle | null>(null);
    const navigate = useNavigate();
    const dirpicker = async () => {
        const tdir = await window.showDirectoryPicker();
        setDir(tdir);
        navigate('../viewer2', { state: { dir: tdir } });
    }

    return (
        <div>
            <p>test</p>
            <Link to="../">home</Link>
            {/* <Link to="../viewer" state={{ dir: dir }}>home</Link> */}
            <button onClick={dirpicker}>open directory</button>
            {/* {dir ? <Viewer dir={dir} /> : <div />} */}
        </div>
    );
}

export default Test;