## Overview

This project was built with structured assistance from AI tools during development. AI was used as a productivity accelerator, not as an autonomous coding system. All architectural decisions, validations, and final implementations were reviewed and verified manually.

---

## How AI Was Used

AI was primarily used for:

- Refining and improving code after the initial folder structure and development plan were created
- Suggesting optimizations and cleaner patterns for API routes and database models
- Assisting in drafting structured prompts for extracting action items from transcripts
- Improving error handling and response formatting logic
- Identifying potential edge cases in transcript parsing and AI response validation

The initial backend structure, database schema decisions, and application workflow were designed first. AI was then used to iterate and fine-tune implementations.

---

## What Was Verified Manually

Every AI-generated output was:

- Reviewed line-by-line before integration
- Tested locally before being committed
- Adjusted where necessary for correctness and clarity
- Validated against real API responses
- Checked for proper MongoDB interactions and error handling

No AI-generated code was accepted without verification.

Prompt outputs from the LLM were also manually tested to ensure:

- Strict JSON formatting
- Correct field extraction
- Graceful handling of missing owners or due dates

---

## LLM Provider Used

**Provider:** OpenAI  
**Model:** `gpt-4.1-mini`  
**Integration:** Official OpenAI API

### Why This Model Was Chosen

The `gpt-4.1-mini` model was selected because:

- It provides reliable structured JSON output
- It offers strong reasoning capabilities for extracting action items from conversational transcripts
- It is cost-efficient for repeated API usage
- It delivers low latency suitable for interactive applications

The model was used specifically for extracting structured action items from raw meeting transcripts.

---

## AI Usage Philosophy

AI was used as a development assistant, not a replacement for understanding. All design decisions, debugging, and validation were performed manually to ensure correctness, maintainability, and production-readiness.

The goal was to accelerate iteration while maintaining full ownership of the codebase and architecture.
