import { TypedEvent, Listener } from "./typed-event"

// Base source: https://www.dustinhorne.com/post/2016/06/09/implementing-a-dictionary-in-typescript
export default class SharedDictionary<T> {
    private items: { [index: string]: T } = {}
    private counter = 0
    private event: TypedEvent<SharedDictionary<T>> = new TypedEvent<SharedDictionary<T>>()

    public containsKey(key: string): boolean {
        return this.items.hasOwnProperty(key)
    }

    public count(): number {
        return this.counter
    }

    public set(key: string, value: T) {
        if (!this.items.hasOwnProperty(key)) {
            return false
        }

        this.items[key] = value
        this.emit()
        return true
    }

    public add(key: string, value: T) {
        if (!this.items.hasOwnProperty(key)) {
            this.counter++
        }

        this.items[key] = value
        this.emit()
    }

    public remove(key: string): T | null {
        if (!this.items.hasOwnProperty(key)) {
            return null
        }

        const val = this.items[key]
        delete this.items[key]
        this.counter--
        this.emit()
        return val
    }

    public reset() {
        this.items = {}
        this.counter = 0
        this.emit()
    }

    public get(key: string): T {
        return this.items[key]
    }

    public keys(): string[] {
        const keySet: string[] = []

        for (const prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop)
            }
        }

        return keySet
    }

    public values(): T[] {
        const values: T[] = []

        for (const prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop])
            }
        }

        return values
    }

    public on(listener: Listener<SharedDictionary<T>>) {
        return this.event.on(listener)
    }

    public emit() {
        this.event.emit(this)
    }
}
