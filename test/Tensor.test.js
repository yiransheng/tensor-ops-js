import {range} from 'lodash';
import test from 'tape';
import Tensor from '../modules/Tensor';

test("Tensor reshape", t => {
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

  const tensor = new Tensor(input, [24]);

  t.deepEqual(tensor.reshape([2, 3, 4]).tolist(), output1);
  t.deepEqual(tensor.reshape([2,   12]).tolist(), output2);

});
