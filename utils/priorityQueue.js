const pqObject = require('./priorityQueueObject');

// implement using implicit binary heap structure (array in level order) for logarithmic 
// insertion and removal runtime
const PriorityQueue = function() {
    this.queue = [];
    this.size = 0;
}

/* returns the number of elements in the priority queue
 */
PriorityQueue.prototype.getSize = function() {
    return this.size;
}

/* inserts an element into the queue by sorting the heap by priority (O(log(n)) time)
 * @param {Integer} priority: priority rating, will be sorted based on this rating
 * @param {Function} element: the function to be executed when popped off of the queue
 */
PriorityQueue.prototype.enqueue = function(priority, element) {
    object = new pqObject(priority, element);
    
    let hole = ++this.size;
    let holeParent = Math.floor(hole/2);
    while(hole > 1 && object.priority < this.queue[holeParent].priority) {
        this.queue[hole] = this.queue[holeParent];
        hole = holeParent;
        holeParent = Math.floor(hole/2);
    }
    this.queue[hole] = object;
}

/* removes the highest priority element from the list and returns. Re balances binary heap
 * @return {Function} the element with the highest priority in the queue 
 */
PriorityQueue.prototype.dequeue = function() {
    
    if(this.size === 0) {
        return null;
    }
    
    let hole = 1;
    let retObj = this.queue[hole];
    this.queue[hole] = this.queue[this.size--]; 

    let tmpObj = this.queue[hole];

    while(hole*2 <= this.size) {
        // find the smallest child
        let child = hole*2;
        if(child+1 <= this.size && this.queue[child].priority > this.queue[child+1].priority) {
            child++;
        }

        if(tmpObj.priority > this.queue[child].priority) {
            this.queue[hole] = this.queue[child];
            hole = child;
        } else {
            break;
        }
    }
    this.queue[hole] = tmpObj;

    return retObj.element;
}

module.exports = PriorityQueue;
