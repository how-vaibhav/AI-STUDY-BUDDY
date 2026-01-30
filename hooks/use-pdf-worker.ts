'use client';

import { useEffect } from 'react';

/**
 * Hook to initialize PDF.js worker on the client side
 * Must be called in a client component before PDF processing
 */
export function usePDFWorker() {
	useEffect(() => {
		// Dynamically import and setup worker in browser environment
		if (typeof window !== 'undefined') {
			(async () => {
				try {
					const pdfjsLib = await import('pdfjs-dist');
					pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
				} catch (error) {
					console.error('Failed to initialize PDF worker:', error);
				}
			})();
		}
	}, []);
}

/**
 * Initialize PDF worker immediately (for non-component usage)
 */
export async function initPDFWorker() {
	if (typeof window !== 'undefined') {
		try {
			const pdfjsLib = await import('pdfjs-dist');
			if (pdfjsLib.GlobalWorkerOptions.workerSrc !== '/pdf.worker.min.js') {
				pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
			}
		} catch (error) {
			console.error('Failed to initialize PDF worker:', error);
		}
	}
}

