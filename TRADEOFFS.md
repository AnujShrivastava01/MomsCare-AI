# ⚖️ TRADEOFFS.md - Architectural Decisions & Tradeoffs

## 🎯 Why this problem?
I chose the Customer Support Triage problem because it is high-impact for e-commerce (like Mumzworld), requires structured AI output for system integration, and allows for clear evaluation and failure detection.

## 🧠 Architecture Decisions
- **LLM + Structured Prompting**: Used instead of fine-tuning for faster iteration, lower cost, and easier prompt-level adjustments.
- **JSON Schema Enforcement**: Ensures outputs are always production-ready and can be directly consumed by frontend components or CRMs.
- **Confidence Scoring**: Built-in uncertainty quantification to improve trust and allow for "Escalate to Human" triggers.

## ⚖️ Tradeoffs
- **No Fine-tuning**: Chosen for faster speed-to-market. While fine-tuning could improve domain-specific jargon, prompt engineering proved sufficient for 90% of cases.
- **Mock DB Integration**: To keep the scope within the 5-hour limit, I focused on the AI logic and UI quality rather than database plumbing.
- **Prompt Engineering vs Agents**: Strict prompts are more reliable and predictable for customer-facing support than autonomous agents which can be non-deterministic.

## ⚠️ Known Limitations
- **Token Limits**: Cannot handle extremely long email chains (>4000 tokens) without summarization.
- **Cultural Nuance**: Certain regional Arabic dialects may still be perceived as slightly formal.
- **Integration**: Currently lacks a real backend connection to Order Databases or CRM systems.

## 🔮 What I would build next
1. **RAG with Order Database**: Allow the AI to check real-time order statuses.
2. **Automated Workflows**: Trigger actual refund or exchange processes for low-risk, high-confidence cases.
3. **Feedback Loop**: A UI for support agents to rate/correct AI responses, feeding back into the system for improvement.
