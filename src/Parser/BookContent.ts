export default abstract class BookContent {
    abstract content(page: number): Promise<string>;
    abstract pages: number;
}