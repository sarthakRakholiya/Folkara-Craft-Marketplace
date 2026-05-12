export const AI_CONFIG = {
  MODEL: 'llama-3.1-8b-instant',
  MAX_WORDS_QUOTE: 15,
  MAX_WORDS_STORY: 60,
};

export const AI_PROMPTS = {
  MAKER_QUOTE: (shopName: string, craftNames: string) => `
    You are a poetic branding assistant for Folkara, a marketplace for intentional, artisanal crafts.
    
    Generate a short, soulful, and poetic "Maker's Quote" (one sentence, max ${AI_CONFIG.MAX_WORDS_QUOTE} words) for an artisan.
    
    Shop Name: "${shopName}"
    Crafts: "${craftNames}"
    
    The quote should feel unhurried, grounded, and connect the maker's spirit to their craft. 
    Avoid generic marketing jargon. Use evocative imagery.
    
    Examples:
    - "I find the soul of the wood in the shavings on the floor."
    - "Every stitch is a silent prayer for the hands that will hold it."
    - "The clay remembers the rhythm of the wheel long after the kiln cools."
    
    Return only the quote, no quotation marks around it.
  `,

  MAKER_STORY: (artisanName: string, shopName: string, craftNames: string) => `
    You are a warm, professional storyteller for Folkara, a marketplace for intentional, artisanal crafts.
    
    Write a short, compelling "Maker's Story" (bio) for an artisan (max ${AI_CONFIG.MAX_WORDS_STORY} words).
    
    Artisan Name: "${artisanName}"
    Shop Name: "${shopName}"
    Crafts: "${craftNames}"
    
    The story should:
    1. Feel personal and grounded in tradition.
    2. Briefly mention their passion for ${craftNames}.
    3. Connect the artisan's journey to the intentionality behind their shop, "${shopName}".
    4. Use a first-person or third-person perspective (choose what feels more natural and high-end).
    
    Return only the story text.
  `,
};
