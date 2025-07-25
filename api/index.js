const { HfInference } = require('@huggingface/inference');

// Inisialisasi Hugging Face Inference dengan token dari Environment Variables
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

module.exports = async (req, res) => {
  // Mengatur header CORS secara manual untuk keamanan maksimum
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const result = await hf.sentimentAnalysis({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: text,
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Hugging Face API error:', error);
    res.status(500).json({ error: 'Failed to analyze sentiment', details: error.message });
  }
};
