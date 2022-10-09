export const maxLimit = (limit: number): number => {
    if (Number.isNaN(Number(limit))) return 10;
    return limit <= 100 ? limit : 100;
};

export const skip = (page: number, limit: number) => {
    return (Number.isNaN(Number(page)) ? 0 : Number(page) - 1) * (Number.isNaN(Number(limit)) ? 10 : Number(limit));
};