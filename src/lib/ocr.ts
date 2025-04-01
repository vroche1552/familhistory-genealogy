import { createWorker } from 'tesseract.js';
import { Document } from '@/types';

export class OCRService {
  private worker: Tesseract.Worker | null = null;

  async initialize() {
    if (!this.worker) {
      this.worker = await createWorker('fra+eng');
    }
  }

  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
    }
  }

  async processDocument(file: File): Promise<Document['ocrResults']> {
    await this.initialize();
    if (!this.worker) throw new Error('OCR worker not initialized');

    try {
      // Convert file to image data
      const imageData = await this.fileToImageData(file);
      
      // Perform OCR
      const { data: { text } } = await this.worker.recognize(imageData);
      
      // Generate summary using a simple algorithm (in a real app, use GPT or similar)
      const summary = this.generateSummary(text);
      
      // Extract key information
      const keyInfo = this.extractKeyInfo(text);

      return {
        fullText: text,
        summary,
        keyInfo,
      };
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw error;
    }
  }

  private async fileToImageData(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private generateSummary(text: string): string {
    // Simple summarization algorithm
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const importantSentences = sentences
      .filter(s => 
        s.includes('date') || 
        s.includes('birth') || 
        s.includes('death') || 
        s.includes('marriage') ||
        s.includes('family')
      )
      .slice(0, 3);

    return importantSentences.join('. ') + '.';
  }

  private extractKeyInfo(text: string): string[] {
    const keyInfo: string[] = [];
    
    // Extract dates
    const datePattern = /\b\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/g;
    const dates = text.match(datePattern);
    if (dates) {
      keyInfo.push(`Dates found: ${dates.join(', ')}`);
    }

    // Extract locations
    const locationPattern = /(?:in|at|from|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
    const locations = text.match(locationPattern);
    if (locations) {
      keyInfo.push(`Locations found: ${locations.join(', ')}`);
    }

    // Extract names (simple pattern)
    const namePattern = /(?:Mr\.|Mrs\.|Ms\.|Dr\.)\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*/g;
    const names = text.match(namePattern);
    if (names) {
      keyInfo.push(`Names found: ${names.join(', ')}`);
    }

    return keyInfo;
  }
} 