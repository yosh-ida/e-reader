import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationDrawer } from '../navigationDrawer';

function BookShelfScene() {
    // const [dir, setDir] = useState<FileSystemDirectoryHandle | null>(null);
    const navigate = useNavigate();
    // const dirpicker = async () => {
    //     const tdir = await window.showDirectoryPicker();
    //     setDir(tdir);
    //     navigate('/viewer', { state: { file: tdir } });
    // };
    const filepicker = async () => {
        const tdir = await window.showOpenFilePicker();
        navigate('/viewer', { state: tdir[0] });
        // const file = await tdir[0].getFile();
        // const reader = new FileReader();
        // reader.onload = () => { navigate('/viewer', { state: { file: reader.result as string } }); };
        // reader.readAsDataURL(file);
    };
    return (
        <div>
            <NavigationDrawer nav="SHELF" anchor="left" />
            <p>home</p>
            <button onClick={filepicker}>open directory</button>
        </div>
    );
}

export default BookShelfScene;
