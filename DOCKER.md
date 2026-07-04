# ResumeFlow Docker Development Guide

This guide describes how to run ResumeFlow inside Docker for local development.

## Prerequisites

- Docker Engine & Docker Compose installed.

## Getting Started

1. **Build and Start Services**:

   ```bash
   docker-compose up --build
   ```

2. **Accessing the App**:

   - Web application: [http://localhost:3000](http://localhost:3000)
   - PostgreSQL Database: `localhost:5432` (credentials: `postgres`/`postgres`)
   - Redis Cache: `localhost:6379`

3. **Shutdown Services**:
   ```bash
   docker-compose down
   ```
