import {range} from 'lodash';
import test from 'tape';
import {reshape, tensor} from '../modules';

test("reshape tensors", t => {
  t.plan(2);
  const input = range(24);
  const output1 =  
    [[[ 0,  1,  2,  3],
      [ 4,  5,  6,  7],
      [ 8,  9, 10, 11]],

     [[12, 13, 14, 15],
      [16, 17, 18, 19],
      [20, 21, 22, 23]]];

  const output2 = 
    [[ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11],
     [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]];

  t.deepEqual(reshape(input, [2,3,4]), tensor(output1));
  t.deepEqual(reshape(input, [-1,12]), tensor(output2));
});
