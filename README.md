<p align="center">
  <img src="./logo.png" alt="Learn By Typing logo" width="350">
</p>

# Learn By Typing

A typing-first language learning app.

I always had the idea that one of the best ways to learn a new language is to read a lot in that language and actively type it as well. When typing, you slow down just enough to notice spelling patterns, punctuation, and rhythm, and the repetition helps new words stick.

For that reason, I created this project: a simple German typing practice app that shows a German passage alongside its English translation.

## Tech Stack

- React + TypeScript
- Vite
- Biome (linting and formatting)
- Docker support

## Getting Started

Prerequisites:

- Node.js
- npm

## Docker

Run the application with Docker Compose:

```bash
docker-compose up
```

The app will be available at http://localhost:5173

## Development Tools

### Linting and Formatting

This project uses Biome for linting and formatting. Run the following commands:

```bash
# Check for linting/formatting issues
npm run lint

# Fix issues automatically
npm run format
```
