import { render } from "./core/template-engine";

const cases: {
  label: string;
  template: string;
  variables: Record<string, string | null>;
}[] = [
  {
    label: "Happy path — all placeholders replaced",
    template: "Hello, ${name}! You are ${age} years old.",
    variables: { name: "Carlos", age: "30" },
  },
  {
    label: "Partial replacement — missing variable",
    template: "Welcome ${name}, your role is ${role}.",
    variables: { name: "Ana" },
  },
  {
    label: "Null value — skipped placeholder",
    template: "Order for ${customer}: ${product} x${quantity}",
    variables: { customer: "Luis", product: null, quantity: "3" },
  },
  {
    label: "Variable not in template",
    template: "Today is ${day}.",
    variables: { day: "Monday", month: "May" },
  },
  {
    label: "Empty variables — template unchanged",
    template: "Nothing to replace here: ${placeholder}",
    variables: {},
  },
  {
    label: "Multiple errors at once",
    template: "Dear ${name}, your code is ${code}.",
    variables: { foo: null, bar: "unused", baz: null },
  },
];

for (const { label, template, variables } of cases) {
  console.log(`\n--- ${label} ---`);
  const result = render(template, variables);
  console.log(`Template: "${template}"`);
  console.log(`Variables: ${JSON.stringify(variables)}`);
  console.log(`Result:   "${result.value}"`);
  console.log(`Valid:    ${result.isValid}`);
  if (result.errors.length > 0) {
    console.log(`Errors:`);
    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
  }
}
