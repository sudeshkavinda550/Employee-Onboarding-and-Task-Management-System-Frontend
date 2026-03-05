import { useState } from 'react';
import { ONBOARDING_TOOLS, executeTool } from '../tools/onboardingTools';

const SYSTEM_PROMPT = `You are an intelligent HR Onboarding Assistant connected to a live PostgreSQL employee database via a secure REST API.

You have tools to query real employee data. ALWAYS use tools — never guess or invent data.

CRITICAL RULES FOR UUIDs:
- Employee IDs are UUIDs (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
- NEVER use a name as an employee_id - always use find_employee_by_name first to get the UUID
- When a user says "Send reminder to John", you must:
  1. Call find_employee_by_name with "John" to get their UUID
  2. Call get_employee_tasks with that UUID to see what's pending
  3. Formulate a specific message with the actual pending tasks
  4. Call send_reminder with the UUID and your specific message

RULES:
- When asked about one person, call find_employee_by_name first, then get_employee_progress AND get_employee_tasks
- When asked who is behind or overdue, call get_employees_by_status with "overdue", then "not_started"
- When asked for a company overview, call get_company_analytics
- Before sending a reminder, ALWAYS find the UUID first, then get their pending tasks
- Format responses with bullet points when listing items
- If a tool returns an error, explain clearly and suggest checking the backend
`;

export function useAIAgent() {

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      text: `Hi! I'm your **Onboarding AI Assistant** 👋

I'm connected to your PostgreSQL database.

Ask me things like:
• Who is overdue on onboarding?
• Show company-wide progress stats
• What tasks are pending for John?
• Send reminder to employees
• Department analytics`,
      steps: []
    }
  ]);

  const [thinking, setThinking] = useState(false);
  const [history, setHistory] = useState([]);

  async function sendMessage(userText) {

    if (!userText.trim() || thinking) return;

    const API_KEY = process.env.REACT_APP_GROQ_API_KEY;

    if (!API_KEY) {
      alert("Groq API key missing. Check your .env file.");
      return;
    }

    setMessages(prev => [
      ...prev,
      { id: Date.now(), role: 'user', text: userText }
    ]);

    setThinking(true);

    const updatedHistory = [...history, { role: 'user', content: userText }];
    let workHistory = [...updatedHistory];
    const steps = [];
    let finalText = '';

    const MAX_LOOPS = 6;

    try {

      for (let loop = 0; loop < MAX_LOOPS; loop++) {

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",  
            temperature: 0.2,
            max_tokens: 1024,
            tools: ONBOARDING_TOOLS,
            tool_choice: "auto",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...workHistory
            ]
          })
        });

        const data = await res.json();

        if (!res.ok) {
          finalText = `Groq API error: ${data.error?.message || res.status}`;
          break;
        }

        const aiMsg = data?.choices?.[0]?.message;

        if (!aiMsg) {
          finalText = "AI returned an empty response.";
          break;
        }

        // No tool calls → final answer
        if (!aiMsg.tool_calls?.length) {

          finalText = aiMsg.content || "No response generated.";

          workHistory.push({
            role: "assistant",
            content: finalText
          });

          break;
        }

        // Tool calls exist
        workHistory.push({
          role: "assistant",
          content: aiMsg.content || "",
          tool_calls: aiMsg.tool_calls
        });

        for (const call of aiMsg.tool_calls) {

          const toolName = call.function.name;

          let toolArgs = {};

          try {
            toolArgs = JSON.parse(call.function.arguments || "{}");
          } catch {
            toolArgs = {};
          }

          const result = await executeTool(toolName, toolArgs);

          steps.push({
            tool: toolName,
            input: toolArgs,
            result
          });

          workHistory.push({
            role: "tool",
            tool_call_id: call.id,
            name: toolName,
            content: result
          });

        }

      }

    } catch (err) {

      finalText = `Network error: ${err.message}

Check:
1. Internet connection
2. Groq API key
3. Backend running at http://localhost:5000`;

    }

    setMessages(prev => [
      ...prev,
      {
        id: Date.now() + 1,
        role: "ai",
        text: finalText,
        steps
      }
    ]);

    setHistory(workHistory);
    setThinking(false);
  }

  function clearChat() {

    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        text: 'Chat cleared. How can I help with onboarding?',
        steps: []
      }
    ]);

    setHistory([]);
  }

  return {
    messages,
    thinking,
    sendMessage,
    clearChat
  };
}