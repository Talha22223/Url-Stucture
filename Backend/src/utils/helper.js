import { nanoid } from "nanoid";

export const generateNanoid = (length) => {
    try {
        if (!length || length <= 0) {
            throw new Error('Length must be a positive number');
        }
        
        if (length > 21) {
            throw new Error('Length cannot be greater than 21');
        }
        
        return nanoid(length);
    } catch (error) {
        console.error('Error in generateNanoid:', error.message);
        throw error;
    }
}