import * as crypto from 'crypto';

/**
 * Generates a secure random password of specified length.
 * Includes at least one uppercase letter, one lowercase letter, one number, and one symbol.
 */
export function generateSecurePassword(length: number = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    // Ensure at least one of each required type
    let password = '';
    password += uppercase[crypto.randomInt(0, uppercase.length)];
    password += lowercase[crypto.randomInt(0, lowercase.length)];
    password += numbers[crypto.randomInt(0, numbers.length)];
    password += symbols[crypto.randomInt(0, symbols.length)];
    
    // Fill the rest of the length
    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = password.length; i < length; i++) {
        password += allChars[crypto.randomInt(0, allChars.length)];
    }
    
    // Shuffle the string to make it visually random
    return password.split('').sort(() => 0.5 - Math.random()).join('');
}
