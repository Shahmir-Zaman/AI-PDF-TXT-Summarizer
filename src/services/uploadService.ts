import React from 'react';

const WEBHOOK_URL = 'https://n8n.shahmirzaman.dev/webhook-test/upload';

export const uploadFile = async (
  file: File,
  id: string,
  dispatch: React.Dispatch<any>
): Promise<void> => {
  try {
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

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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

      // Try to parse JSON summary format: [{"text": "summary..."}]
      try {
        const jsonResponse = JSON.parse(responseText);
        console.log(`[DEBUG] Successfully parsed JSON response for file ${id}`);
        console.log(`[DEBUG] JSON structure:`, typeof jsonResponse, Array.isArray(jsonResponse));

        if (Array.isArray(jsonResponse) && jsonResponse.length > 0 && jsonResponse[0].text) {
          console.log(`[DEBUG] Found summary in expected JSON format for file ${id}`);
          console.log(`[DEBUG] Summary length: ${jsonResponse[0].text.length} characters`);
          dispatch({ type: 'SET_FILE_SUMMARY', payload: { id, summary: jsonResponse[0].text } });
        } else {
          console.log(`[DEBUG] JSON not in expected format, treating as plain text for file ${id}`);
          dispatch({ type: 'SET_FILE_SUMMARY', payload: { id, summary: responseText.trim() } });
        }
      } catch (parseError) {
        console.log(`[DEBUG] Failed to parse JSON, treating as plain text for file ${id}:`, parseError);
        dispatch({ type: 'SET_FILE_SUMMARY', payload: { id, summary: responseText.trim() } });
      }
      return;
    }

    // For any other response, treat as plain text summary
    if (responseText.trim()) {
      console.log(`[DEBUG] Treating response as plain text summary for file ${id}`);
      console.log(`[DEBUG] Plain text response: "${responseText.trim()}"`);
      dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'uploaded' } });
      dispatch({ type: 'UPDATE_FILE_STATUS', payload: { id, status: 'processing' } });
      dispatch({ type: 'SET_FILE_SUMMARY', payload: { id, summary: responseText.trim() } });
      return;
    }

    // If we get here, something unexpected happened
    throw new Error('Unexpected response from webhook');

  } catch (error) {
    console.error('Upload failed:', error);
    dispatch({
      type: 'UPDATE_FILE_STATUS',
      payload: {
        id,
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed'
      }
    });
  }
};

