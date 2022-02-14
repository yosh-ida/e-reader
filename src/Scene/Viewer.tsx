import React, { createRef, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SwipeableViews, { OnSwitchingCallbackTypeDescriptor } from 'react-swipeable-views';
import { bindKeyboard } from 'react-swipeable-views-utils';
import BookContent from '../Parser/BookContent';
import ParseCBZ from '../Parser/CBZ';
import './Viewer.css';

interface ViewerLocationParam {
    state: FileSystemFileHandle | File | null
}

interface IImgSource {
    page: number;
    src: string | null;
}

function ViewerScene() {
    //  state === null => redirect 404 ?
    const { state } = useLocation() as ViewerLocationParam;
    // const [content, setContent] = useState<BookContent | null>(null);
    const [pagemax, setPageMax] = useState<number>(-1);
    const [page, setPage] = useState<number>(0);
    const [swipeindex, setSwipeIndex] = useState<number>(0);
    const [img, setImg] = useState<string[]>([]);
    const [src, setSrc] = useState<(string | null)[]>([null, null, null]);
    const BindKeyboardSwipeableViews = useMemo(() => bindKeyboard(SwipeableViews), []);
    useEffect(
        () => {
            console.log(state);
            if (!state)
                return;
            (async () => {
                const file = state instanceof File ? state as File : await (state as FileSystemFileHandle).getFile();
                const cbz = await ParseCBZ(file);
                setPageMax(cbz.pages);
                let arr: string[] = [];
                for (let i = 0; i < cbz.pages; i++) {
                    arr = [...arr, await cbz.content(i)];
                    setImg(arr);
                    // console.log(i);
                }
            })();
        }, []);

    useEffect(
        () => {
            const i = img.length - 1;
            // console.log(i);
            if (i + 1 >= page || i - 1 <= page) {
                if (page === 0)
                    setSrc(
                        [
                            0 < img.length ? img[0] : null,
                            1 < img.length && 1 < pagemax ? img[1] : null,
                            2 < img.length && 2 < pagemax ? img[2] : null
                        ]);
                else if (page + 1 === pagemax)
                    setSrc(
                        [
                            pagemax - 3 < img.length ? img[pagemax - 3] : null,
                            pagemax - 2 < img.length && pagemax - 2 < pagemax ? img[pagemax - 2] : null,
                            pagemax - 1 < img.length && pagemax - 1 < pagemax ? img[pagemax - 1] : null
                        ]);
                else
                    setSrc(
                        [
                            page - 1 >= 0 && page - 1 < img.length ? img[page - 1] : null,
                            page < img.length ? img[page] : null,
                            page + 1 < pagemax && page + 1 < img.length ? img[page + 1] : null
                        ]);
            }
        }, [img]
    );

    const onChangeIndex = (index: number, indexLatest: number) => {
        if (index - indexLatest > 1 || indexLatest - index > 1) {
            setSwipeIndex(indexLatest);
            return;
        }

        const p = page + index - indexLatest;
        const i = p == 0 ? 0 : p + 2 > pagemax ? 2 : 1;
        if (p === 0)
            setSrc(
                [
                    0 < img.length ? img[0] : null,
                    1 < img.length && 1 < pagemax ? img[1] : null,
                    2 < img.length && 2 < pagemax ? img[2] : null
                ]);
        else if (p === pagemax - 1)
            setSrc(
                [
                    pagemax - 3 < img.length ? img[pagemax - 3] : null,
                    pagemax - 2 < img.length ? img[pagemax - 2] : null,
                    pagemax - 1 < img.length ? img[pagemax - 1] : null
                ]);
        else
            setSrc(
                [
                    p - 1 >= 0 && p - 1 < img.length ? img[p - 1] : null,
                    p < img.length ? img[p] : null,
                    p + 1 < pagemax && p + 1 < img.length ? img[p + 1] : null
                ]);

        setSwipeIndex(i);
        setPage(p);
        console.log("page: " + page + " to " + p + " / index: " + indexLatest + " to " + i);
    };

    // const onSwitching = (index: number, type: OnSwitchingCallbackTypeDescriptor) => {
    //     if (type !== 'end')
    //         return;
    //     console.log("switching: " + index);
    //     const i = page + (index === 0 ? -1 : 1);
    //     setSrc(
    //         [
    //             i - 1 >= 0 && i - 1 < img.length ? img[i - 1] : null,
    //             i < img.length ? img[i] : null,
    //             i + 1 < pagemax && i + 1 < img.length ? img[i + 1] : null
    //         ]);

    //     setSwipeIndex(i == 0 ? 0 : 1);
    //     setPage(i);
    // };

    // const onTransitionEnd = () => {

    // }

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            <BindKeyboardSwipeableViews index={swipeindex} onChangeIndex={onChangeIndex} axis="x" enableMouseEvents>
                {
                    src[0] ?
                        <div className="imgwrap">
                            <img src={src[0]} alt={"p" + (page - 1)} className="imgobj" />
                        </div> :
                        <div >loading</div>
                }
                <div className="imgwrap">
                    {src[1] ? <img src={src[1]} alt={"p" + page} className="imgobj" /> : <div >loading</div>}
                </div>
                {
                    src[2] ?
                        <div className="imgwrap">
                            <img src={src[2]} alt={"p" + (page + 1)} className="imgobj" />
                        </div> :
                        <div >loading</div>
                }
                {/* </SwipeableViews> */}
            </BindKeyboardSwipeableViews>
        </div>
    );
}

export default ViewerScene;
