import * as Activity from "./activities";

export function getActivityTypeByName(activityName: string) {
    return (<any>Activity)[activityName];
}
