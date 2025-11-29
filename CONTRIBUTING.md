# Contributing to Agent M

Thank you for considering contributing to Agent M! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (treating everyone with respect and professionalism).

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, Python/Node versions)

### Suggesting Features

Feature suggestions are welcome! Please:
- Check if the feature is already planned in `Work-domains.txt`
- Create an issue with detailed description
- Explain the use case and benefits
- Provide examples if possible

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   ```bash
   # Backend
   cd backend
   pytest

   # Frontend
   cd frontend
   npm test
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "Add: Feature description"
   # or
   git commit -m "Fix: Bug description"
   # or
   git commit -m "Docs: Documentation update"
   ```

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Development Setup

See [README.md](README.md#quick-start) for detailed setup instructions.

### Backend Development

- Use Python 3.11+
- Follow PEP 8 style guide
- Add type hints
- Write docstrings for functions
- Use logging instead of print statements

### Frontend Development

- Use TypeScript
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Add proper TypeScript types

## Project Structure

Follow the existing structure:
- Backend services in `backend/app/services/`
- API endpoints in `backend/app/api/v1/endpoints/`
- Frontend components in `frontend/components/`
- Frontend pages in `frontend/app/`

## Commit Message Convention

- `Add:` New feature
- `Fix:` Bug fix
- `Docs:` Documentation changes
- `Style:` Code formatting (no logic change)
- `Refactor:` Code restructuring
- `Test:` Adding/updating tests
- `Chore:` Build/config changes

## Phase-Based Development

Agent M is built in phases. Please:
- Focus on the current phase (check `Work-domains.txt`)
- Don't implement features from future phases unless discussed
- Update `CHANGELOG.md` for significant changes
- Update `VERSION.md` if appropriate

## Questions?

Feel free to:
- Open an issue with question label
- Reach out to maintainers
- Check existing documentation in `PendingWork/`

## Thank You!

Your contributions help make Agent M better for everyone. We appreciate your time and effort! 🙏
