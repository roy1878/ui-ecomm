import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private readonly SECRET_KEY = 'ecommerce-secret-key-2024'; // Change this to a more secure key

  constructor() {}

  encrypt(data: any): string {
    try {
      const stringified = typeof data === 'string' ? data : JSON.stringify(data);
      return CryptoJS.AES.encrypt(stringified, this.SECRET_KEY).toString();
    } catch (error) {
      console.error('Encryption failed:', error);
      return '';
    }
  }

  decrypt(encryptedData: string): any {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY).toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      return null;
    }
  }

  decryptToString(encryptedData: string): string {
    try {
      return CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }
}
