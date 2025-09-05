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

# task 2

- add save and load functions. use the local file system to storage.
- update ./ui_and_interaction_design.md.
- commit and push the changes.

# task 3

- update ./ui_and_interaction_design.md.
- move File Operations into Interaction Design.
- add function manually sorting sibling nodes in Interaction Design.
- not to implement at this time.
- commit and push the changes.

# task 4

- update ./ui_and_interaction_design.md.
- add function copy / move / paste nodes in Interaction Design.
- not to implement at this time.
- commit and push the changes.

# task 5

- it is a pure frontend project.
- use the React framework.
- how will you implement and test the project? output your plan to ./docs/plan.md.
- not to implement at this time.
- commit and push the changes.

# task 6

- be detail enough for execution.
- make decisions. no "or"s. explain your decisions.
- update ./docs/plan.md.
- write your code structure to ./docs/code_structure.md.
    - write your directory structure. explain functions for each directory.
    - what files are in the directory? explain the functions.
    - what functions, structures will be in each file? document each of them.
    - be detail enough for your actual implementation.
- not to implement at this time.
- commit and push the changes.

# task 7

- read all docs in ./docs.
- implement the project step by step as stated in ./docs/plan.md.
- be aligned with ./docs/code_structure.md.
- commit and push the changes.

# task 8

Failed to compile.

Attempted import error: 'zustand' does not contain a default export (imported as 'create').
WARNING in [eslint] 
src/components/MindMap.tsx
  Line 22:9:  Function declared in a loop contains unsafe references to variable(s) 'currentNode'  no-loop-func

ERROR in ./src/store/mindmapStore.ts 17:31-37
export 'default' (imported as 'create') was not found in 'zustand' (possible exports: create, createStore, useStore)

