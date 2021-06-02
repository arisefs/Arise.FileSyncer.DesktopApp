import AppData from "../app-data/app-data"
import { PageStack } from "../app-data/interfaces"

export function changePage(ps: PageStack) {
    if (AppData.pageStack.length() > 0) {
        if (AppData.pageStack.peek()?.page.prototype === ps.page.prototype) {
            return
        }
    }

    AppData.pageStack.push(ps)
}

export function goBack() {
    if (AppData.pageStack.length() > 1) {
        AppData.pageStack.pop()
    }
}
