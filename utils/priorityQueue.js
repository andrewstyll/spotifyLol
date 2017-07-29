const pqObject = require('./priorityQueueObject');

// implement using implicit binary heap structure (array in level order) for logarithmic 
// insertion and removal runtime
const PriorityQueue = function(length) {
    // queue must at least be of size 2 as index 0 is always left empty
    if(length < 2) {
        length = 2;
    }
    this.queue = [length];
    this.size = 0;
}

/* returns the number of elements in the priority queue
 */
PriorityQueue.prototype.size = function() {
    return this.size;
}

/* resizes array to double the length. Attempting to avoid reallocating memory for object
 */
PriorityQueue.prototype.resizeQueue = function() {
    currentLength = this.queue.length;
    newLength = this.queue.length*2;
    
    let newQueue = [newLength];
    for(let i = 1; i < currentLength; i++) {
        newQueue[i] = this.queue[i];
    }
    this.queue = newQueue;
}
/* inserts an element into the queue by sorting the heap by priority (O(log(n)) time)
 * @param {Integer} priority: priority rating, will be sorted based on this rating
 * @param {Function} element: the function to be executed when popped off of the queue
 */
PriorityQueue.prototype.enqueue = function(priority, element) {
    object = new pqObject(priority, element);
    
    if(size == this.queue.length-1) {
        this.resizeQueue();
    }
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
    
    let hole = 1;
    let retObject = this.queue[hole];
    this.queue[hole] = this.queue[size--]; 

    let tmpObj = this.queue[hole];

    while(hole*2 <= size) {
        // find the smallest child
        let child = hole*2;
        if(child+1 <= size && this.queue[child].priority < this.queue[child+1].priority) {
            child++;
        }

        if(tmp.priority > this.queue[child].priority) {
            this.queue[hole] = this.queue[child];
            hole = child;
        } else {
            break;
        }
    }
    this.queue[hole] = tmpObject;
}

module.exports = PriorityQueue;
