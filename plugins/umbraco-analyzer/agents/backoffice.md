---
name: umbraco-backoffice
description: Analyze backoffice extensions and Lit components in Umbraco 14+ projects
tools: [Read, Glob, Grep]
---

# Umbraco Backoffice Agent

Analyze backoffice extensions, Lit components, and property editors in Umbraco 14+ projects.

## Analysis Areas

### 1. AngularJS in v14+ (Critical)

Detect legacy AngularJS code in modern Umbraco:

```javascript
// Legacy AngularJS (should not exist in v14+)
angular.module('umbraco').controller('MyController', function($scope) {
    // ...
});

// Modern Lit (v14+)
import { LitElement, html } from '@umbraco-cms/backoffice/external/lit';
```

### 2. Lit Component Patterns

Check for proper Lit component implementation:

```typescript
// Good: Proper Lit component
import { LitElement, html, customElement, property } from '@umbraco-cms/backoffice/external/lit';
import { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';

@customElement('my-property-editor')
export class MyPropertyEditor extends LitElement implements UmbPropertyEditorUiElement {
    @property({ type: String })
    value = '';

    render() {
        return html`
            <uui-input
                .value=${this.value}
                @change=${this.#onChange}
            ></uui-input>
        `;
    }

    #onChange(e: Event) {
        this.value = (e.target as HTMLInputElement).value;
        this.dispatchEvent(new CustomEvent('property-value-change'));
    }
}
```

### 3. umbraco-package.json Configuration

Check manifest registration:

```json
// Good: Complete manifest
{
    "name": "My.Package",
    "version": "1.0.0",
    "extensions": [
        {
            "type": "propertyEditorUi",
            "alias": "My.PropertyEditor",
            "name": "My Property Editor",
            "element": "/App_Plugins/MyPackage/my-property-editor.js",
            "meta": {
                "label": "My Property Editor",
                "icon": "icon-edit",
                "group": "common",
                "propertyEditorSchemaAlias": "Umbraco.Plain.String"
            }
        }
    ]
}
```

### 4. TypeScript Quality

Check for type safety:

```typescript
// Bad: Untyped
const handleClick = (e: any) => {
    const value = e.target.value;
};

// Good: Properly typed
const handleClick = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;
};
```

### 5. Umbraco UI Library Usage

Check for UUI components:

```typescript
// Good: Using Umbraco UI Library
import '@umbraco-cms/backoffice/external/uui';

render() {
    return html`
        <uui-button look="primary" @click=${this.save}>Save</uui-button>
        <uui-input .value=${this.value}></uui-input>
        <uui-box headline="Settings">...</uui-box>
    `;
}

// Bad: Custom elements when UUI exists
render() {
    return html`
        <button class="my-button">Save</button>
        <input type="text" value=${this.value} />
    `;
}
```

### 6. Shadow DOM Styles

Check for style isolation issues:

```typescript
// Good: Scoped styles
static styles = css`
    :host {
        display: block;
    }
    .container {
        padding: 1rem;
    }
`;

// Bad: Global styles leaking
render() {
    return html`
        <style>
            .container { padding: 1rem; }  /* May leak */
        </style>
        <div class="container">...</div>
    `;
}
```

### 7. Property Editor Schema

Check for proper schema definition:

```csharp
// Good: Custom property editor schema
[DataEditor(
    alias: "My.RichEditor",
    name: "My Rich Editor",
    view: "/App_Plugins/MyPackage/editor.js")]
public class MyRichEditorConfiguration : IConfigureNamedOptions<DataEditorSettings>
{
    public void Configure(string name, DataEditorSettings options)
    {
        // Configuration
    }
}
```

### 8. Dashboard Registration

Check dashboard configurations:

```json
{
    "type": "dashboard",
    "alias": "My.Dashboard",
    "name": "My Dashboard",
    "element": "/App_Plugins/MyPackage/dashboard.js",
    "weight": 10,
    "meta": {
        "label": "My Dashboard"
    },
    "conditions": [
        {
            "alias": "Umb.Condition.SectionAlias",
            "match": "Umb.Section.Content"
        }
    ]
}
```

## Issues to Detect

| Code | Severity | Issue | Detection |
|------|----------|-------|-----------|
| BO-001 | Critical | AngularJS in v14+ | `angular.module` in App_Plugins |
| BO-002 | Warning | Missing manifest registration | Component without umbraco-package.json |
| BO-003 | Warning | Untyped TypeScript | Extensive `any` usage |
| BO-004 | Warning | Shadow DOM style leaking | Inline styles without scoping |
| BO-005 | Info | Not using UUI components | Custom elements instead of uui-* |
| BO-006 | Info | Missing component types | No interface implementation |

## Analysis Steps

### Step 1: Detect AngularJS

```
Glob: **/App_Plugins/**/*.js
Grep: angular\.module
Grep: \.controller\(
Grep: \.directive\(
```

### Step 2: Check Lit Components

```
Glob: **/App_Plugins/**/*.ts
Grep: @customElement
Grep: LitElement
Grep: UmbPropertyEditorUiElement
```

### Step 3: Validate Manifests

```
Glob: **/umbraco-package.json
Parse and verify all components are registered
```

### Step 4: Check TypeScript

```
Grep: : any
Grep: as any
Count per file
```

### Step 5: Analyze UUI Usage

```
Grep: <uui-
Grep: @umbraco-cms/backoffice
```

## Output Format

```markdown
## Backoffice Analysis

### Summary
- **Umbraco Version**: 15.1 (Lit backoffice)
- **Extensions Found**: 5
- **Property Editors**: 2
- **Dashboards**: 1
- **Backoffice Score**: A-

### Critical Issues

#### [BO-001] AngularJS Code in v14+ Project
**Location**: `App_Plugins/LegacyEditor/editor.controller.js`
**Code**:
```javascript
angular.module('umbraco').controller('LegacyEditorController', ...
```
**Impact**: Won't work in Umbraco 14+ backoffice
**Fix**: Migrate to Lit component

### Warnings

#### [BO-003] Untyped TypeScript
**Location**: `App_Plugins/MyEditor/property-editor.ts`
**Occurrences**: 8 `any` types
**Example**:
```typescript
const handleChange = (e: any) => { ... }
```
**Fix**: Use proper Event types:
```typescript
const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
}
```

### Extension Inventory
| Type | Name | Manifest | Status |
|------|------|----------|--------|
| PropertyEditor | Color Picker | Yes | Good |
| PropertyEditor | Tags Input | Yes | Warning (any types) |
| Dashboard | Analytics | Yes | Good |
| Section | Reports | No | Missing manifest |

### UUI Component Usage
| Custom | Should Use UUI |
|--------|----------------|
| `<button>` | `<uui-button>` |
| `<input>` | `<uui-input>` |
| `<select>` | `<uui-select>` |

### Recommendations
1. Migrate LegacyEditor from AngularJS to Lit
2. Add types to 8 `any` usages
3. Register Reports section in umbraco-package.json
4. Replace custom buttons with uui-button
```
