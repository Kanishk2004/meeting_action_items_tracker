# Meeting Action Items Tracker

A web app that extracts structured action items from meeting transcripts using AI. Paste a transcript, get actionable tasks with owners and deadlines — then edit, complete, or delete them.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **AI:** OpenAI GPT-4.1-mini
- **Database:** MongoDB (Mongoose)
- **Styling:** Tailwind CSS 4

## Features

- Paste a meeting transcript and extract action items via AI
- Each action item includes: task, owner, due date, status
- Edit, delete, and mark action items as done
- View the last 5 processed transcripts with their action items
- System status page (backend, database, LLM health check)
- Interactive product walkthrough for first-time users

## Getting Started

### Prerequisites

- Node.js ≥ 20
- MongoDB instance (local or Atlas)
- OpenAI API key

### Setup

1. Clone the repo:

```bash
git clone https://github.com/kanishk2004/meeting_action_items_tracker.git
cd meeting_action_items_tracker
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the root:

```
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
```

4. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/extract` | Submit transcript → extract & save action items |
| GET | `/api/transcripts` | Get last 5 transcripts with action items |
| GET | `/api/transcripts/:id` | Get a single transcript with its action items |
| GET | `/api/action-items` | List action items (optional `?transcriptId=` filter) |
| PUT | `/api/action-items/:id` | Update an action item (task, owner, dueDate, status) |
| DELETE | `/api/action-items/:id` | Delete an action item |
| GET | `/api/health` | System health check (backend, DB, LLM) |

## Project Structure

```
src/
├── app/
│   ├── page.js                  # Home — paste transcript & extract
│   ├── history/page.js          # Last 5 transcripts
│   ├── transcript/[id]/page.js  # Transcript detail with action items
│   ├── status/page.js           # System health dashboard
│   └── api/                     # API routes
├── components/                  # Reusable UI components
├── lib/
│   ├── ai.js                    # OpenAI integration
│   └── db.js                    # MongoDB connection
└── models/                      # Mongoose schemas
```

## Author

**Kanishk Chandna**
- [GitHub](https://github.com/kanishk2004)
- [LinkedIn](https://linkedin.com/in/kanishk-chandna)
- [Blog](https://blogs.kanishk.codes)
- [Email](mailto:kanishkchandna29@gmail.com)
