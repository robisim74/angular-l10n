/**
 * Breadth First Search (BFS) algorithm for traversing & searching tree data structure of DOM
 * explores the neighbor nodes first, before moving to the next level neighbors.
 * Time complexity: between O(1) and O(|V|^2).
 */
export function getTargetNode(rootNode: HTMLElement): HTMLElement {
    return walk(rootNode);
}

const MAX_DEPTH = 10;

function walk(rootNode: HTMLElement): HTMLElement {
    const queue: HTMLElement[] = [];

    let iNode: HTMLElement;
    let depth = 0;
    let nodeToDepthIncrease = 1;

    queue.push(rootNode);
    while (queue.length > 0 && depth <= MAX_DEPTH) {
        iNode = queue.splice(0, 1)[0];
        if (isTargetNode(iNode)) return iNode;
        if (depth < MAX_DEPTH && iNode.childNodes) {
            for (const child of Array.from(iNode.childNodes)) {
                if (isValidNode(child as HTMLElement)) {
                    queue.push(child as HTMLElement);
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

function isTargetNode(node: HTMLElement): boolean {
    return typeof node !== 'undefined' && node.nodeType === 3 && !!node.nodeValue && node.nodeValue.trim() !== '';
}

/**
 * A valid node is not marked for translation.
 */
function isValidNode(node: HTMLElement): boolean {
    if (typeof node !== 'undefined' && node.nodeType === 1 && node.attributes) {
        for (const attr of Array.from(node.attributes)) {
            if (attr && /^l10n|translate/.test(attr.name)) return false;
        }
    }
    return true;
}
