export const ErrUserNotFound: Error = new Error('user not found');

export const ErrWrongPassword: Error = new Error('wrong password');

export const ErrInvalidToken: Error = new Error(' invalid token');

export function throwValidationError(field: string) {
    throw new Error(`validation failed, ${field} not valid`);
}

export const ErrObjectNotFound = new Error('object not found');

export const ErrOpanAINotAvailable = new Error('openai not available');
