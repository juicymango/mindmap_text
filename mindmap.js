class Node {
    constructor(id, text, expanded = true) {
        this.id = id;
        this.text = text;
        this.expanded = expanded;
        this.children = [];
        this.parent = null;
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    }

    addChild(child) {
        child.parent = this;
        this.children.push(child);
        return child;
    }

    remove() {
        if (this.parent) {
            const index = this.parent.children.indexOf(this);
            if (index > -1) {
                this.parent.children.splice(index, 1);
            }
        }
    }

    toggleExpand() {
        this.expanded = !this.expanded;
    }

    getDepth() {
        let depth = 0;
        let current = this.parent;
        while (current) {
            depth++;
            current = current.parent;
        }
        return depth;
    }
}

class MindMap {
    constructor() {
        this.root = new Node('root', 'Central Topic');
        this.nodes = new Map();
        this.nodes.set(this.root.id, this.root);
        this.selectedNode = null;
    }

    createNode(text, parent = this.root) {
        const id = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const node = new Node(id, text);
        parent.addChild(node);
        this.nodes.set(id, node);
        return node;
    }

    removeNode(node) {
        if (node === this.root) return false;
        
        const removeRecursive = (n) => {
            this.nodes.delete(n.id);
            n.children.forEach(child => removeRecursive(child));
        };
        
        removeRecursive(node);
        node.remove();
        
        if (this.selectedNode === node) {
            this.selectedNode = null;
        }
        
        return true;
    }

    selectNode(node) {
        this.selectedNode = node;
    }

    findNodeById(id) {
        return this.nodes.get(id);
    }

    getAllNodes() {
        return Array.from(this.nodes.values());
    }

    clearSelection() {
        this.selectedNode = null;
    }
}