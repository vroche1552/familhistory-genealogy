# Style Guide

## Code Organization

### Directory Structure
```
src/
├── features/           # Feature-specific code
│   ├── auth/          # Authentication feature
│   ├── family-tree/   # Family tree feature
│   ├── theme/         # Theme management
│   └── i18n/          # Internationalization
├── shared/            # Shared components and utilities
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   └── utils/         # Utility functions
├── types/             # TypeScript type definitions
└── tests/             # Test files mirroring src structure
```

### File Naming
- React components: PascalCase (e.g., `PersonCard.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useAuth.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Test files: Same name as source file with `.test.tsx` suffix
- Type definitions: camelCase (e.g., `personTypes.ts`)

## Import Conventions

### Import Order
1. React and React Router imports
2. External library imports
3. Internal feature imports
4. Shared component imports
5. Type imports
6. Style imports

### Import Style
```typescript
// React imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// External library imports
import { supabase } from '@supabase/supabase-js';

// Internal feature imports
import { useAuth } from '@/features/auth';
import { useTheme } from '@/features/theme';

// Shared component imports
import { Button } from '@/shared/components/ui/button';

// Type imports
import type { Person } from '@/types/family';

// Style imports
import './styles.css';
```

### Import Rules
- Use named imports for components and hooks
- Use type imports for TypeScript types
- Group related imports together
- Use absolute imports with '@' alias
- Avoid circular dependencies

## Component Structure

### Component Template
```typescript
import React from 'react';
import type { ComponentProps } from '@/types';

interface Props extends ComponentProps {
  // Component-specific props
}

export function Component({ prop1, prop2, ...props }: Props) {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render helpers

  return (
    // JSX
  );
}
```

### Component Rules
- Keep components focused and single-responsibility
- Extract complex logic into custom hooks
- Use TypeScript for all props and state
- Follow React best practices for performance
- Include PropTypes or TypeScript interfaces
- Add JSDoc comments for complex components

## State Management

### Context Usage
- Use context for global state that needs to be shared
- Keep context providers close to where they're used
- Split large contexts into smaller, focused ones
- Use custom hooks to access context

### Local State
- Use useState for simple component state
- Use useReducer for complex state logic
- Consider using React Query for server state
- Avoid prop drilling

## Testing

### Test Structure
```typescript
describe('Component', () => {
  // Expected use case
  it('should handle normal usage', () => {
    // Test implementation
  });

  // Edge case
  it('should handle edge cases', () => {
    // Test implementation
  });

  // Failure case
  it('should handle errors gracefully', () => {
    // Test implementation
  });
});
```

### Test Rules
- Test component rendering
- Test user interactions
- Test error states
- Mock external dependencies
- Use meaningful test descriptions
- Follow AAA pattern (Arrange, Act, Assert)

## Code Quality

### File Size Limits
- Maximum file length: 300 lines
- Maximum function length: 50 lines
- Maximum nesting depth: 4 levels
- Maximum callback nesting: 3 levels
- Maximum cyclomatic complexity: 15

### Code Style
- Use TypeScript strict mode
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions pure when possible
- Use early returns to reduce nesting
- Follow DRY principle

## Git Workflow

### Commit Messages
- Use conventional commits format
- Keep commits focused and atomic
- Include issue references
- Write clear commit descriptions

### Branch Strategy
- main: production-ready code
- develop: development branch
- feature/*: new features
- bugfix/*: bug fixes
- release/*: release preparation

## Documentation

### Code Documentation
- Document complex functions
- Add JSDoc comments for public APIs
- Keep documentation up to date
- Include examples where helpful

### Project Documentation
- Keep README.md updated
- Document setup instructions
- Include troubleshooting guides
- Maintain changelog 