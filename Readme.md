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

### Basic replacement

| # | Scenario | Template | Variables | Output |
|---|---|---|---|---|
| 1 | Single placeholder | `"Hello, ${name}!"` | `{ name: "Ada" }` | `"Hello, Ada!"` |
| 2 | Multiple different placeholders | `"${greeting}, ${name}!"` | `{ greeting: "Hi", name: "Bob" }` | `"Hi, Bob!"` |
| 3 | Repeated placeholder replaced everywhere | `"${name} meets ${name}"` | `{ name: "Ada" }` | `"Ada meets Ada"` |
| 4 | Placeholder at start of template | `"${name} is here"` | `{ name: "Ada" }` | `"Ada is here"` |
| 5 | Placeholder at end of template | `"Hello ${name}"` | `{ name: "Ada" }` | `"Hello Ada"` |
| 6 | Template is only a placeholder | `"${name}"` | `{ name: "Ada" }` | `"Ada"` |
| 7 | Adjacent placeholders with no separator | `"${first}${last}"` | `{ first: "Ada", last: "L" }` | `"AdaL"` |

### No replacement needed

| # | Scenario | Template | Variables | Output |
|---|---|---|---|---|
| 8 | No placeholders in template | `"Hello, world!"` | `{}` | `"Hello, world!"` |
| 9 | No placeholders, variables ignored | `"Hello, world!"` | `{ name: "Ada" }` | `"Hello, world!"` |
| 10 | Empty template, no variables | `""` | `{}` | `""` |
| 11 | Empty template, variables ignored | `""` | `{ name: "Ada" }` | `""` |

### Missing variables

| # | Scenario | Template | Variables | Output |
|---|---|---|---|---|
| 12 | Placeholder with no matching variable | `"Hello, ${name}!"` | `{}` | `"Hello, ${name}!"` |
| 13 | Extra variables with no matching placeholder | `"Hello!"` | `{ name: "Ada" }` | `"Hello!"` |
| 14 | Partial match — some found, some missing | `"${name} is ${age}"` | `{ name: "Ada" }` | `"Ada is ${age}"` |
| 15 | Multiple missing in complex template | `"${a} ${b} ${c}"` | `{ b: "ok" }` | `"${a} ok ${c}"` |

### Special variable values

| # | Scenario | Template | Variables | Output |
|---|---|---|---|---|
| 16 | Empty string as value | `"Hello, ${name}!"` | `{ name: "" }` | `"Hello, !"` |
| 17 | Value with spaces | `"Hello, ${name}!"` | `{ name: "Ada Lovelace" }` | `"Hello, Ada Lovelace!"` |
| 18 | Value with special characters | `"Say ${msg}"` | `{ msg: "x < y & z > w" }` | `"Say x < y & z > w"` |
| 19 | Value contains placeholder-like syntax | `"Hello, ${name}!"` | `{ name: "${other}" }` | `"Hello, ${other}!"` |
| 20 | Null value prevents replacement | `"Hello, ${name}!"` | `{ name: null }` | `"Hello, ${name}!"` |
| 21 | Numeric value | `"Age: ${age}"` | `{ age: "30" }` | `"Age: 30"` |

### Malformed or tricky placeholders

| # | Scenario | Template | Variables | Output |
|---|---|---|---|---|
| 22 | Unclosed placeholder — not a valid pattern | `"Hello, ${name"` | `{ name: "Ada" }` | `"Hello, ${name"` |
| 23 | Missing dollar sign — not a valid pattern | `"Hello, {name}!"` | `{ name: "Ada" }` | `"Hello, {name}!"` |
| 24 | Empty placeholder name `${}` | `"Hello, ${}!"` | `{}` | `"Hello, ${}!"` |
| 25 | Nested braces — not supported | `"${${key}}"` | `{ key: "name" }` | `"${${key}}"` |
| 26 | Extra closing brace | `"Hello, ${name}}!"` | `{ name: "Ada" }` | `"Hello, Ada}!"` |
| 27 | Placeholder with spaces in name | `"Hello, ${ name }!"` | `{ name: "Ada" }` | `"Hello, ${ name }!"` |

### Whitespace and formatting

| # | Scenario | Template | Variables | Output |
|---|---|---|---|---|
| 28 | Template is only whitespace | `"   "` | `{}` | `"   "` |
| 29 | Placeholder surrounded by newlines | `"Hi\n${name}\nBye"` | `{ name: "Ada" }` | `"Hi\nAda\nBye"` |
| 30 | Multiline template | `"Line1: ${a}\nLine2: ${b}"` | `{ a: "X", b: "Y" }` | `"Line1: X\nLine2: Y"` |
 
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
