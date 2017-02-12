/**
 * Breadth First Search (BFS) algorithm for traversing & searching tree data structure of DOM
 * explores the neighbor nodes first, before moving to the next level neighbors.
 * Time complexity: between O(1) and O(|V|^2).
 */
export class BFS {

    /**
     * Target node is a non empty text node.
     */
    public getTargetNode(rootNode: any): any {
        return this.walk(rootNode);
    }

    private walk(rootNode: any): any {
        let queue: any[] = [];
        let iNode: any;

        queue.push(rootNode);

        while (queue.length > 0) {
            iNode = queue.shift();
            if (this.isTargetNode(iNode)) {
                return iNode;
            }
            for (let child of iNode.childNodes) {
                queue.push(child);
            }
        }
        return null;
    }

    private isTargetNode(node: any): boolean {
        return typeof node !== "undefined" &&
            node.nodeValue != null &&
            node.nodeValue.trim() != "" &&
            node.nodeType == 3;
    }

}
