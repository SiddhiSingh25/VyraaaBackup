# SearchableDropdown

A fully reusable, accessible searchable dropdown / combobox for React + TypeScript +
Tailwind CSS + Framer Motion. Built for admin dashboards — pass it different `options`
and reuse it for Categories, Brands, Colors, Sizes, Tags, Property Types, or any future
entity. It contains no API or business logic; the parent owns data fetching.

## Install the one dependency

The component uses `lucide-react` for icons (chevron, search, x, plus, spinner, error).

```bash
npm install lucide-react
```

Framer Motion and Tailwind are assumed to already be set up in your project.

## Usage

```tsx
import { SearchableDropdown } from "@/components/SearchableDropdown";
import type { Option } from "@/components/SearchableDropdown";

const categoryOptions: Option[] = [
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Groceries", value: "groceries" },
  { label: "Books", value: "books" },
];

function CategoryField() {
  const [selectedCategory, setSelectedCategory] = useState<string | number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddCategory = () => {
    // open your own "create category" modal here — this component
    // has no idea what a category is.
  };

  return (
    <SearchableDropdown
      label="Category"
      placeholder="Search category..."
      options={categoryOptions}
      value={selectedCategory}
      onChange={setSelectedCategory}
      loading={loading}
      required
      showAddButton
      addButtonText="Add Category"
      onAdd={handleAddCategory}
    />
  );
}
```

## Props

| Prop             | Type                                             | Default      | Notes                                            |
| ---------------- | ------------------------------------------------ | ------------ | ------------------------------------------------- |
| `label`           | `string`                                          | —            | Rendered above the control, skipped if omitted    |
| `placeholder`     | `string`                                          | `"Search..."`| Shown in the trigger and the search input         |
| `options`         | `Option[]`                                        | —            | `{ label, value }[]`                              |
| `value`           | `string \| number \| null \| undefined`           | —            | Controlled selection                              |
| `onChange`        | `(value: string \| number \| null) => void`       | —            | `null` fires from the clear button                |
| `loading`         | `boolean`                                         | `false`      | Shows a spinner row instead of options             |
| `required`        | `boolean`                                         | `false`      | Renders a red asterisk next to the label          |
| `disabled`        | `boolean`                                         | `false`      | Mutes styling, blocks all interaction              |
| `error`           | `string`                                          | `""`         | Red border + helper text when non-empty            |
| `showAddButton`   | `boolean`                                         | `false`      | Shows the "+ Add" row pinned under the list        |
| `addButtonText`   | `string`                                          | `"Add new"`  | Label for the add row                              |
| `onAdd`           | `() => void`                                      | —            | Fired on add-button click; component closes first  |
| `clearable`       | `boolean`                                         | `true`       | Shows the (x) clear affordance when a value is set |
| `id`              | `string`                                          | auto         | Wires up `<label htmlFor>` / aria attributes       |
| `className`       | `string`                                          | `""`         | Passthrough for layout (width, grid placement...)  |
| `emptyStateText`  | `string`                                          | auto         | Override for the "No results found" copy           |

## Keyboard support

- `Enter` / `ArrowDown` / `Space` on the closed trigger opens the panel.
- `ArrowDown` / `ArrowUp` move the highlighted option.
- `Enter` selects the highlighted option.
- `Escape` or `Tab` closes the panel.
- Clicking outside the component closes it.

## Accessibility

Implements the combobox pattern: `role="combobox"` on the trigger,
`aria-expanded`, `aria-controls`, `role="listbox"` / `role="option"`,
`aria-selected`, and `aria-invalid` on validation errors. Focus visibly
rings on the trigger and moves into the search field the instant the
panel opens.

## Folder structure

```
SearchableDropdown/
├── SearchableDropdown.tsx   # component implementation
├── types.ts                 # Option + props contracts
└── index.ts                 # public exports
```
