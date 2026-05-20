"use server";

import { generateText } from 'ai';
import { quickModel } from '@/constants/ai';
import { CRAFT_OPTIONS } from '../../onboarding/constants/onboarding.constants';
import { AI_CONFIG, AI_PROMPTS } from '../constants/aiPrompt.constants';
import { withAuthAction } from '@/lib/actionMiddleware';

/**
 * Generates a maker quote based on shop name and crafts.
 */
export const generateMakerQuote = withAuthAction(
  async ({ session }, { shopName, craftIds }: { shopName: string; craftIds: string[] }) => {
    if (!shopName) throw new Error('Shop name is required');
    
    const craftNames = craftIds
      .map(id => CRAFT_OPTIONS.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const { text } = await generateText({
      model: quickModel,
      prompt: AI_PROMPTS.MAKER_QUOTE(shopName, craftNames),
    });

    return { success: true, data: text.trim() };
  }
);

/**
 * Generates a maker story.
 */
export const generateMakerStory = withAuthAction(
  async ({ session }, { shopName, craftIds, artisanName }: { shopName: string; craftIds: string[]; artisanName: string }) => {
    if (!shopName || !artisanName) throw new Error('Shop name and artisan name are required');
    
    const craftNames = craftIds
      .map(id => CRAFT_OPTIONS.find(c => c.id === id)?.name)
      .filter(Boolean)
      .join(', ');

    const { text } = await generateText({
      model: quickModel,
      prompt: AI_PROMPTS.MAKER_STORY(artisanName, shopName, craftNames),
    });

    return { success: true, data: text.trim() };
  }
);
