const pqObject = require('../utils/priorityQueueObject');
const pQueue = require('../utils/priorityQueue');

const expect = require('chai').expect;

describe('PriorityQueue and PriorityQueueObject Test', function() {
    describe('PriorityQueueObject Test', function() {
        it('PriorityQueueObject stores elements and priorities correctly', function() {
            
            function isFunction(functionToCheck) {
                var getType = {};
                return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
            }
            
            let tmpVal = 0
            setVal = function() {
                tmpVal = 5;
            }
            let priority = 100;
            element = new pqObject(priority, setVal);

            element.element();
        
            expect(element.priority).to.equal(100);
            expect(isFunction(element.element)).to.be.true;
            expect(tmpVal).to.equal(5);
        });
    });

    describe('PriorityQueue Tests', function() {
        it('queue initialises with valid params', function() {
            q = new pQueue();

            expect(q.size).to.equal(0);
            expect(q.queue).to.be.empty;
        });

        it('queue enqueues with expected behaviour', function() {
            q = new pQueue();

            q.enqueue(5, 5);
            q.enqueue(4, 4);
            q.enqueue(6, 6);
            q.enqueue(1, 1);
            
            expect(q.queue[1]).to.eql({ priority: 1, element: 1 });
            expect(q.queue[2]).to.eql({ priority: 4, element: 4 });
            expect(q.queue[3]).to.eql({ priority: 6, element: 6 });
            expect(q.queue[4]).to.eql({ priority: 5, element: 5 });
            
            expect(q.getSize()).to.equal(4);
        });

        it('queue dequeues with expected behaviour', function() {
            let element;

            q = new pQueue();

            q.enqueue(5, 5);
            q.enqueue(4, 4);
            q.enqueue(6, 6);
            q.enqueue(1, 1);
        
            expect(q.getSize()).to.equal(4);
            
            element = q.dequeue();
            expect(element).to.equal(1);
            expect(q.getSize()).to.equal(3);
            
            element = q.dequeue();
            expect(element).to.equal(4);
            expect(q.getSize()).to.equal(2);
            
            element = q.dequeue();

            expect(element).to.equal(5);
            expect(q.getSize()).to.equal(1);
            
            element = q.dequeue();
            expect(element).to.equal(6);
            expect(q.getSize()).to.equal(0);
            
            element = q.dequeue();
            expect(element).to.be.null;
            expect(q.getSize()).to.equal(0);
        });
    });
});
