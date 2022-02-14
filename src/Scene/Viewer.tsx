import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BookContent from '../Parser/BookContent';
import ParseCBZ from '../Parser/CBZ';

interface ViewerLocationParam {
    state: FileSystemFileHandle | null
}

function ViewerScene() {
    //  state == null => redirect 404 ?
    const { state } = useLocation() as ViewerLocationParam;
    const [content, setContent] = useState<BookContent | null>(null);
    const [page, setPage] = useState<number>(0);
    const [img, setImg] = useState<string | null>(null);

    // console.log(state);
    useEffect(
        () => {
            if (!state)
                return;
            (async () => {
                const file = await state.getFile();
                const cbz = await ParseCBZ(file);
                setContent(cbz);
                setPage(0);
            })();
        });

    useEffect(
        () => {
            if (!content)
                return;
            (async () => {
                setImg(await content.content(page));
            })();
        }, [content, page]
    );

    useEffect(() => {
        if (!content)
            return;
        const listener = (event: KeyboardEvent) => {
            // console.log(event);
            if (event.key === 'ArrowLeft' && page >= 1)
                setPage(page - 1);
            else if (event.key === 'ArrowRight' && page + 1 < content.pages)
                setPage(page + 1);
        };
        document.addEventListener('keydown', listener, false);
        return () => {
            document.removeEventListener("keydown", listener, false);
        }
    }, [content, page]);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>

            {/* <NavigationDrawer nav="VIEWER" anchor="left" /> */}
            <div style={{ textAlign: "center", width: "100%", height: "100%" }}>
                {img ? <img src={img} alt={page.toString()} style={{ userSelect: "none", objectFit: "scale-down", width: "auto", height: "auto", maxHeight: "100%", maxWidth: "100%" }} /> : <div />}
            </div>
            {/* <button onClick={() => jumpPage(page - 1)}>＜</button>
            <button onClick={() => jumpPage(page + 1)}>＞</button> */}
        </div>
    );
}

export default ViewerScene;
