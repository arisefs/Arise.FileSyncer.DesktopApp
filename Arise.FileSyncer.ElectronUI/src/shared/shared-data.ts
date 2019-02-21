import { TypedEvent, Listener } from "./typed-event";

export default class SharedData<T> {
    private data: T = null;
    private event: TypedEvent<T> = new TypedEvent<T>();
    private defaultValue: T = null;

    constructor(defaultValue?: T) {
        if (defaultValue != undefined) {
            this.defaultValue = defaultValue;
            this.data = defaultValue;
        }
    }

    public get() {
        return this.data;
    }

    public set(data: T) {
        this.data = data;
        this.emit();
    }

    public reset() {
        this.data = this.defaultValue;
        this.emit();
    }

    public on(listener: Listener<T>) {
        return this.event.on(listener);
    }

    /**
     * setup: binds the listener to the event and calles it once
     */
    public setup(listener: Listener<T>) {
        let e = this.event.on(listener)
        listener(this.data);
        return e;
    }

    public emit() {
        this.event.emit(this.data);
    }
}
