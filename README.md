
# simple-react-checkbox-tree

A simple checkbox tree for React.

## Demo
live demo
https://codesandbox.io/s/simple-react-checkbox-tree-02c9d?file=/src/App.js

## Installation

Install with npm

```bash
  npm install simple-react-checkbox-tree
```
    
## Usage/Examples

```javascript
import React, { useState } from 'react';
import CheckBox from 'simple-react-checkbox-tree/lib';

const nodes = [{
    value: 'mars',
    label: 'Mars',
    children: [
        { value: 'phobos', label: 'Phobos' },
        { value: 'deimos', label: 'Deimos' },
    ],
}];

function App() {
  const [checked, setChecked] = useState([]);
  const [expanded, setExpanded] = useState([]);

  return (
    <CheckboxTree
      nodes={nodes}
      checked={checked}
      expanded={expanded}
      onCheck={checked => setChecked(checked)}
      onExpand={expanded => setExpanded(expanded)}
    />
  )
}
```

All node objects must have a unique value. This value is serialized into the checked and expanded arrays.

By default this package loads material icons through CDN link in css file.



## Properties
| Property | Type | Description | Default |
| --- | --- | --- | :---: |
| nodes | array | `Required`. Specifies the tree nodes <br/> and their children. |  |
| checked | array | An array of checked node values. | [ ] |
| expanded | array | An array of expanded node values. | [ ] |
| expandDisabled | bool | If true, the ability to expand nodes will be disabled. | false |
| disabled | bool | An array of expanded node values. | [ ] |
| expanded | array | If true, the component will be disabled and nodes cannot be checked. | false |
| name | string | Optional name for the hidden `<input>` element. | undefined |
| noCascade | bool | If true, toggling a parent node will not cascade its check state to its children. | false |
| showExpandToggleButtons | bool |If true, buttons for expanding and collapsing all parent nodes will appear in the tree. | false |
| expandAll | bool | If true, all nodes will be expanded by default | false |
| folderIcons | bool | If true, all nodes will have folder icon or file icon based on if it is a parent or child | false |
| onCheck | function | onCheck handler: function(checked) {} | () => {} |
| onExpand | function | onExpand handler: function(expanded) {} | () => {} |


## Nodes
Individual nodes within the nodes property can have the following structure:

| Property | Type | Description | Default |
| --- | --- | --- | :---: |
| label | mixed | `Required.` The node's label. |  |
| value | mixed | `Required.` The node's value. |  |
| children | array | An array of child nodes.. | null |
| renderOnCheck | Node | A Node to render whenever the node label is checked | null |

