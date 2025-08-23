class MindMapApp {
    constructor() {
        this.mindMap = new MindMap();
        this.canvas = document.getElementById('mindmap-canvas');
        this.renderer = new Renderer(this.canvas, this.mindMap);
        
        this.setupEventListeners();
        this.setupContextMenu();
        this.initializeDemoData();
        this.renderer.refresh();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        
        document.getElementById('new-map').addEventListener('click', () => {
            this.mindMap = new MindMap();
            this.renderer.mindMap = this.mindMap;
            this.renderer.refresh();
        });

        document.getElementById('import-btn').addEventListener('click', () => {
            document.getElementById('file-input').click();
        });

        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportMap();
        });

        document.getElementById('file-input').addEventListener('change', (e) => {
            this.importMap(e.target.files[0]);
        });
    }

    setupContextMenu() {
        const contextMenu = document.getElementById('context-menu');
        
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            if (this.mindMap.selectedNode) {
                contextMenu.style.display = 'block';
                contextMenu.style.left = e.pageX + 'px';
                contextMenu.style.top = e.pageY + 'px';
            }
        });

        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });

        contextMenu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleContextMenuAction(item.dataset.action);
                contextMenu.style.display = 'none';
            });
        });
    }

    handleContextMenuAction(action) {
        const selectedNode = this.mindMap.selectedNode;
        if (!selectedNode) return;

        switch (action) {
            case 'add-child':
                const childText = prompt('Enter child node text:');
                if (childText) {
                    this.mindMap.createNode(childText, selectedNode);
                    this.renderer.refresh();
                }
                break;

            case 'edit':
                const newText = prompt('Edit node text:', selectedNode.text);
                if (newText !== null) {
                    selectedNode.text = newText;
                    this.renderer.refresh();
                }
                break;

            case 'remove':
                if (confirm('Remove this node and all its children?')) {
                    this.mindMap.removeNode(selectedNode);
                    this.renderer.refresh();
                }
                break;

            case 'toggle-expand':
                selectedNode.toggleExpand();
                this.renderer.refresh();
                break;
        }
    }

    handleKeyDown(e) {
        if (!this.mindMap.selectedNode) return;

        switch (e.key) {
            case 'Delete':
                if (confirm('Remove this node and all its children?')) {
                    this.mindMap.removeNode(this.mindMap.selectedNode);
                    this.renderer.refresh();
                }
                break;

            case 'Enter':
                const childText = prompt('Enter child node text:');
                if (childText) {
                    this.mindMap.createNode(childText, this.mindMap.selectedNode);
                    this.renderer.refresh();
                }
                break;

            case 'Escape':
                this.mindMap.clearSelection();
                this.renderer.refresh();
                break;

            case ' ': // Space bar
                this.mindMap.selectedNode.toggleExpand();
                this.renderer.refresh();
                break;
        }
    }

    initializeDemoData() {
        const root = this.mindMap.root;
        const idea1 = this.mindMap.createNode('Main Idea 1', root);
        const idea2 = this.mindMap.createNode('Main Idea 2', root);
        
        this.mindMap.createNode('Subpoint 1.1', idea1);
        this.mindMap.createNode('Subpoint 1.2', idea1);
        this.mindMap.createNode('Subpoint 2.1', idea2);
    }

    exportMap() {
        const serializer = new Serializer();
        const text = serializer.serialize(this.mindMap);
        
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mindmap.txt';
        a.click();
        
        URL.revokeObjectURL(url);
    }

    async importMap(file) {
        if (!file) return;

        try {
            const text = await file.text();
            const serializer = new Serializer();
            const newMindMap = serializer.deserialize(text);
            
            this.mindMap = newMindMap;
            this.renderer.mindMap = this.mindMap;
            this.renderer.refresh();
        } catch (error) {
            alert('Error importing file: ' + error.message);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new MindMapApp();
});