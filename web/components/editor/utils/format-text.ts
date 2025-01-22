export function formatAIResponse(text: string): string {
  try {
    // Initial cleanup
    const sections = text
      .split('##')
      .filter(Boolean)
      .map((section) => section.trim());

    return sections
      .map((section) => {
        // Split heading and content
        const lines = section.split('\n');
        const heading = lines[0].trim();
        let content = lines.slice(1).join(' ').trim();

        // Format bullet points while preserving bold text
        content = content
          // Fix bold text
          .replace(/\*\*(.*?)\*\*/g, '**$1**')
          // Format bullet points
          .replace(/\* /g, '\n• ')
          // Clean reference brackets
          .replace(/\[(\d+)\]/g, ' [$1] ')
          // Fix multi spaces
          .replace(/\s+/g, ' ')
          .trim();

        // Add proper spacing and structure
        return `## ${heading}\n\n${content}`;
      })
      .join('\n\n');
  } catch (error) {
    console.error('Error in formatting:', error);
    return text;
  }
}

export default formatAIResponse;
