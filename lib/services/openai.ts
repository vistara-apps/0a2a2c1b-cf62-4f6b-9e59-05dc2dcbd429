import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GenerateLegalGuideParams {
  state: string;
  language?: string;
  scenario?: string;
}

export interface GenerateScriptParams {
  scenario: string;
  language?: string;
  state?: string;
  isAdvanced?: boolean;
}

export async function generateLegalGuide({
  state,
  language = 'en',
  scenario = 'general'
}: GenerateLegalGuideParams): Promise<string> {
  const prompt = `Generate a comprehensive, accurate legal rights guide for ${state} state regarding police interactions. 

Requirements:
- Focus on ${scenario} scenarios
- Language: ${language}
- Include specific state laws and procedures
- Format as markdown with clear sections
- Include practical advice and warnings
- Emphasize constitutional rights
- Keep content factual and legally sound
- Include disclaimer about consulting attorneys

Structure:
1. Your Rights in ${state}
2. What Police Can and Cannot Do
3. During Different Types of Interactions
4. Important State-Specific Laws
5. What to Do If Rights Are Violated
6. Emergency Contacts and Resources

Make it mobile-friendly and easy to read under stress.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a legal expert specializing in constitutional rights and police interaction law. Provide accurate, state-specific legal information while emphasizing the importance of professional legal counsel.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating legal guide:', error);
    throw new Error('Failed to generate legal guide');
  }
}

export async function generateScript({
  scenario,
  language = 'en',
  state,
  isAdvanced = false
}: GenerateScriptParams): Promise<string> {
  const advancedNote = isAdvanced ? 'Include advanced de-escalation techniques and legal terminology.' : 'Keep language simple and non-confrontational.';
  const stateNote = state ? `Consider ${state} state-specific laws and procedures.` : '';
  
  const prompt = `Generate a polite, effective communication script for a ${scenario} police interaction.

Requirements:
- Language: ${language}
- Tone: Respectful, calm, assertive about rights
- ${advancedNote}
- ${stateNote}
- Include specific phrases to use
- Avoid confrontational language
- Emphasize cooperation while protecting rights
- Include what NOT to say
- Keep it concise for high-stress situations

The script should help someone:
1. Stay calm and respectful
2. Assert their constitutional rights
3. Avoid self-incrimination
4. De-escalate the situation
5. Document the interaction appropriately`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert in police interaction training and constitutional rights. Create scripts that protect citizens while maintaining respectful communication with law enforcement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.2
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script');
  }
}

export async function generateRightsCard({
  state,
  scenario = 'general',
  language = 'en'
}: {
  state: string;
  scenario?: string;
  language?: string;
}): Promise<{
  title: string;
  content: string;
  summary: string;
}> {
  const prompt = `Create a shareable "Know Your Rights" card for ${state} state.

Requirements:
- Focus on ${scenario} interactions
- Language: ${language}
- Concise, social media friendly format
- Include key rights and phone numbers
- Add relevant hashtags
- Make it visually descriptive for card generation
- Include emergency contacts
- Add legal disclaimer

Format as JSON with:
- title: Catchy, informative title
- content: Main rights information (markdown)
- summary: One-sentence summary for social sharing`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are creating shareable legal rights content for social media. Make it accurate, concise, and engaging while maintaining legal precision.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      title: result.title || `${state} Rights Card`,
      content: result.content || '',
      summary: result.summary || `Know your rights during police interactions in ${state}`
    };
  } catch (error) {
    console.error('Error generating rights card:', error);
    throw new Error('Failed to generate rights card');
  }
}
