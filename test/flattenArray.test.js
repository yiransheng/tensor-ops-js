import {range, isNumber, every} from 'lodash';
import test from 'tape';
import {flattenArray} from '../lib/utils';

function randomArray(prob=0.5) {
  const n = Math.floor(Math.random() * 5);
  if (Math.random() < (1-prob)) {
    return range(n); 
  } else {
    return range(n).map(i => randomArray(prob * 0.8));
  }
}

test("array flatten function", t => {
  t.plan(3);

  function isFlatten(a) {
    return Array.isArray(a) && every(a, isNumber);
  }

  const result = flattenArray(randomArray());
  t.ok(isFlatten(result), "Result array is flat");

  const input1 = [[[[[1,2,3], [4,5,6]]]]];
  const output1 = flattenArray(input1);
  t.deepEqual(output1, [1,2,3,4,5,6]);

  const input2 = [[1,2,3], [4, [5, [6]]]];
  const output2 = flattenArray(input1);
  t.deepEqual(output2, [1,2,3,4,5,6]);

});
