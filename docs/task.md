# task 1

- this project is to implement a mind map website.
- the first step is to design the ui and interaction
- I've found serious issues with the current mind map interface.
- when the mind map become complicated, we can only see information near the focused node. we are difficult to find brothers of the parent node. we are difficult to see the whole structure of the mind map.
- so we need improvement.
- i think we can use the ui like the finder as Columns in mac.
- if one parent node is selected, all its children nodes should be displayed to the right of the parent node.
- but children nodes of the brothers of the selected parent node should not be displayed.
- for each node, we record the selected child. we automatically expand the selected child when this node is selected, and also recursively expand the child's selected child. at the beginning, the first child is selected by default.
- in this design, we can see the parents and the parents' brothers easily.
- please design the ui and interactions. add new files in ./docs/.
