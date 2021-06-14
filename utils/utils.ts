const replaceAt = (text: string, startIndex: number, endIndex: number, replacement: string): string | undefined => {
    if(text === undefined) {
        return undefined;
    }

    return text.substr(0, startIndex) + replacement + text.substr(endIndex);
};

const formatCurrency = (num: number | string): string => {
    if (num === undefined || num === null ) {
        return '$0';
    }
    
    const floatNum = parseFloat(num.toString());
    return '$' + floatNum.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

const formatDate = (date: string): string => {
    const setDate  = new Date(date);
    
    return setDate.toLocaleDateString('en-US');
};

export default {
    replaceAt,
    formatCurrency,
    formatDate
};