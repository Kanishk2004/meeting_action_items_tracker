import OpenAI from 'openai';

const MODEL = 'gpt-4.1-mini';

const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an assistant that extracts structured action items from meeting transcripts.
You will be given a raw transcript of a meeting, and your task is to identify and extract actionable tasks that were discussed.
Properly analyse the transcript to find clear action items, their owners, and due dates.

For each action item found, extract:
- "task" (string, required): A clear brief description of what needs to be done.
- "owner" (string or null): The person responsible. Use null if not mentioned.
- "dueDate" (string in ISO 8601 format or null): The deadline. Use null if not mentioned.

Return a JSON array of action items. If no action items are found, return an empty array [].

Rules:
- Only extract concrete, actionable tasks — not general discussions or opinions.
- If a due date is relative (e.g., "by next Friday"), convert it to an absolute ISO date based on today's date.
- Be concise in task descriptions.
- Do NOT wrap the output in markdown code blocks. Return raw JSON only.
- Ensure the output is valid JSON.

Example output:
[
  {
    "task": "Prepare the quarterly sales report",
    "owner": "John Smith",
    "dueDate": "2024-06-30"
  },
  {
    "task": "Schedule a follow-up meeting with the marketing team",
    "owner": null,
    "dueDate": null
  }
]
`;

/**
 * Extracts action items from a meeting transcript using OpenAI.
 * @param {string} transcript - The raw meeting transcript text.
 * @returns {Promise<Array<{task: string, owner: string|null, dueDate: string|null}>>}
 */
export async function extractActionItems(transcript) {
	const today = new Date().toISOString().split('T')[0];

	const response = await openai.chat.completions.create({
		model: MODEL,
		temperature: 0.2,
		messages: [
			{ role: 'system', content: SYSTEM_PROMPT },
			{
				role: 'user',
				content: `Today's date is ${today}.\n\nMeeting Transcript:\n${transcript}`,
			},
		],
	});

	const content = response.choices[0].message.content.trim();

	try {
		const items = JSON.parse(content);
		if (!Array.isArray(items)) {
			throw new Error('OpenAI response is not an array');
		}
		return items;
	} catch (error) {
		console.error('Failed to parse OpenAI response:', content);
		throw new Error('Failed to parse action items from AI response');
	}
}
