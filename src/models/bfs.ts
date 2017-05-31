/**
 * Breadth First Search (BFS) algorithm for traversing & searching tree data structure of DOM
 * explores the neighbor nodes first, before moving to the next level neighbors.
 * Time complexity: between O(1) and O(|V|^2).
 */
export class BFS {

    private static readonly SELECTOR: RegExp = /^l10n|translate|locale/;

    private static readonly MAX_DEPTH: number = 10;

    /**
     * Target node is a non empty text node.
     */
    public static getTargetNode(rootNode: any): any {
        return this.walk(rootNode);
    }

    private static walk(rootNode: any): any {
        const queue: any[] = [];

        let iNode: any;
        let depth: number = 0;
        let nodeToDepthIncrease: number = 1;

        queue.push(rootNode);
        while (queue.length > 0 && depth <= this.MAX_DEPTH) {
            iNode = queue.shift();
            if (this.isTargetNode(iNode)) {
                return iNode;
            }
            if (depth < this.MAX_DEPTH && iNode.childNodes != null) {
                for (const child of iNode.childNodes) {
                    if (this.isValidNode(child)) {
                        queue.push(child);
                    }
                }
            }
            if (--nodeToDepthIncrease == 0) {
                depth++;
                nodeToDepthIncrease = queue.length;
            }
        }
        return rootNode;
    }

    private static isTargetNode(node: any): boolean {
        return typeof node !== "undefined" &&
            node.nodeType == 3 &&
            node.nodeValue != null &&
            node.nodeValue.trim() != "";
    }

    /**
     * A valid node is not marked for translation.
     */
    private static isValidNode(node: any): boolean {
        if (typeof node !== "undefined" && node.nodeType == 1 && node.attributes) {
            for (const attr of node.attributes) {
                if (this.SELECTOR.test(attr.name)) return false;
            }
        }
        return true;
    }

}
