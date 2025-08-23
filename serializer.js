class Serializer {
    serialize(mindMap) {
        let output = '';
        
        const serializeNode = (node, depth = 0) => {
            const indent = '  '.repeat(depth);
            let line = `${indent}- ${node.text}`;
            
            if (!node.expanded && node.children.length > 0) {
                line += ' [collapsed]';
            } else if (node.expanded && node.children.length > 0) {
                line += ' [expanded]';
            }
            
            output += line + '\n';
            
            if (node.expanded) {
                node.children.forEach(child => serializeNode(child, depth + 1));
            }
        };
        
        serializeNode(mindMap.root, 0);
        return output.trim();
    }

    deserialize(text) {
        const lines = text.split('\n');
        const mindMap = new MindMap();
        
        if (lines.length === 0) return mindMap;
        
        const stack = [];
        let lastNode = mindMap.root;
        let lastDepth = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trimRight();
            if (line === '') continue;
            
            const { depth, content, expanded } = this.parseLine(line);
            
            if (depth === 0 && i > 0) {
                continue;
            }
            
            if (depth > lastDepth) {
                stack.push(lastNode);
            } else if (depth < lastDepth) {
                const levelsToPop = lastDepth - depth;
                for (let j = 0; j < levelsToPop; j++) {
                    stack.pop();
                }
            }
            
            const parent = stack.length > 0 ? stack[stack.length - 1] : mindMap.root;
            
            if (parent) {
                const node = mindMap.createNode(content, parent);
                node.expanded = expanded;
                lastNode = node;
            }
            
            lastDepth = depth;
        }
        
        return mindMap;
    }

    parseLine(line) {
        let depth = 0;
        let content = line;
        let expanded = true;
        
        while (content.startsWith('  ')) {
            depth++;
            content = content.substring(2);
        }
        
        if (content.startsWith('- ')) {
            content = content.substring(2);
        }
        
        const expandedMatch = content.match(/\s\[expanded\]$/);
        const collapsedMatch = content.match(/\s\[collapsed\]$/);
        
        if (expandedMatch) {
            content = content.replace(/\s\[expanded\]$/, '');
            expanded = true;
        } else if (collapsedMatch) {
            content = content.replace(/\s\[collapsed\]$/, '');
            expanded = false;
        }
        
        return { depth, content, expanded };
    }

    serializeWithMultiLine(mindMap) {
        let output = '';
        
        const serializeNode = (node, depth = 0) => {
            const indent = '  '.repeat(depth);
            const lines = node.text.split('\n');
            
            let firstLine = `${indent}- ${lines[0]}`;
            if (!node.expanded && node.children.length > 0) {
                firstLine += ' [collapsed]';
            } else if (node.expanded && node.children.length > 0) {
                firstLine += ' [expanded]';
            }
            
            output += firstLine + '\n';
            
            for (let i = 1; i < lines.length; i++) {
                output += `${indent}  ${lines[i]}\n`;
            }
            
            if (node.expanded) {
                node.children.forEach(child => serializeNode(child, depth + 1));
            }
        };
        
        serializeNode(mindMap.root, 0);
        return output.trim();
    }

    deserializeWithMultiLine(text) {
        const lines = text.split('\n');
        const mindMap = new MindMap();
        
        if (lines.length === 0) return mindMap;
        
        const stack = [];
        let currentNode = null;
        let currentDepth = 0;
        let multiLineBuffer = [];
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trimRight();
            if (line === '') continue;
            
            if (line.startsWith('- ')) {
                if (currentNode && multiLineBuffer.length > 0) {
                    currentNode.text = multiLineBuffer.join('\n');
                    multiLineBuffer = [];
                }
                
                const { depth, content, expanded } = this.parseLine(line);
                
                if (depth > currentDepth) {
                    stack.push(currentNode);
                } else if (depth < currentDepth) {
                    const levelsToPop = currentDepth - depth;
                    for (let j = 0; j < levelsToPop; j++) {
                        stack.pop();
                    }
                }
                
                const parent = stack.length > 0 ? stack[stack.length - 1] : mindMap.root;
                
                if (parent) {
                    currentNode = mindMap.createNode(content, parent);
                    currentNode.expanded = expanded;
                    multiLineBuffer = [content];
                }
                
                currentDepth = depth;
            } else {
                if (currentNode) {
                    multiLineBuffer.push(line.trim());
                }
            }
        }
        
        if (currentNode && multiLineBuffer.length > 0) {
            currentNode.text = multiLineBuffer.join('\n');
        }
        
        return mindMap;
    }
}