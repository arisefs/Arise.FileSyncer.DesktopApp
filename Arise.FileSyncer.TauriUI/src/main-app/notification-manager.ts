import AppData from "../app-data/app-data"
import { Notification } from "../app-data/interfaces"

export function pushNotification(notification: Notification) {
    if (notification != null) {
        AppData.notificationStack.push(notification)
    }
}