webpack compiled with 1 error and 1 warning
ERROR in src/components/MindMap.tsx:22:10
TS7006: Parameter 'child' implicitly has an 'any' type.
    20 |     while (currentNode.selected_child_id) {
    21 |       const selectedChild = currentNode.children.find(
  > 22 |         (child) => child.id === currentNode.selected_child_id
       |          ^^^^^
    23 |       );
    24 |       if (selectedChild) {
    25 |         columns.push({ id: selectedChild.id, nodes: selectedChild.children });

ERROR in src/store/mindmapStore.ts:29:32
TS2349: This expression is not callable.
  Type 'typeof import("/Users/plain/go/src/github.com/juicymango/mindmap_text/node_modules/zustand/index")' has no call signatures.
    27 | };
    28 |
  > 29 | export const useMindMapStore = create<MindMapState>((set, get) => ({
       |                                ^^^^^^
    30 |   mindmap: { root: { id: 'root', text: 'Root', children: [] } },
    31 |   setMindmap: (mindmap) => set({ mindmap }),
    32 |   addNode: (parentId, text) => {

ERROR in src/store/mindmapStore.ts:29:54
TS7006: Parameter 'set' implicitly has an 'any' type.
    27 | };
    28 |
  > 29 | export const useMindMapStore = create<MindMapState>((set, get) => ({
       |                                                      ^^^
    30 |   mindmap: { root: { id: 'root', text: 'Root', children: [] } },
    31 |   setMindmap: (mindmap) => set({ mindmap }),
    32 |   addNode: (parentId, text) => {

ERROR in src/store/mindmapStore.ts:29:59
TS7006: Parameter 'get' implicitly has an 'any' type.
    27 | };
    28 |
  > 29 | export const useMindMapStore = create<MindMapState>((set, get) => ({
       |                                                           ^^^
    30 |   mindmap: { root: { id: 'root', text: 'Root', children: [] } },
    31 |   setMindmap: (mindmap) => set({ mindmap }),
    32 |   addNode: (parentId, text) => {

ERROR in src/store/mindmapStore.ts:31:16
TS7006: Parameter 'mindmap' implicitly has an 'any' type.
    29 | export const useMindMapStore = create<MindMapState>((set, get) => ({
    30 |   mindmap: { root: { id: 'root', text: 'Root', children: [] } },
  > 31 |   setMindmap: (mindmap) => set({ mindmap }),
       |                ^^^^^^^
    32 |   addNode: (parentId, text) => {
    33 |     const { mindmap } = get();
    34 |     const newMindMap = { ...mindmap };

ERROR in src/store/mindmapStore.ts:32:13
TS7006: Parameter 'parentId' implicitly has an 'any' type.
    30 |   mindmap: { root: { id: 'root', text: 'Root', children: [] } },
    31 |   setMindmap: (mindmap) => set({ mindmap }),
  > 32 |   addNode: (parentId, text) => {
       |             ^^^^^^^^
    33 |     const { mindmap } = get();
    34 |     const newMindMap = { ...mindmap };
    35 |     const parent = findNode([newMindMap.root], parentId);

ERROR in src/store/mindmapStore.ts:32:23
TS7006: Parameter 'text' implicitly has an 'any' type.
    30 |   mindmap: { root: { id: 'root', text: 'Root', children: [] } },
    31 |   setMindmap: (mindmap) => set({ mindmap }),
  > 32 |   addNode: (parentId, text) => {
       |                       ^^^^
    33 |     const { mindmap } = get();
    34 |     const newMindMap = { ...mindmap };
    35 |     const parent = findNode([newMindMap.root], parentId);

ERROR in src/store/mindmapStore.ts:42:16
TS7006: Parameter 'nodeId' implicitly has an 'any' type.
    40 |     }
    41 |   },
  > 42 |   deleteNode: (nodeId) => {
       |                ^^^^^^
    43 |     const { mindmap } = get();
    44 |     const newMindMap = { ...mindmap };
    45 |

ERROR in src/store/mindmapStore.ts:65:20
TS7006: Parameter 'nodeId' implicitly has an 'any' type.
    63 |     }
    64 |   },
  > 65 |   updateNodeText: (nodeId, text) => {
       |                    ^^^^^^
    66 |     const { mindmap } = get();
    67 |     const newMindMap = { ...mindmap };
    68 |     const node = findNode([newMindMap.root], nodeId);

ERROR in src/store/mindmapStore.ts:65:28
TS7006: Parameter 'text' implicitly has an 'any' type.
    63 |     }
    64 |   },
  > 65 |   updateNodeText: (nodeId, text) => {
       |                            ^^^^
    66 |     const { mindmap } = get();
    67 |     const newMindMap = { ...mindmap };
    68 |     const node = findNode([newMindMap.root], nodeId);

ERROR in src/store/mindmapStore.ts:74:15
TS7006: Parameter 'result' implicitly has an 'any' type.
    72 |     }
    73 |   },
  > 74 |   onDragEnd: (result) => {
       |               ^^^^^^
    75 |     const { source, destination } = result;
    76 |     if (!destination) {
    77 |       return;

ERROR in src/store/mindmapStore.ts:105:22
TS7006: Parameter 'parentId' implicitly has an 'any' type.
    103 |     }
    104 |   },
  > 105 |   setSelectedChild: (parentId, childId) => {
        |                      ^^^^^^^^
    106 |     const { mindmap } = get();
    107 |     const newMindMap = { ...mindmap };
    108 |     const parent = findNode([newMindMap.root], parentId);

ERROR in src/store/mindmapStore.ts:105:32
TS7006: Parameter 'childId' implicitly has an 'any' type.
    103 |     }
    104 |   },
  > 105 |   setSelectedChild: (parentId, childId) => {
        |                                ^^^^^^^
    106 |     const { mindmap } = get();
    107 |     const newMindMap = { ...mindmap };
    108 |     const parent = findNode([newMindMap.root], parentId);

- fix them until no compile errors.
- commit and push the changes.

# task 9

Uncaught runtime errors:
×
ERROR
Invariant failed: Cannot find droppable entry with id [root]
    at handleError (http://localhost:3000/static/js/bundle.js:34851:58)
    at http://localhost:3000/static/js/bundle.js:34870:7

- fix the error.
- also i can only see the add node button, which i can add sibling nodes, but no ways to add children nodes.
- commit and push the changes.

# task 10

Uncaught runtime errors:
×
ERROR
Invariant failed: Cannot find droppable entry with id [mindmap]
    at handleError (http://localhost:3000/static/js/bundle.js:34851:58)
    at http://localhost:3000/static/js/bundle.js:34870:7

- fix the error caused by dragging a node.
- i can't see how i can delete a node. fix it.
- commit and push the changes.

# task 11

- **DONE** the error isn't fixed.
- **DONE** how can you ensure your implementation? what will you test? list your test cases and where are the test codes in ./docs/test.md.
- **DONE** commit and push the changes.

# task 12

- **DONE** implement unit tests in ./docs/test.md.
- **DONE** you can ignore e2e test temporarily.
- **DONE** commit and push the changes.

# task 13

- **DONE** i want the mind map's content to be automatically generated.
- **DONE** in the current mind map node structure, the id is difficult to generate.
- **DONE** remove the id field in the mind map node structure.
- **DONE** replace the selected_child_id to selected_child_idx, which is the index of the selected child node in the children array. regard it 0 if ommited.
- **DONE** update the implementation and the relevant test cases.
- **DONE** make sure you pass the unit tests.
- **DONE** commit and push the changes.

# task 14

- **DONE** enable scrolling horizontally when the depth is deep.
- **DONE** update the implementation and the relevant test cases.
- **DONE** make sure you pass the unit tests.
- **DONE** commit and push the changes.

# task 15

- **DONE** i found the width of a column will decrease if there are many columns.
- **DONE** fix the length. let the use scroll instead.
- **DONE** update the implementation and the relevant test cases.
- **DONE** make sure you pass the unit tests.
- **DONE** commit and push the changes.

# task 16

- **DONE** in classic mind map implementations, the mind map is stored by plain text.
- **DONE** each line represent a node.
- **DONE** it uses tabs ('\t') to represent the hierarchical structure.
- **DONE** suppose line A has n leading tabs. then it is the child of the last line above A that with n-1 leading tabs.
- **DONE** please suport loading and saving the mind map in this format, additional to the current implementation.
- **DONE** update the implementation and the relevant test cases.
- **DONE** make sure you pass the unit tests.
- **DONE** commit and push the changes.

# task 17

- when save as json or as text, let the user select the file path and insert the file name. remember this file path.
- when load from json or text, also remember the file path.
- display this remembered file path.
- add buttons save and load. save to the remembered file path. load from the remembered file path. detect the json or text format by the file suffix.
- make your implementation plan. append it to ./docs/plan.md.
- update your solution to ./docs/code_structure.md.
- update your tests to ./docs/test.md.
- implement this feature and the relevant test cases.
- make sure you pass the unit tests.
- commit and push the changes.

# task 18

- review the task history above.
- review all the code in this project.
- update ./docs/ui_and_iteration_design.md based on the current implementation.
- update ./docs/code_structure.md based on the current implementation.
- update ./docs/test.md based on the current implementation.
- think what will you do in the future. append your plan to ./docs/plan.md.
- not to do your plan yet.
- commit and push the changes.
