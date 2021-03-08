const replaceAt = (text: string, startIndex: number, endIndex: number, replacement: string): string | undefined => {
    if(text === undefined) {
        return undefined;
    }

    return text.substr(0, startIndex) + replacement + text.substr(endIndex);
};

export default {
    replaceAt
};