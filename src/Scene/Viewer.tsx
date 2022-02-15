import React, { useCallback, useEffect, useMemo, useState } from 'react';
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

    const ExtendSwipeableViews = useMemo(() => virtualize(SwipeableViews), []);

    const { state } = useLocation() as ViewerLocationParam;
    const [book, setBook] = useState<BookContent | null>(null);
    const [swipeindex, setSwipeIndex] = useState<number>(0);
    const [img, setImg] = useState<string[]>([]);
    const [src, setSrc] = useState<{ [key: number]: string | null }>({});
    const [page, setPage] = useState<{ pagebefore: number, pageafter: number }>({ pagebefore: 0, pageafter: 0 });

    useEffect(
        () => {
            if (!state)
                return;
            (async () => {
                const file = state instanceof File ? state as File : await (state as FileSystemFileHandle).getFile();
                const cbz = await ParseCBZ(file);
                const after = Math.min(cbz.pages - 1, 1);
                const imgs: { [key: number]: string | null } = {};
                for (let i = 0; i <= after; i++)
                    imgs[i] = null;
                setBook(cbz);
                setPage({ pagebefore: 0, pageafter: after });
                setSrc(imgs);
            })();
        }, []);

    useEffect(
        () => {
            if (!book)
                return;
            // console.log("book updated");
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

    useEffect(
        () => {
            if (!book)
                return;
            let updated = false;
            for (let key in src) {
                if (src[key] || +key >= img.length)
                    continue;
                updated = true;
                break;
            }
            if (!updated)
                return;
            const imgs: { [key: number]: string | null } = {};
            for (let key in src)
                if (+key < img.length)
                    imgs[+key] = img[key];
            setSrc(imgs);
        }, [book, img]
    );

    //  imgの更新に影響されたくない
    const onChangeIndex = useMemo(
        () => {
            if (!book)
                return (index: number, indexLatest: number) => { };
            else
                return (index: number, indexLatest: number) => {
                    // console.log("page: " + indexLatest + " to " + index);
                    const pagebefore = index === 0 ? 0 : 1;
                    const pageafter = index === book.pages - 1 ? 0 : 1;

                    const imgs: { [key: number]: string | null } = {};
                    if (pagebefore >= 1)
                        imgs[index - 1] = index >= 1 && index - 1 < img.length ? img[index - 1] : null;
                    imgs[index] = index >= 0 && index < img.length ? img[index] : null;
                    if (pageafter >= 1)
                        imgs[index + 1] = index + 1 < img.length ? img[index + 1] : null;
                    setSrc(imgs);
                    setPage({ pagebefore, pageafter });
                    setSwipeIndex(index);
                }
        }, [book, img]);
    // }, []);

    //  imgの更新に影響されたくない
    const slideRenderer = useMemo(
        () => ({ key, index }: SlideRenderProps) => (
            key in src && src[key] ?
                <div key={"div" + key} className="imgwrap">
                    <img src={src[key]!!} key={"img" + key} alt={"p" + key} className="imgobj" />
                </div> :
                <div key={"loading" + key}>loading</div>
        ), [src]);

    const handleUserKeyPress = useCallback(
        book ? ({ key, keyCode }) => {
            if (keyCode === 39) {
                if (swipeindex + 1 < book.pages)
                    onChangeIndex(swipeindex + 1, swipeindex);
            } else if (keyCode === 37 && swipeindex > 0)
                onChangeIndex(swipeindex - 1, swipeindex);
        } : () => { }, [book, swipeindex, onChangeIndex]);
    useEffect(() => {
        window.addEventListener("keydown", handleUserKeyPress);
        return () => {
            window.removeEventListener("keydown", handleUserKeyPress);
        };
    }, [handleUserKeyPress]);

    const view = useMemo(
        () => <ExtendSwipeableViews index={swipeindex} overscanSlideAfter={page.pageafter} overscanSlideBefore={page.pagebefore} slideRenderer={slideRenderer} onChangeIndex={onChangeIndex} axis="x" enableMouseEvents />,
        [page, swipeindex, slideRenderer, onChangeIndex]);

    return (
        <div style={{ width: "100%", height: "100vh" }} onKeyDown={() => console.log("pressed")}>
            {/* {view} */}
            <ExtendSwipeableViews index={swipeindex} overscanSlideAfter={page.pageafter} overscanSlideBefore={page.pagebefore} slideRenderer={slideRenderer} onChangeIndex={onChangeIndex} axis="x" enableMouseEvents />
        </div>
    );
}

export default ViewerScene;
