import { RunnableSequence, RunnableMap } from '@langchain/core/runnables';
import ListLineOutputParser from '../lib/outputParsers/listLineOutputParser';
import { PromptTemplate } from '@langchain/core/prompts';
import formatChatHistoryAsString from '../utils/formatHistory';
import { BaseMessage } from '@langchain/core/messages';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ChatOpenAI } from '@langchain/openai';

const suggestionGeneratorPrompt = `
You are an AI research assistant specializing in generating targeted suggestions for academic papers. When provided with source materials or websites, analyze the content and conversation history to produce 3 relevant research directions that help users expand their paper. Follow these guidelines:

1. Focus on identifying under-explored angles or emerging trends within the provided sources
2. Format suggestions as complete sentences using academic language
3. Prioritize actionable recommendations (e.g., "Compare X and Y methodologies...")
4. Include specific domains/technologies mentioned in the sources
5. Maintain 15-25 word length per suggestion

<suggestions>
Explore how [specific technology] from [source document] could address limitations in [related domain] identified by recent studies.
Analyze the ethical implications of [source concept] using the framework discussed in [author's] seminal paper on AI governance.
Investigate potential applications of [source methodology] in [adjacent field] through comparative case studies of [example A] and [example B].
</suggestions>

Conversation Context: {chat_history}
`;

type SuggestionGeneratorInput = {
  chat_history: BaseMessage[];
};

const outputParser = new ListLineOutputParser({
  key: 'suggestions',
});

const createSuggestionGeneratorChain = (llm: BaseChatModel) => {
  return RunnableSequence.from([
    RunnableMap.from({
      chat_history: (input: SuggestionGeneratorInput) =>
        formatChatHistoryAsString(input.chat_history),
    }),
    PromptTemplate.fromTemplate(suggestionGeneratorPrompt),
    llm,
    outputParser,
  ]);
};

const generateSuggestions = (
  input: SuggestionGeneratorInput,
  llm: BaseChatModel,
) => {
  (llm as unknown as ChatOpenAI).temperature = 0;
  const suggestionGeneratorChain = createSuggestionGeneratorChain(llm);
  return suggestionGeneratorChain.invoke(input);
};

export default generateSuggestions;
