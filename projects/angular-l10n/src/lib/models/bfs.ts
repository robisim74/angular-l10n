/**
 * Breadth First Search (BFS) algorithm for traversing & searching tree data structure of DOM
 * explores the neighbor nodes first, before moving to the next level neighbors.
 * Time complexity: between O(1) and O(|V|^2).
 */

const SELECTOR = new RegExp('^l10n|translate');

const MAX_DEPTH = 10;

export function getTargetNode(rootNode: any): any {
    return walk(rootNode);
}

function walk(rootNode: any): any {
    const queue: any[] = [];

    let iNode: any;
    let depth = 0;
    let nodeToDepthIncrease = 1;

    queue.push(rootNode);
    while (queue.length > 0 && depth <= MAX_DEPTH) {
        iNode = queue.shift();
        if (isTargetNode(iNode)) return iNode;
        if (depth < MAX_DEPTH && iNode.childNodes != null) {
            for (const child of iNode.childNodes) {
                if (isValidNode(child)) {
                    queue.push(child);
                }
            }
        }
        if (--nodeToDepthIncrease === 0) {
            depth++;
            nodeToDepthIncrease = queue.length;
        }
    }
    return rootNode;
}

function isTargetNode(node: any): boolean {
    return typeof node !== 'undefined' && node.nodeType === 3 && node.nodeValue != null && node.nodeValue.trim() !== '';
}

/**
 * A valid node is not marked for translation.
 */
function isValidNode(node: any): boolean {
    if (typeof node !== 'undefined' && node.nodeType === 1 && node.attributes) {
        for (const attr of node.attributes) {
            if (attr && SELECTOR.test(attr.name)) return false;
        }
    }
    return true;
}
