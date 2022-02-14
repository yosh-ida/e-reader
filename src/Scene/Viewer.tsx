import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SwipeableViews from 'react-swipeable-views';
import { bindKeyboard, SlideRenderProps, virtualize } from 'react-swipeable-views-utils';
import BookContent from '../Parser/BookContent';
import ParseCBZ from '../Parser/CBZ';
import './Viewer.css';

interface ViewerLocationParam {
    state: FileSystemFileHandle | File | null
}

function ViewerScene() {
    //  state === null => redirect 404 ?

    const ExtendSwipeableViews = useMemo(() => virtualize(bindKeyboard(SwipeableViews)), []);

    const { state } = useLocation() as ViewerLocationParam;
    // const [content, setContent] = useState<BookContent | null>(null);
    const [book, setBook] = useState<BookContent | null>(null);
    const [swipeindex, setSwipeIndex] = useState<number>(0);
    const [img, setImg] = useState<string[]>([]);

    // console.log(state);

    useEffect(
        () => {
            if (!state)
                return;
            (async () => {
                const file = state instanceof File ? state as File : await (state as FileSystemFileHandle).getFile();
                const cbz = await ParseCBZ(file);
                setBook(cbz);
            })();
        }, []);

    useEffect(
        () => {
            if (!book)
                return;
            (async () => {
                let arr: string[] = [];
                for (let i = 0; i < book.pages; i++) {
                    arr = [...arr, await book.content(i)];
                    setImg(arr);
                    // console.log(i);
                }
            })();
        }, [book]
    );

    const onChangeIndex = useMemo(
        () => {
            if (!book)
                return () => { };
            else
                return (index: number, indexLatest: number) => {
                    //  swipableviewのpagemaxが更新されないと
                    // console.log("page: " + indexLatest + " to " + index);
                    if (index >= 0 && index < book.pages && (index - indexLatest === 1 || index - indexLatest === -1))
                        setSwipeIndex(index);
                }
        }, [book]);

    const slideRenderer = useMemo(
        () => ({ key, index }: SlideRenderProps) => (
            key < img.length && img[key] ?
                <div key={"div" + key} className="imgwrap">
                    <img src={img[key]} key={"img" + key} alt={"p" + key} className="imgobj" />
                </div> :
                <div key={"loading" + key}>loading</div>
        ), [img]);

    // const view = useMemo(
    //     () => <ExtendSwipeableViews index={swipeindex} overscanSlideAfter={book ? book.pages - swipeindex - 1 : 0} overscanSlideBefore={swipeindex} slideRenderer={slideRenderer} onChangeIndex={onChangeIndex} axis="x" enableMouseEvents />,
    //     [book, swipeindex]);

    return (
        <div style={{ width: "100%", height: "100vh" }}>
            {/* {view} */}
            <ExtendSwipeableViews index={swipeindex} overscanSlideAfter={book ? book.pages - swipeindex - 1 : 0} overscanSlideBefore={swipeindex} slideRenderer={slideRenderer} onChangeIndex={onChangeIndex} axis="x" enableMouseEvents />
        </div>
    );
}

export default ViewerScene;
