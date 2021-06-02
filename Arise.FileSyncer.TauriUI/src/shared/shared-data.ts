import { TypedEvent, Listener } from "./typed-event"

export default class SharedData<T> {
    private data: T;
    private defaultValue: T;
    private event: TypedEvent<T> = new TypedEvent<T>();

    constructor(defaultValue: T) {
        this.defaultValue = defaultValue
        this.data = defaultValue
    }

    public get() {
        return this.data
    }

    public set(data: T) {
        this.data = data
        this.emit()
    }

    public reset() {
        this.data = this.defaultValue
        this.emit()
    }

    public on(listener: Listener<T>) {
        return this.event.on(listener)
    }

    /**
     * setup: binds the listener to the event and calles it once
     */
    public setup(listener: Listener<T>) {
        const e = this.event.on(listener)
        listener(this.data)
        return e
    }

    public emit() {
        this.event.emit(this.data)
    }
}
