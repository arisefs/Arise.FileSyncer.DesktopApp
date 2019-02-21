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
    return (progress.maximum - progress.current) / 1000;
}

export function getStep(progress: Progress, lastProgress: Progress) {
    if (progress.indeterminate || lastProgress.indeterminate) {
        return undefined;
    } else {
        return (progress.current - lastProgress.current) / 1000;
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
