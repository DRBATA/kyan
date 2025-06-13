import OpenAI from 'openai';
import { supabase } from './supabase-client';

// Initialize OpenAI client - replace with your actual API key
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || 'your-openai-key',
  dangerouslyAllowBrowser: true // Only for prototyping, move to API routes in production
});

// Define types for the wellness journey
export type HealingModality = 
  | 'sound_therapy'
  | 'breathwork'
  | 'hydration'
  | 'meditation'
  | 'movement';

export type WellnessIntent = 
  | 'relaxation'
  | 'energy'
  | 'focus'
  | 'balance'
  | 'clarity';

export type JourneyStage = 
  | 'discovery'
  | 'exploration'
  | 'practice'
  | 'integration'
  | 'transformation';

export interface WellnessContext {
  userProfile: any;
  currentModality?: HealingModality;
  currentIntent?: WellnessIntent;
  stage: JourneyStage;
  pastInteractions: any[];
}

// Helper to save interactions to Supabase
async function saveInteraction(userId: string, prompt: string, response: string, context: any) {
  return supabase.from('journey_interactions').insert([{
    user_id: userId,
    prompt,
    response,
    context,
    created_at: new Date()
  }]);
}

// Generate a personalized journey response
export async function generateJourneyResponse(
  userId: string,
  prompt: string,
  context: WellnessContext
): Promise<{ content: string, suggestedActions: string[] }> {
  try {
    // Build the system context from user history and preferences
    const systemPrompt = `You are a compassionate wellness guide helping users explore healing frequencies and modalities. 
    Current context:
    - User's wellness archetype: ${context.userProfile.archetype || 'Unknown'}
    - Current healing modality focus: ${context.currentModality || 'Open exploration'}
    - User's stated intention: ${context.currentIntent || 'General wellness'}
    - Journey stage: ${context.stage}
    
    Your role is to gently guide the user through their personal wellness journey, not as a game but as an authentic exploration.
    Always be truthful, grounded, and evidence-based in your suggestions while maintaining a sense of wonder about the potential for transformation.
    Focus on creating moments of reflection, offering practical techniques, and suggesting real experiences that could enhance wellbeing.
    When appropriate, mention opportunities to book in-person experiences at The Water Bar's upcoming event on Sunday, June 29th.`;

    // Generate the AI response
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...context.pastInteractions.slice(-5).map(interaction => ({
          role: interaction.isUser ? "user" : "assistant",
          content: interaction.content
        })),
        { role: "user", content: prompt }
      ],
      functions: [
        {
          name: "suggest_next_steps",
          description: "Suggests possible next steps or actions for the user's wellness journey",
          parameters: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "The main response content"
              },
              suggested_actions: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "2-3 suggestions for what the user might explore next"
              }
            },
            required: ["content", "suggested_actions"]
          }
        }
      ],
      function_call: { name: "suggest_next_steps" }
    });

    // Parse the function call result
    const functionCall = completion.choices[0].message.function_call;
    const functionResult = functionCall ? JSON.parse(functionCall.arguments) : null;
    
    // Save the interaction to Supabase
    await saveInteraction(userId, prompt, functionResult?.content || '', {
      modality: context.currentModality,
      intent: context.currentIntent,
      stage: context.stage
    });

    return {
      content: functionResult?.content || "I'm here to guide you on your wellness journey.",
      suggestedActions: functionResult?.suggested_actions || []
    };
  } catch (error) {
    console.error("Error generating journey response:", error);
    return {
      content: "I'm having trouble connecting to the wellness frequencies right now. Let's try again in a moment.",
      suggestedActions: ["Take a deep breath", "Try a different question", "Explore a new modality"]
    };
  }
}
