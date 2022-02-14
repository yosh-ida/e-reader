import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface ViewerProps {
    dir: FileSystemDirectoryHandle | undefined
}

function Viewer({ dir }: ViewerProps) {
    const { state } = useLocation();
    const [dirfiles, setFiles] = useState<(FileSystemDirectoryHandle | FileSystemFileHandle)[]>(new Array<FileSystemDirectoryHandle | FileSystemFileHandle>());

    const clickli = useMemo(
        () => {
            return (file: FileSystemDirectoryHandle | FileSystemFileHandle) => {
                console.log(file);
            }
        }, []
    );

    console.log(dir);

    useEffect(
        () => {
            const sleep = (msec: number) => new Promise(resolve => setTimeout(resolve, msec));
            const updatedir = async () => {
                if (!dir)
                    return;
                setFiles([] as (FileSystemDirectoryHandle | FileSystemFileHandle)[]);
                for await (const entry of dir.values()) {
                    setFiles((dir) => [...dir, entry]);
                    console.log(entry.kind, entry.name);
                    await sleep(1000);
                }
            }
            updatedir();
        }, []
    );

    return (
        <div>
            <div>
                <ul>
                    {dirfiles.map((file, index) => <li key={(index)} onClick={() => clickli(file)}>{(file.name)}</li>)}
                </ul>
            </div>
        </div>
    );
}

export default Viewer;