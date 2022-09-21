export const skip = (page: number, limit: number) => {
    return (Number.isNaN(page) ? 1 : page - 1) * (Number.isNaN(limit) ? 10 : limit);
};