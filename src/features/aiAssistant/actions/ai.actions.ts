'use server';

import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';
import { CRAFT_OPTIONS } from '../../onboarding/constants/onboarding.constants';
import { AI_CONFIG, AI_PROMPTS } from '../constants/aiPrompt.constants';

export async function generateMakerQuote(shopName: string, craftIds: string[]) {
  if (!shopName) return { error: 'Shop name is required' };
  
  const craftNames = craftIds
    .map(id => CRAFT_OPTIONS.find(c => c.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  try {
    const { text } = await generateText({
      model: groq(AI_CONFIG.MODEL),
      prompt: AI_PROMPTS.MAKER_QUOTE(shopName, craftNames),
    });

    return { success: true, quote: text.trim() };
  } catch (error) {
    console.error('AI Generation Error:', error);
    return { error: 'Failed to generate quote. Please try again.' };
  }
}

export async function generateMakerStory(shopName: string, craftIds: string[], artisanName: string) {
  if (!shopName || !artisanName) return { error: 'Shop name and artisan name are required' };
  
  const craftNames = craftIds
    .map(id => CRAFT_OPTIONS.find(c => c.id === id)?.name)
    .filter(Boolean)
    .join(', ');

  try {
    const { text } = await generateText({
      model: groq(AI_CONFIG.MODEL),
      prompt: AI_PROMPTS.MAKER_STORY(artisanName, shopName, craftNames),
    });

    return { success: true, story: text.trim() };
  } catch (error) {
    console.error('AI Story Generation Error:', error);
    return { error: 'Failed to generate story. Please try again.' };
  }
}
