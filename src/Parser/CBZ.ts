import BookContent from './BookContent';
const { Unzip } = require('zlibjs/bin/unzip.min').Zlib;

interface IUnzip {
    getFilenames: () => string[];
    decompress: (filename: string) => Uint8Array;
}

class CBZ extends BookContent {
    readonly pages: number;
    readonly zip: IUnzip;

    constructor(content: IUnzip) {
        super();
        // console.log(content.getFilenames());
        this.pages = content.getFilenames().length;
        this.zip = content;
    }

    async content(page: number): Promise<string> {
        if (page < 0 || page >= this.pages)
            throw new Error('Invalid page.');
        return new Promise((resolve, reject) => {
            // console.log(this.zip.getFilenames()[page])
            // console.log(this.zip.decompress(this.zip.getFilenames()[page]));
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(new Blob([this.zip.decompress(this.zip.getFilenames()[page])]));
        });
    }
}

export default async function ParseCBZ(file: File): Promise<BookContent> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            resolve(new CBZ(new Unzip(new Uint8Array(reader.result as ArrayBuffer)) as IUnzip));
        };
        reader.readAsArrayBuffer(file);
    });
}