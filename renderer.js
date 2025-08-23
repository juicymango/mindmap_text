class Renderer {
    constructor(canvas, mindMap) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.mindMap = mindMap;
        this.offsetX = 0;
        this.offsetY = 0;
        this.scale = 1.0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        
        this.setupEventListeners();
        this.calculateLayout();
    }

    setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        this.canvas.addEventListener('click', this.handleClick.bind(this));
        this.canvas.addEventListener('dblclick', this.handleDoubleClick.bind(this));
    }

    calculateLayout() {
        const root = this.mindMap.root;
        root.x = this.canvas.width / 2 + this.offsetX;
        root.y = this.canvas.height / 2 + this.offsetY;
        
        this.calculateNodeSize(root);
        this.layoutTree(root, 0);
    }

    calculateNodeSize(node) {
        this.ctx.font = '14px sans-serif';
        const lines = node.text.split('\n');
        const maxWidth = Math.max(...lines.map(line => this.ctx.measureText(line).width));
        
        node.width = maxWidth + 40;
        node.height = lines.length * 20 + 30;
    }

    layoutTree(node, level) {
        if (!node.expanded) return;
        
        const horizontalSpacing = 200;
        const verticalSpacing = 80;
        
        let totalHeight = 0;
        node.children.forEach(child => {
            this.calculateNodeSize(child);
            totalHeight += child.height;
        });
        
        let currentY = node.y - totalHeight / 2;
        
        node.children.forEach(child => {
            child.x = node.x + horizontalSpacing;
            child.y = currentY + child.height / 2;
            currentY += child.height + verticalSpacing;
            
            this.layoutTree(child, level + 1);
        });
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.scale(this.scale, this.scale);
        
        this.renderConnections(this.mindMap.root);
        this.renderNode(this.mindMap.root);
        
        this.ctx.restore();
    }

    renderConnections(node) {
        if (!node.expanded) return;
        
        node.children.forEach(child => {
            this.ctx.beginPath();
            this.ctx.moveTo(node.x + node.width / 2, node.y);
            this.ctx.lineTo(child.x - child.width / 2, child.y);
            this.ctx.strokeStyle = '#ccc';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            
            this.renderConnections(child);
        });
    }

    renderNode(node) {
        this.ctx.save();
        
        if (node === this.mindMap.selectedNode) {
            this.ctx.fillStyle = '#fff5f5';
            this.ctx.strokeStyle = '#ff6b6b';
        } else {
            this.ctx.fillStyle = '#fff';
            this.ctx.strokeStyle = '#4a90e2';
        }
        
        this.ctx.beginPath();
        this.ctx.roundRect(
            node.x - node.width / 2,
            node.y - node.height / 2,
            node.width,
            node.height,
            6
        );
        this.ctx.fill();
        this.ctx.stroke();
        
        this.ctx.fillStyle = '#333';
        this.ctx.font = '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const lines = node.text.split('\n');
        lines.forEach((line, index) => {
            this.ctx.fillText(
                line,
                node.x,
                node.y - (lines.length - 1) * 10 + index * 20
            );
        });
        
        if (node.children.length > 0) {
            this.ctx.fillStyle = '#666';
            this.ctx.font = '12px sans-serif';
            const marker = node.expanded ? '▼' : '▶';
            this.ctx.fillText(marker, node.x + node.width / 2 - 10, node.y);
        }
        
        this.ctx.restore();
        
        if (node.expanded) {
            node.children.forEach(child => this.renderNode(child));
        }
    }

    handleMouseDown(e) {
        if (e.button === 0) {
            this.isDragging = true;
            this.lastX = e.clientX;
            this.lastY = e.clientY;
        }
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const dx = e.clientX - this.lastX;
            const dy = e.clientY - this.lastY;
            
            this.offsetX += dx / this.scale;
            this.offsetY += dy / this.scale;
            
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            
            this.calculateLayout();
            this.render();
        }
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleWheel(e) {
        e.preventDefault();
        const zoomIntensity = 0.1;
        const wheel = e.deltaY < 0 ? 1 : -1;
        const zoom = Math.exp(wheel * zoomIntensity);
        
        this.scale *= zoom;
        this.scale = Math.max(0.1, Math.min(5, this.scale));
        
        this.render();
    }

    handleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale - this.offsetX;
        const y = (e.clientY - rect.top) / this.scale - this.offsetY;
        
        const clickedNode = this.findNodeAt(x, y);
        if (clickedNode) {
            this.mindMap.selectNode(clickedNode);
            this.render();
        } else {
            this.mindMap.clearSelection();
            this.render();
        }
    }

    handleDoubleClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / this.scale - this.offsetX;
        const y = (e.clientY - rect.top) / this.scale - this.offsetY;
        
        const clickedNode = this.findNodeAt(x, y);
        if (clickedNode) {
            const newText = prompt('Edit node text:', clickedNode.text);
            if (newText !== null) {
                clickedNode.text = newText;
                this.calculateLayout();
                this.render();
            }
        }
    }

    findNodeAt(x, y) {
        const nodes = this.mindMap.getAllNodes();
        
        for (const node of nodes) {
            if (x >= node.x - node.width / 2 &&
                x <= node.x + node.width / 2 &&
                y >= node.y - node.height / 2 &&
                y <= node.y + node.height / 2) {
                return node;
            }
        }
        
        return null;
    }

    refresh() {
        this.calculateLayout();
        this.render();
    }
}