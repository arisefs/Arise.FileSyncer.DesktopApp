import * as Shared from "../../shared/shared";
import { Profile, Connection, Progress, PageStack, Notification } from "./interfaces";

export const profiles = new Shared.Dictionary<Profile>();
export const connections = new Shared.Dictionary<Connection>();
export const globalProgress = new Shared.Data<Progress>({ indeterminate: true, current: 0, maximum: 0 });
export const lastGlobalProgress = new Shared.Data<Progress>({ indeterminate: true, current: 0, maximum: 0 });
export const pageStack = new Shared.Array<PageStack>();
export const notificationStack = new Shared.Array<Notification>();

export function reset() {
    profiles.reset();
    connections.reset();
    globalProgress.reset();
    lastGlobalProgress.reset();
    pageStack.reset();
    notificationStack.reset();
}
