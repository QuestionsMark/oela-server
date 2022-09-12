export const maxLimit = (limit: number): number => {
    return limit <= 100 ? limit : 100;
};