export default class Counter {
    private count: number;

    constructor(initialCount?: number) {
        if (initialCount) {
            this.count = initialCount;
        } else {
            Bun.file('count.txt').text().then((text) => {
                this.count = parseInt(text) || 0;
            });
        }
    }

    increment() {
        this.count += 1;
        Bun.write('count.txt', this.count.toString());
    }

    getCount() {
        return this.count;
    }
}