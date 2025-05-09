export default class ADto {
    _data;

    constructor(data) {
        this._data = data;
        for (const key of Object.keys(data)) {
            this[key] = data[key];
        }
    }

    static fill(data, self) {
        for (const key of Object.keys(data)) {
            self[key] = data[key];
        }
    }
}
