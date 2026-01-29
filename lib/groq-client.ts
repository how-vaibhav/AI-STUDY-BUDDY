import { generateText, streamText } from 'ai';
import { groq } from '@ai-sdk/groq';

/**
 * Initialize Groq client with API key
 * Uses @ai-sdk/groq under the hood
 */

export interface GroqOptions {
	temperature?: number;
	maxTokens?: number;
	topP?: number;
	frequencyPenalty?: number;
	presencePenalty?: number;
}

const GROQ_MODEL = 'llama-3.1-8b-instant';

/**
 * Generate text using Groq API
 * Use this for non-streaming responses (summaries, short answers, etc.)
 */
export async function generateWithGroq(
	prompt: string,
	options: GroqOptions = {},
): Promise<string> {
	try {
		const {
			temperature = 0.7,
			maxTokens = 2000,
			topP = 1,
			frequencyPenalty = 0,
			presencePenalty = 0,
		} = options;

		const result = await generateText({
			model: groq(GROQ_MODEL),
			prompt,
			temperature,
			topP,
			frequencyPenalty: frequencyPenalty === 0 ? undefined : frequencyPenalty,
			presencePenalty: presencePenalty === 0 ? undefined : presencePenalty,
		});

		return result.text;
	} catch (error) {
		console.error('[Groq] Error generating text:', error);
		throw new Error(
			`Failed to generate response: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Stream text from Groq API
 * Use this for long responses where you want streaming updates
 */
export async function streamWithGroq(
	prompt: string,
	onChunk: (chunk: string) => void,
	options: GroqOptions = {},
): Promise<void> {
	try {
		const {
			temperature = 0.7,
			maxTokens = 2000,
			topP = 1,
			frequencyPenalty = 0,
			presencePenalty = 0,
		} = options;

		const stream = await streamText({
			model: groq(GROQ_MODEL),
			prompt,
			temperature,
			topP,
			frequencyPenalty: frequencyPenalty === 0 ? undefined : frequencyPenalty,
			presencePenalty: presencePenalty === 0 ? undefined : presencePenalty,
		});

		for await (const chunk of stream.textStream) {
			onChunk(chunk);
		}
	} catch (error) {
		console.error('[Groq] Error streaming text:', error);
		throw new Error(
			`Failed to stream response: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

/**
 * Generate a comprehensive study plan using Groq
 */
export async function generateStudyPlan(
	subject: string,
	exam: string,
	days: string,
	difficulty: string,
	topics: string,
): Promise<string> {
	const dayCount = parseInt(days) || 30;

	const prompt = `Act as a professional Academic Success Coach. Your task is to generate a comprehensive, high-density study plan and timetable.

STUDENT PROFILE:
- Subject: ${subject}
- Exam: ${exam}
- Topics to cover: ${topics}
- Duration: ${dayCount} days
- Daily Commitment: ${difficulty} hours per day

STRUCTURAL CONSTRAINTS (CRITICAL FOR UI PARSING):
- Use "## 1. OVERVIEW" for the introductory summary.
- Use "## 2. TOPIC-WISE STUDY APPROACH" for the strategy section.
- Use "## 3. DAILY ROUTINE" as the primary anchor for the schedule.
- Use "## 4. RESOURCES AND MOCK TESTS" for the final logistics.

---
SECTION REQUIREMENTS:

## 1. OVERVIEW
Provide a detailed summary of the plan's methodology and the expected learning outcomes.

## 2. TOPIC-WISE STUDY APPROACH
For each of the ${topics} topics, provide:
- **Importance**: Exam weightage.
- **Core Strategy**: How to tackle the theory vs. the numericals.
- **Learning Objectives**: Specific goals for this topic.

## 3. DAILY ROUTINE
Each day strictly must have their own routine and must not be excluded, repetition of the same routine is not allowed
For EACH day of the ${dayCount} days, you must provide (using "### Day [Number]" headers):
### Day [Number]: [Specific Topic]
- **Time Management & Break Schedule**: A slot-by-slot breakdown of the ${difficulty} hours, incorporating the Pomodoro technique (e.g., 50 mins study / 10 mins break).
- **Tasks**: Explicit instructions and practice problem counts.
- **Success Metric**: What the student must master before sleep.

## 4. RESOURCES AND MOCK TESTS
- **Study Resources Required**: List specific textbooks, YouTube channels, and online databases relevant to ${subject}.
- **Mock Test Schedule**: A specific calendar of when to take full-length vs. sectional tests.
- **Final Revision Strategy**: Instructions for the final 48 hours.

INSTRUCTIONS:
- Be verbose. Do not summarize.
- Ensure every day is accounted for individually.
- Maintain strict Markdown headers (## and ###) for parsing compatibility.
- Do not skip a number of days in the day by day routine and have a detailed plan for the day, if the topics are too less for the amount of days mentioned tell the user so, and do not write anything for the days after that, but do not summarize a group of days to a few words
- In case the number of topics is too small for the amount of days specified, refer to the syllabus of the exam they have mentioned and add topics related to the ones asked from the syllabus. The topics that the user has explicitly mentioned is to be used first and then the topics you might have chosen is to be used.

Generate the structured plan now:`;

	return generateWithGroq(prompt, {
		temperature: 0.8,
		maxTokens: 8000,
	});
}

/**
 * Solve a student's doubt with detailed explanation
 */
export async function solveDubt(
	question: string,
	subject: string,
	answerType: string,
	fileContext?: string | null,
): Promise<string> {
	let word_limit = '';
	let additionalNotes = '';

	switch (answerType) {
		case 'Short':
			word_limit = '100-200';
			break;
		case 'Medium':
			word_limit = '200-500';
			additionalNotes =
				'You do not need to focus on all topics equally and may choose which topics needs to be focused on.';
			break;
		case 'Long':
			word_limit = '500-1000';
			additionalNotes =
				'You do not need to focus on all topics equally and may choose which topics needs to be focused on. The topic should not feel under explained and should be communicated clearly.';
			break;
		case 'Detailed':
			word_limit = '1000+';
			additionalNotes =
				'You do not need to focus on all topics equally and may choose which topics needs to be focused on. The topic should not feel under explained and should be communicated clearly. Every topic must be completely understandable alone even if it need more explanation or you may reference your previous topics by clearly referencing them. The same point should not be repeated without valid reason. If your knowledge is limited  or is not updated you are to state so clearly. Feel free to change the topic names to better suit your explanation.';
			break;
		default:
			word_limit = '200-500';
	}

	let prompt = '';

	if (fileContext) {
		// When file context is provided - hybrid approach: file primary + external knowledge for clarity
		prompt = `You are an expert doubt solver combining reference materials with external knowledge for maximum clarity.

PRIMARY TASK:
- Answer the student's doubt by primarily referencing the PROVIDED REFERENCE MATERIALS below
- Enhance the explanation with external knowledge for better understanding
- Always cite which part of the reference material supports your answer
- If information is not in the materials, clearly indicate it as "external knowledge"

REFERENCE MATERIALS PROVIDED:
---
${fileContext}
---

STUDENT'S QUESTION: "${question}"
SUBJECT: ${subject}

ANSWER STRUCTURE (MANDATORY FORMAT):

1. **Quick Answer** (bullet points summary)
   - Use 3-5 key bullet points
   - Reference specific sections from the materials

2. **Detailed Explanation** (using provided materials)
   - Quote or paraphrase relevant sections from the materials
   - Explain how the material addresses the doubt
   - Use numbered list or bullet points

3. **Visual Representation** (if applicable)
   - Describe flowcharts, diagrams, or structures using:
     * ASCII art diagrams
     * Table formats
     * Tree structures
     * Step-by-step sequences
   - Reference where diagrams should be placed

4. **External Knowledge Enhancement** (if needed for clarity)
   - Provide additional context from general knowledge
   - Clearly mark as "Additional Context" or "Further Explanation"
   - Use this to fill gaps or clarify complex concepts

5. **Key Takeaways** (from materials)
   - 3-5 most important points from the reference materials
   - Bullet format for easy memorization

6. **Practical Application**
   - How can the concept from materials be applied?
   - Real-world examples or use cases

7. **Common Misconceptions**
   - Address any confusion based on material content
   - Clarify what the material actually says vs. misconceptions

FORMATTING REQUIREMENTS:
- Use markdown headers (###) for subsections
- Use **bold** for important terms
- Use bullet points (-) and numbered lists (1.) extensively
- Include tables where data comparison is needed
- Use \`code format\` for technical terms or formulas
- Create ASCII diagrams or describe visual structures

ANSWER LENGTH: ${word_limit} words (flexibility of 100 words)

${additionalNotes}

Now provide a comprehensive, well-structured answer:`;
	} else {
		// General doubt solving without file context
		prompt = `You are an expert doubt solver providing comprehensive, well-structured answers.

STUDENT'S QUESTION: "${question}"
SUBJECT: ${subject}

ANSWER STRUCTURE (MANDATORY FORMAT):

1. **Quick Answer**
   - Use 3-5 key bullet points with core concepts

2. **In-Depth Explanation**
   - Break down the concept step by step
   - Use numbered list or bullet points
   - Explain the "why" behind each point

3. **Visual Representation**
   - Describe flowcharts, diagrams, or structures using:
     * ASCII art diagrams
     * Table formats
     * Tree structures
     * Process flows

4. **Practical Examples**
   - 2-3 real-world examples
   - Show how the concept applies practically

5. **Key Formulas/Rules** (if applicable)
   - Important formulas in \`code format\`
   - Key rules and theorems highlighted

6. **Common Mistakes**
   - What students often get wrong
   - How to avoid these mistakes

7. **Practice Points**
   - Important concepts to remember
   - Tips for mastering this topic

FORMATTING REQUIREMENTS:
- Use markdown headers (###) for subsections
- Use **bold** for important terms and definitions
- Use bullet points (-) and numbered lists (1.) extensively
- Include tables for comparisons and data
- Use \`code format\` for technical terms, formulas, or code
- Create ASCII diagrams or describe visual structures
- Use blockquotes (>) for important notes

ANSWER LENGTH: ${word_limit} words (flexibility of 100 words)

${additionalNotes}

Now provide a comprehensive, well-structured answer:`;
	}

	return generateWithGroq(prompt, { temperature: 0.8, maxTokens: 3500 });
}

/**
 * Summarize study notes intelligently
 */
export async function summarizeNotes(
	notes: string,
	subject: string,
	examType: string,
): Promise<string> {
	const prompt = `You are an expert note summarizer specializing in creating exam-ready study materials. Your task is to create a comprehensive, well-structured, and professional summary of the provided notes/content.

CONTENT TO SUMMARIZE:
${notes}

SUMMARY REQUIREMENTS:
1. Extract and preserve ALL key points and important information
2. Organize content logically and hierarchically
3. Remove redundancy while keeping all crucial details
4. Maintain the flow and relationship between concepts
5. Create professional, exam-ready formatting
6. Use clear visual hierarchy for easy scanning

SUMMARY STRUCTURE (MANDATORY FORMAT):

## Overview

**Summary**: Provide a clear, concise overview of what the content covers
**Subject**: ${subject}
**Exam Type**: ${examType}
**Key Focus Areas**: List the main areas of focus in bullet points

---

## 1. Key Definitions and Concepts

Create a structured list of all important definitions and concepts:

**Concept 1**: Definition with clear explanation
- Related points
- Applications

**Concept 2**: Definition with clear explanation
- Related points
- Applications

---

## 2. Main Topics and Detailed Points

### Topic 1: [Title]

Key Points:
- **Important Point 1**: Detailed explanation with context
- **Important Point 2**: Detailed explanation with context
- **Important Point 3**: Detailed explanation with context

### Topic 2: [Title]

Key Points:
- **Important Point 1**: Detailed explanation with context
- **Important Point 2**: Detailed explanation with context

---

## 3. Key Relationships and Connections

**Cause and Effect Relationships**:
- [Concept A] leads to [Concept B]
- [Concept X] affects [Concept Y]

**Hierarchical Structure**:
- **Main Category**
  - Subcategory 1
  - Subcategory 2
    - Sub-subcategory

**Dependencies**: 
- [What depends on what] with clear explanations

---

## 4. Comparison and Analysis Tables

| Element | Feature 1 | Feature 2 | Important Note |
|---------|-----------|-----------|-----------------|
| **Item A** | Description | Description | Key point |
| **Item B** | Description | Description | Key point |
| **Item C** | Description | Description | Key point |

---

## 5. Practical Examples and Applications

### Example 1: [Real-world scenario]

**Situation**: Clear description of the scenario
**Application**: How the concept is applied here
**Outcome**: What this demonstrates or proves

### Example 2: [Real-world scenario]

**Situation**: Clear description of the scenario
**Application**: How the concept is applied here
**Outcome**: What this demonstrates or proves

---

## 6. Important Formulas, Laws, and Rules

**Formula 1: [Name/Title]**
\`\`\`
Formula = Component A + Component B
\`\`\`

**When to use**: Clear conditions and scenarios
**Components**: 
- **A** = [Definition and range]
- **B** = [Definition and range]
**Example calculation**: Show how to apply with numbers

**Important Rule 1: [Title]**

The rule states: [Complete rule statement]
- **When applicable**: Specific conditions
- **Exceptions**: Any exceptions to the rule
- **Importance**: Why this matters for exams

---

## 7. Common Misconceptions and Mistakes

**Misconception 1**: [Common wrong understanding]
- **Why it's wrong**: Clear explanation
- **Correct understanding**: What's actually true
- **How to remember**: Memory tip or way to avoid this

**Common Mistake**: [Frequent error in application]
- **What students do wrong**: Description
- **Correct approach**: How to do it properly
- **Why it matters**: Impact on exam performance

---

## 8. Exam Tips and Study Strategies

**High Priority Topics**: 
- Topic 1 - Likely to appear in ${examType}
- Topic 2 - Frequently tested concept
- Topic 3 - Important fundamental

**Medium Priority Topics**:
- Supporting concepts worth knowing
- Interconnected ideas

**Study Strategy**:
- First focus on the key definitions
- Then understand the relationships
- Practice with real examples
- Review formulas and their applications
- Test with practice problems

---

## 9. Quick Reference Checklist

Must Remember:
- Must know definition 1 and when to use it
- Must know definition 2 and its characteristics
- Must know how Concept A relates to Concept B
- Must be able to apply Formula 1 in problems
- Must avoid the common misconception 1
- Must remember the important rule and its exceptions
- Must be able to explain the practical application with examples

---

## 10. Visual Summary and Process Flow

**Process Flow**:
START
  |
  v
[Step 1: Understanding the concept]
  |
  v
[Step 2: Identifying relationships]
  |
  v
[Step 3: Applying formulas/rules]
  |
  v
[Step 4: Solving problems]
  |
  v
END

**Concept Connection Map**:
Central Concept connects to:
- Related Concept 1
- Related Concept 2
- Related Concept 3

Each of these connects back to show the complete picture

---

## 11. Final Summary for Revision

**In One Sentence**: [Concise statement of the main idea]

**Key Numbers/Values to Remember**:
- Important value 1: [Value and context]
- Important value 2: [Value and context]

**Most Important Takeaway**:
[The single most important concept or rule to remember for the exam]

---

FORMATTING INSTRUCTIONS:
- Use ## for main section headers
- Use ### for subsection headers
- Use **bold** for important terms that must be remembered
- Use bullet points (-) for lists
- Use numbered lists (1., 2., 3.) for processes
- Use blockquote (>) for important reminders
- Use tables for comparisons and structured data
- Use backticks for formulas and technical notation
- Use indentation for hierarchical relationships
- Keep layout clean and professional
- Ensure content is scannable for quick reference
- Make it suitable for exam preparation and revision

Now create a comprehensive, professional exam-ready summary that is well-organized, clearly structured, and focused on what students need to know for ${examType}:`;

	return generateWithGroq(prompt, {
		temperature: 0.7,
		maxTokens: 3500,
	});
}

/**
 * Extract key concepts from notes
 */
export async function extractKeyConceptsFromNotes(
	notes: string,
): Promise<string> {
	const prompt = `Extract and list all key concepts, definitions, and important terms from the following study notes. Format as a structured markdown list grouped by topic.

Notes:
${notes}

Provide:
1. Main concepts and definitions
2. Important formulas or theorems
3. Key relationships between concepts
4. Examples and applications`;

	return generateWithGroq(prompt, {
		temperature: 0.6,
		maxTokens: 1500,
	});
}
