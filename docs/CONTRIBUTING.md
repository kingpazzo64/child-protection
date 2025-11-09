# Contributing to Child Protection Services Directory

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Experience level
- Gender identity and expression
- Sexual orientation
- Disability
- Personal appearance
- Body size
- Race
- Ethnicity
- Age
- Religion
- Nationality

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Be collaborative
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, trolling, or discriminatory comments
- Publishing others' private information
- Personal or political attacks
- Any conduct that could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before contributing, ensure you have:

1. **Read the documentation**
   - [README.md](../README.md)
   - [SETUP.md](./SETUP.md)
   - [API.md](./API.md)

2. **Set up your development environment**
   - Follow the [Quick Setup Guide](./SETUP.md)
   - Ensure all tests pass
   - Verify the application runs correctly

3. **Understand the project structure**
   - Review the codebase
   - Understand the architecture
   - Familiarize yourself with the tech stack

### Your First Contribution

Looking for something to work on? Here are some suggestions:

1. **Good First Issues**: Look for issues tagged with `good first issue`
2. **Documentation**: Improve or expand documentation
3. **Bug Fixes**: Start with simple bug fixes
4. **Code Comments**: Add helpful comments to complex code
5. **Tests**: Add or improve test coverage

## Development Process

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/child-protection.git
cd child-protection

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/child-protection.git
```

### 2. Create a Branch

```bash
# Update your local main
git checkout master
git pull upstream master

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Branch Naming Conventions

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring
- `test/description` - Adding tests
- `chore/description` - Maintenance tasks

### 3. Make Changes

```bash
# Make your changes
# Test thoroughly
npm run dev

# Check for linting errors
npm run lint

# If modifying database
npx prisma migrate dev --name your_migration_name
```

### 4. Commit Changes

