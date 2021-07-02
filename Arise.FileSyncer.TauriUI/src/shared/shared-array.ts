import { TypedEvent, Listener } from "./typed-event"

export default class SharedArray<T> {
    private array: T[] = []
    private event: TypedEvent<SharedArray<T>> = new TypedEvent<SharedArray<T>>()

    /**
     * getArray: returns a copy of the array
     */
    public getArray() {
        return this.array.slice()
    }

    public get(index: number) {
        return this.array[index]
    }

    public peek() {
        if (this.array.length > 0) {
            return this.array[this.array.length - 1]
        } else {
            return null
        }
    }

    public length() {
        return this.array.length
    }

    public setArray(array: T[]) {
        this.array = array.slice()
        this.emit()
    }

    public set(index: number, item: T) {
        this.array[index] = item
        this.emit()
    }

    public push(...items: T[]) {
        const length = this.array.push(...items)
        this.emit()
        return length
    }

    public pop() {
        const removed = this.array.pop()
        this.emit()
        return removed
    }

    public shift() {
        const removed = this.array.shift()
        this.emit()
        return removed
    }

    public remove(index: number) {
        const removed = this.array.splice(index, 1)
        this.emit()
        return removed[0]
    }

    public reset() {
        this.array = []
        this.emit()
    }

    public on(listener: Listener<SharedArray<T>>) {
        return this.event.on(listener)
    }

    /**
     * setup: binds the listener to the event and calles it once
     */
    public setup(listener: Listener<SharedArray<T>>) {
        const e = this.event.on(listener)
        listener(this)
        return e
    }

    public emit() {
        this.event.emit(this)
    }
}
