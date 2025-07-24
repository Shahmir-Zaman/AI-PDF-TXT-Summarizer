import React from 'react';


const WEBHOOK_URL = 'https://n8n.shahmirzaman.dev/webhook/upload';

export const uploadFile = async (
  file: File,
  id: string,
  dispatch: React.Dispatch<any>
): Promise<void> => {
  try {
    // Client-side validation before upload
    console.log(`[DEBUG] Starting upload validation for file: ${file.name}`);

    // Check file size (5MB limit to be safe with server limits)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      throw new Error('📁 File is too large. Please upload a file smaller than 5MB.');
    }

    // Check if file is empty
    if (file.size === 0) {
      throw new Error('📄 File appears to be empty. Please upload a valid document.');
    }

    // Check file type more strictly
    const allowedTypes = ['application/pdf', 'text/plain', 'text/txt'];
    const allowedExtensions = ['.pdf', '.txt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
      throw new Error('📄 Invalid file type. Only PDF and TXT files are supported.');
    }

    // Check for suspicious file names
    if (file.name.includes('<') || file.name.includes('>') || file.name.includes('..')) {
      throw new Error('📄 Invalid file name. Please rename your file and try again.');
    }

    console.log(`[DEBUG] File validation passed for: ${file.name}`);

    // Update status to uploading
    dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'uploading' } });

    // Create FormData with the file
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileType', file.type);
    formData.append('fileId', id);

    console.log('Uploading file:', file.name, 'with ID:', id);

    // Send file to webhook
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: formData,
    });

    console.log('Upload response status:', response.status);
    console.log('Upload response headers:', Object.fromEntries(response.headers.entries()));

    // Handle different HTTP error statuses with user-friendly messages
    if (!response.ok) {
      let errorMessage = 'Upload failed';

      switch (response.status) {
        case 400:
          errorMessage = '❌ Invalid file format or corrupted file. Please try a different file.';
          break;
        case 401:
          errorMessage = '🔒 Authentication failed. Please refresh the page and try again.';
          break;
        case 403:
          errorMessage = '🚫 Access denied. You don\'t have permission to upload files.';
          break;
        case 404:
          errorMessage = '🔍 Upload service not found. Please contact support.';
          break;
        case 413:
          errorMessage = '📁 File too large. Please upload a smaller file (max 10MB).';
          break;
        case 415:
          errorMessage = '📄 Unsupported file type. Only PDF and TXT files are allowed.';
          break;
        case 429:
          errorMessage = '⏰ Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          errorMessage = '🔧 Server error. Our AI service is temporarily unavailable.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = '🌐 Service temporarily unavailable. Please try again in a few minutes.';
          break;
        default:
          errorMessage = `🚨 Upload failed with error ${response.status}. Please try again.`;
      }

      console.error(`[ERROR] HTTP ${response.status}: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // Read response as text first
    const responseText = await response.text();
    console.log('Raw response:', responseText);

    // Check if it's the "File Uploaded" confirmation (case insensitive)
    if (responseText.trim().toLowerCase() === 'file uploaded') {
      console.log('File uploaded successfully - waiting for AI to summarize');
      dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'uploaded' } });
      dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'processing' } });
      console.log(`[DEBUG] File ${id} moved to processing status - waiting for AI summary`);
      return;
    }

    // If response looks like a summary (JSON array or long text), handle it directly
    if (responseText.trim().startsWith('[') || responseText.length > 100) {
      console.log(`[DEBUG] Received what appears to be a summary directly from webhook for file ${id}`);
      console.log(`[DEBUG] Response length: ${responseText.length} characters`);
      console.log(`[DEBUG] Response starts with: ${responseText.substring(0, 50)}...`);

      dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'uploaded' } });
      dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'processing' } });

      let extractedSummary = '';

      // Check if response contains HTML/iframe content
      if (responseText.includes('<iframe') && responseText.includes('srcdoc=')) {
        console.log(`[DEBUG] Detected HTML iframe response, extracting srcdoc content for file ${id}`);
        
        // Extract content from srcdoc attribute
        const srcdocMatch = responseText.match(/srcdoc="([^"]*?)"/);
        if (srcdocMatch && srcdocMatch[1]) {
          // Decode HTML entities and clean up the content
          extractedSummary = srcdocMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, '/')
            .trim();
          
          console.log(`[DEBUG] Extracted summary from iframe srcdoc for file ${id}`);
          console.log(`[DEBUG] Extracted summary length: ${extractedSummary.length} characters`);
        } else {
          console.log(`[DEBUG] Could not extract srcdoc content, using full response for file ${id}`);
          extractedSummary = responseText.trim();
        }
      } else {
        // Try to parse JSON summary format: [{"text": "summary..."}]
        try {
          const jsonResponse = JSON.parse(responseText);
          console.log(`[DEBUG] Successfully parsed JSON response for file ${id}`);
          console.log(`[DEBUG] JSON structure:`, typeof jsonResponse, Array.isArray(jsonResponse));

          if (Array.isArray(jsonResponse) && jsonResponse.length > 0 && jsonResponse[0].text) {
            console.log(`[DEBUG] Found summary in expected JSON format for file ${id}`);
            console.log(`[DEBUG] Summary length: ${jsonResponse[0].text.length} characters`);
            extractedSummary = jsonResponse[0].text;
          } else {
            console.log(`[DEBUG] JSON not in expected format, treating as plain text for file ${id}`);
            extractedSummary = responseText.trim();
          }
        } catch (parseError) {
          console.log(`[DEBUG] Failed to parse JSON, treating as plain text for file ${id}:`, parseError);
          extractedSummary = responseText.trim();
        }
      }

      dispatch({ type: 'SET_FILE_SUMMARY', payload: { id, summary: extractedSummary } });
      return;
    }

    // For any other response, treat as plain text summary
    if (responseText.trim()) {
      console.log(`[DEBUG] Treating response as plain text summary for file ${id}`);
      console.log(`[DEBUG] Plain text response: "${responseText.trim()}"`);
      dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'uploaded' } });
      dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'processing' } });
      
      let cleanedSummary = responseText.trim();
      
      // Check if this plain text also contains HTML/iframe content
      if (cleanedSummary.includes('<iframe') && cleanedSummary.includes('srcdoc=')) {
        console.log(`[DEBUG] Plain text also contains iframe, extracting srcdoc content for file ${id}`);
        
        const srcdocMatch = cleanedSummary.match(/srcdoc="([^"]*?)"/);
        if (srcdocMatch && srcdocMatch[1]) {
          cleanedSummary = srcdocMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, '/')
            .trim();
          
          console.log(`[DEBUG] Extracted clean summary from plain text iframe for file ${id}`);
        }
      }
      
      dispatch({ type: 'SET_FILE_SUMMARY', payload: { id, summary: cleanedSummary } });
      return;
    }

    // If we get here, something unexpected happened
    throw new Error('Unexpected response from webhook');

  } catch (error) {
    console.error('[ERROR] Upload failed:', error);

    let userFriendlyError = '🚨 Upload failed. Please try again.';

    if (error instanceof Error) {
      // If it's already a user-friendly error message (from HTTP status handling)
      if (error.message.includes('❌') || error.message.includes('🔒') || error.message.includes('🚫') ||
        error.message.includes('🔍') || error.message.includes('📁') || error.message.includes('📄') ||
        error.message.includes('⏰') || error.message.includes('🔧') || error.message.includes('🌐') ||
        error.message.includes('🚨')) {
        userFriendlyError = error.message;
      }
      // Handle network errors
      else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        userFriendlyError = '🌐 Network error. Please check your internet connection and try again.';
      }
      // Handle timeout errors
      else if (error.message.includes('timeout')) {
        userFriendlyError = '⏰ Request timed out. The AI service might be busy. Please try again.';
      }
      // Handle CORS errors
      else if (error.message.includes('CORS') || error.message.includes('Access-Control-Allow-Origin')) {
        userFriendlyError = '🔒 CORS error: The server needs to allow requests from this website. Please contact support to configure CORS headers.';
      }
      // Handle file size errors (client-side)
      else if (error.message.includes('File too large')) {
        userFriendlyError = '📁 File is too large. Please upload a smaller file.';
      }
      // Handle unexpected webhook responses
      else if (error.message.includes('Unexpected response')) {
        userFriendlyError = '🤖 AI service returned an unexpected response. Please try again or contact support.';
      }
      // Generic error with some context
      else {
        userFriendlyError = `🚨 Upload failed: ${error.message}. Please try again.`;
      }
    }
    // Handle non-Error objects
    else if (typeof error === 'string') {
      userFriendlyError = `🚨 Upload failed: ${error}. Please try again.`;
    }

    console.error(`[ERROR] User will see: ${userFriendlyError}`);

    dispatch({
      type: 'UPDATE_FILE_STATUS',
      payload: {
        id,
        status: 'error',
        error: userFriendlyError
      }
    });
  }
};

