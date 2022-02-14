import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

const style = {
    position: "absolute",

    width: 200,
    height: 150,
    border: "1px dotted #888"
};

function RedirectViewerScene() {
    const navigate = useNavigate();
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        navigate("/viewer", { state: acceptedFiles[0] });
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop, noDrag: false });
    return (
        <div {...getRootProps()} style={{ position: "absolute", width: "80%", height: "80%", left: "50%", top: "50%", transform: "translate(-50%, -50%)", border: "1px dotted #888" }}>
            <input {...getInputProps()} />
            <p style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}>Drop file or click to select</p>
        </div>
    );
}

export default RedirectViewerScene;