Follow our [Commit Guidelines](#commit-guidelines)

```bash
git add .
git commit -m "feat: add new feature"
```

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Coding Standards

### TypeScript/JavaScript

#### General Rules

- Use TypeScript for all new code
- Follow existing code style and patterns
- Write self-documenting code with clear variable names
- Add comments for complex logic
- Keep functions small and focused (single responsibility)
- Avoid deeply nested code

#### Naming Conventions

```typescript
// Components: PascalCase
export function UserProfile() { }

// Functions and variables: camelCase
const getUserData = () => { }
const isUserActive = true

// Constants: UPPER_SNAKE_CASE
const MAX_RETRY_ATTEMPTS = 3

// Types and Interfaces: PascalCase
interface User { }
type UserRole = 'ADMIN' | 'ENUMERATOR'

// Private properties: _prefix
class Service {
  private _internalState: string
}
```

#### Code Examples

**Good:**

```typescript
// Clear, descriptive function
async function fetchUserDirectories(userId: number): Promise<Directory[]> {
  const directories = await prisma.directory.findMany({
    where: { createdById: userId },
    include: {
      services: true,
      locations: true,
    },
  })
  
  return directories
}

// Type-safe props
interface UserCardProps {
  user: User
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}

export function UserCard({ user, onEdit, onDelete }: UserCardProps) {
  // Component implementation
}
```

**Bad:**

```typescript
// Unclear function name, no types
async function getData(id) {
  const d = await prisma.directory.findMany({ where: { createdById: id }})
  return d
}

// No prop types
export function UserCard({ user, onEdit, onDelete }) {
  // Component implementation
}
```

### React/Next.js

#### Component Structure

```typescript
"use client" // Only if needed

import { useState } from "react"
import { ComponentType } from "@/types"

// Props interface
interface MyComponentProps {
  title: string
  onAction: () => void
}

// Component
export function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState<string>("")
  
  // Event handlers
  const handleClick = () => {
    onAction()
  }
  
  // Render
  return (
    <div>
      <h2>{title}</h2>
      <button onClick={handleClick}>Action</button>
    </div>
  )
}
```

#### Best Practices

- Use functional components
- Use hooks appropriately
- Implement proper error boundaries
- Use React.memo for expensive components
- Avoid prop drilling (use context when needed)
- Keep components small and reusable

### API Routes

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  try {
    // Authentication check
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    // Business logic
    const data = await prisma.model.findMany()
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
```

### Database (Prisma)

#### Schema Changes

```prisma
// Always add comments for complex models
model Directory {
  id                 Int      @id @default(autoincrement())
  nameOfOrganization String   // Full organization name
  
  // Relations
  services    DirectoryService[]
  locations   DirectoryLocation[]
  
  @@map("directories")
}
```

#### Queries

```typescript
// Use type-safe queries
const users = await prisma.user.findMany({
  where: {
    emailVerified: true,
    disabled: false,
  },
  include: {
    directories: {
      include: {
        services: true,
      },
    },
  },
  orderBy: {
    createdAt: 'desc',
  },
})

// Use transactions for multi-step operations
await prisma.$transaction(async (tx) => {
  await tx.user.create({ data: userData })
  await tx.directory.create({ data: directoryData })
})
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow existing component patterns
- Use CSS modules for complex custom styles
- Maintain responsive design
- Ensure accessibility (ARIA labels, semantic HTML)

```tsx
// Good: Utility classes with consistent spacing
<div className="flex items-center justify-between p-4 rounded-lg border shadow-sm">
  <h3 className="text-lg font-semibold">Title</h3>
  <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90">
    Action
  </button>
</div>
```

## Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks, dependency updates
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples

```bash
# Simple commit
git commit -m "feat: add user search functionality"

# With scope
git commit -m "fix(auth): resolve login redirect issue"

# With body
git commit -m "feat(api): add directory filtering

Add ability to filter directories by multiple criteria including
service type, location, and beneficiary type."

# Breaking change
git commit -m "feat(api)!: change directory response structure

BREAKING CHANGE: Directory API now returns locations as an array
instead of a single object."
```

### Best Practices

- Write clear, descriptive commit messages
- Keep commits focused (one logical change per commit)
- Reference issue numbers: `fix: resolve #123 - login error`
- Use present tense: "add feature" not "added feature"
- Capitalize the subject line
- Don't end the subject line with a period

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's style guidelines
- [ ] Self-review completed
- [ ] Comments added to complex code
- [ ] Documentation updated (if applicable)
- [ ] No new warnings or errors
- [ ] Tests added/updated (if applicable)
- [ ] All tests pass
- [ ] Database migrations tested

### PR Title

Follow the same format as commit messages:

```
feat: add user profile page
fix: resolve authentication bug
docs: update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Fixes #123

## How Has This Been Tested?
Describe testing steps

## Screenshots (if applicable)
Add screenshots

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] All tests pass
```

### Review Process

1. **Automated Checks**: PR must pass all CI checks
2. **Code Review**: At least one maintainer review required
3. **Testing**: Changes must be tested
4. **Discussion**: Address all review comments
5. **Approval**: Maintainer approval required before merge

### After Approval

- Maintainers will merge the PR
- Delete your feature branch after merge
- Update your local repository

```bash
git checkout master
git pull upstream master
git branch -d feature/your-feature-name
```

## Testing Guidelines

### Manual Testing

Always test:
- Basic functionality works as expected
- Error cases are handled gracefully
- UI is responsive on different screen sizes
- Authentication and authorization work correctly
- Database operations complete successfully

### Writing Tests (Future Implementation)

When tests are added, follow these guidelines:

```typescript
// Unit test example
describe('getUserDirectories', () => {
  it('should return user directories', async () => {
    const directories = await getUserDirectories(1)
    expect(directories).toBeInstanceOf(Array)
  })
  
  it('should handle non-existent user', async () => {
    await expect(getUserDirectories(9999)).rejects.toThrow()
  })
})
```

## Documentation

### When to Update Documentation

Update documentation when you:
- Add new features
- Change API endpoints
- Modify database schema
- Change environment variables
- Update deployment process
- Fix bugs that affect user behavior

### Documentation Standards

- Use clear, concise language
- Include code examples
- Add screenshots for UI changes
- Update the changelog
- Keep the README up to date

## Reporting Bugs

### Before Reporting

1. Check existing issues
2. Verify it's actually a bug
3. Test on the latest version
4. Gather reproduction steps

### Bug Report Template

```markdown
**Describe the Bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What you expected to happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Ubuntu 22.04]
- Node version: [e.g., 22.0.0]
- Browser: [e.g., Chrome 120]

**Additional Context**
Any other relevant information
```

## Suggesting Features

### Feature Request Template

```markdown
**Feature Description**
Clear description of the feature

**Problem It Solves**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Mockups, examples, etc.
```

## Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code contributions and discussions
- **Email**: [Contact information]

## Recognition

Contributors will be:
- Listed in the project's contributors file
- Credited in release notes
- Acknowledged in project documentation

## Questions?

If you have questions:
1. Check existing documentation
2. Search closed issues
3. Open a new issue
4. Contact the maintainers

## Thank You!

Your contributions make this project better for everyone. We appreciate your time and effort!

---

**Happy Contributing!** 🚀


