'use client';

let pdfjsLib: any = null;

/**
 * Lazy load pdfjs-dist only when needed (client-side)
 */
async function getPDFLib() {
	if (pdfjsLib === null) {
		pdfjsLib = await import('pdfjs-dist');
	}
	return pdfjsLib;
}

/**
 * Initialize PDF.js worker - must be called before any PDF processing
 */
export async function initializePDFWorker() {
	if (typeof window !== 'undefined') {
		const lib = await getPDFLib();
		lib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
	}
}

/**
 * Extract text from a PDF file (as ArrayBuffer)
 */
export async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
	try {
		// Initialize worker before processing
		await initializePDFWorker();
		
		const lib = await getPDFLib();
		const pdf = await lib.getDocument({ data: arrayBuffer }).promise;
		let fullText = '';

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			const pageText = textContent.items
				.map((item: any) => item.str)
				.join(' ');
			fullText += `\n[Page ${i}]\n${pageText}`;
		}

		return fullText.trim();
	} catch (error) {
		console.error('Error extracting PDF text:', error);
		throw new Error('Failed to extract text from PDF');
	}
}

/**
 * Extract text from image (PNG) - returns filename as reference since we can't directly read image content
 */
export function extractTextFromImage(filename: string): string {
	return `[Image file: ${filename}]\nNote: Image content cannot be directly processed. Please describe the image content or upload the image as a reference document.`;
}

/**
 * Process uploaded file based on its type
 */
export async function processUploadedFile(
	file: File,
	content: string | ArrayBuffer,
): Promise<string> {
	try {
		if (file.type === 'application/pdf') {
			return await extractTextFromPDF(content as ArrayBuffer);
		} else if (file.type === 'text/plain') {
			return content as string;
		} else if (file.type === 'image/png') {
			return extractTextFromImage(file.name);
		}
		return content as string;
	} catch (error) {
		throw new Error(`Failed to process file ${file.name}: ${error}`);
	}
}

/**
 * Format multiple file contents for better readability in prompts
 */
export function formatFileContextForPrompt(files: Array<{name: string; content: string}>): string {
	if (files.length === 0) return '';

	const formattedFiles = files
		.map((file) => {
			return `## File: ${file.name}\n${file.content}\n---`;
		})
		.join('\n\n');

	return `### REFERENCE MATERIALS PROVIDED:\n\n${formattedFiles}`;
}
