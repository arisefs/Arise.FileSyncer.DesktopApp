import { Profile, Progress } from "./interfaces";

export function getProfileTypeString(profile: Profile): string {
    let typeString = "";

    if (profile.allowReceive) {
        if (profile.allowSend) {
            typeString = "Upload/Download";
        } else {
            typeString = "Download-Only";
        }
    } else if (profile.allowSend) {
        typeString = "Upload-Only";
    }

    if (profile.allowDelete) {
        typeString += " (with delete)";
    }

    return typeString;
}

export function getPercent(progress: Progress) {
    if (progress.current < 0 || progress.maximum < 0 || progress.current > progress.maximum) {
        console.log("getPercent() invalid progress data! Data: c:" + progress.current + " m:" + progress.maximum);
        return 0.0;
    }

    if (progress.maximum === 0) return 1.0;
    if (progress.current === 0) return 0.0;

    return progress.current / progress.maximum;
}

export function getRemaining(progress: Progress) {
    return progress.maximum - progress.current;
}

export function getSpeed(progress: Progress) {
    if (progress.indeterminate) {
        return undefined;
    } else {
        return progress.speed;
    }
}

export function getRemainingTime(progress: Progress) {
    if (progress.indeterminate || progress.speed == 0) {
        return undefined;
    } else {
        return getRemaining(progress) / progress.speed;
    }
}

export function formatNumber(num: number) {
    let text = num.toFixed(0);
    let remaining = text.length % 3;
    let outText = text.substring(0, remaining);

    for (let index = remaining; index < text.length; index += 3) {
        outText += " " + text.substring(index, index + 3);
    }

    return outText;
}

export function formatSizeNumber(num: number) {
    let div = divideCounter(num, 1000);
    let text = div.num.toFixed(1);
    text += " " + levelToSizeUnit(div.level);
    return text;
}

export function formatTimeNumber(num: number) {
    let div = divideCounter(num, 60);
    let text = div.num.toFixed(0);
    text += " " + levelToTimeUnit(div.level);
    return text;
}

function divideCounter(num: number, divider: number) {
    let divNum = num;
    let divLevel = 0;

    while ((divNum / divider) >= 1.0) {
        divNum = divNum / divider;
        divLevel++;
    }

    return { num: divNum, level: divLevel };
}

function levelToSizeUnit(level: number) {
    switch (level) {
        case 0: return "B"
        case 1: return "KB"
        case 2: return "MB"
        case 3: return "GB"
        case 4: return "TB"
        default: return "PB"
    }
}

function levelToTimeUnit(level: number) {
    switch (level) {
        case 0: return "seconds"
        case 1: return "minutes"
        default: return "hours"
    }
}

