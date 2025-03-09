
// Utility functions for AI services (transcription and analysis)

interface FlashcardItem {
  translation: string;
  word: string;
}

// Function to transcribe video using Groq's Whisper AI
export async function transcribeVideo(videoFile: File): Promise<string> {
  try {
    // Create a FormData object to send the video file
    const formData = new FormData();
    formData.append('file', videoFile);
    formData.append('model', 'whisper-large-v3');
    
    // Make API request to Groq's Whisper endpoint
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_GROQ_API_KEY || ''}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Transcription failed: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    return data.text || '';
  } catch (error) {
    console.error('Error during transcription:', error);
    throw new Error('Failed to transcribe video');
  }
}

// Function to analyze transcript and generate flashcards using Gemini AI
export async function generateFlashcards(transcript: string): Promise<FlashcardItem[]> {
  try {
    const prompt = `
    Analyze this transcript from an English conversation practice and create flashcards for new words or terms that might be useful for a language learner.
    
    Transcript:
    ${transcript}
    
    Create flashcards in the following format:
    translation to pt-BR of the new word/term learned in the conversation #flashcard #ingles
    new word/term learned in English
    
    Extract at least 3 and at most 10 interesting vocabulary terms from the transcript.
    `;
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.VITE_GEMINI_API_KEY || '',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Flashcard generation failed: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text || '';
    
    // Parse the generated text into flashcard items
    const flashcards: FlashcardItem[] = [];
    const lines = generatedText.split('\n').filter(line => line.trim() !== '');
    
    for (let i = 0; i < lines.length; i += 2) {
      if (i + 1 < lines.length) {
        flashcards.push({
          translation: lines[i].replace(/#flashcard|#ingles/g, '').trim(),
          word: lines[i + 1].trim(),
        });
      }
    }
    
    return flashcards;
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error('Failed to generate flashcards');
  }
}

// Function to send flashcards to the webhook
export async function sendFlashcardsToWebhook(flashcards: FlashcardItem[], transcript: string): Promise<boolean> {
  try {
    const response = await fetch('https://wk0.growanalytica.com/webhook/personal-assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        flashcards,
        transcript,
        timestamp: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to send data: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending flashcards to webhook:', error);
    throw new Error('Failed to send flashcards to webhook');
  }
}
