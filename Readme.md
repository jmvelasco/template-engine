# Kata Template Engine

## Description

A **template engine** is a tool that takes a text template containing named placeholders and a set of key-value pairs, and produces a new string where every placeholder has been replaced by its corresponding value.

## Goal

Implement a `render` function that receives a template string and a variables map, and returns the rendered output.

```
render("Hello, ${name}!", { name: "Ada" })
// → "Hello, Ada!"
```

## Rules

- Placeholders follow the pattern `${variable_name}`
- If a variable in the template has no matching key in the map, it should be left as-is (or throw an error — your choice, document it)
- If a variable appears multiple times, all occurrences must be replaced
- The template may contain no placeholders at all — return it unchanged

## Example cases

| Template                                   | Variables                             | Output                              |
| ------------------------------------------ | ------------------------------------- | ----------------------------------- |
| `"Hello, ${name}!"`                        | `{ name: "Ada" }`                     | `"Hello, Ada!"`                     |
| `"${greeting}, ${name}!"`                  | `{ greeting: "Hi", name: "Bob" }`     | `"Hi, Bob!"`                        |
| `"No placeholders"`                        | `{}`                                  | `"No placeholders"`                 |
| `"Dear ${name}, your code is ${quality}."` | `{ name: "Alice", quality: "clean" }` | `"Dear Alice, your code is clean."` |

## What this kata practices

- String manipulation
- Regular expressions
- Edge case handling
- Test-driven development (TDD)

## 📋 Available Scripts

The scaffolder of this project is based on a template from [Software Crafters](https://softwarecrafters.io/).

### Development

```bash
npm run dev              # Watch mode for TypeScript compilation
npm run compile          # Type-check without emitting files
npm run compile:watch    # Type-check in watch mode
```

### Building

```bash
npm run build           # Clean and compile TypeScript to JavaScript
npm run clean           # Remove lib/ and coverage/ directories
```

### Linting & Formatting

```bash
npm run lint            # Run ESLint
npm run lint:fix        # Run ESLint and auto-fix issues
npm run format          # Check formatting with Prettier
npm run format:check    # Verify code formatting
npm run format:fix      # Format code with Prettier
npm run analyze         # Run lint:fix + compile
```

### Testing

```bash
npm test                # Run tests with Jest
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report
npm run test:ci         # Run tests in CI mode with coverage
```

### Quality Assurance

```bash
npm run validate        # Run compile + lint + test (full check)
```

## ⚙️ Husky & lint-staged

- **pre-commit**:
  - Runs ESLint and Prettier on staged TypeScript files (via lint-staged)
  - Runs TypeScript type-checking on the entire project (compile)
  - Blocks commit if there are type errors or unfixable linting issues
- **pre-push**:
  - Runs full validation (compile + lint + test)
  - Ensures all code is properly typed, linted, and tested before pushing
