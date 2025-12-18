export const normalizeResponse = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => normalizeResponse(v));
    } else if (obj !== null && typeof obj === 'object') {
        // Handle Date objects and File objects by returning them as is
        if (obj instanceof Date || obj instanceof File) {
            return obj;
        }

        return Object.keys(obj).reduce((result, key) => {
            // Convert PascalCase key to camelCase
            // Handle special case like "ID" -> "id" if needed, but standard is "Id" -> "id"
            // Simple approach: lowercase first letter
            const camelKey = key.charAt(0).toLowerCase() + key.slice(1);

            return {
                ...result,
                [camelKey]: normalizeResponse(obj[key]),
            };
        }, {});
    }
    return obj;
};
