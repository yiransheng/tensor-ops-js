import {range} from 'lodash';
import test from 'tape';
import Tensor from '../lib-es2015/Tensor';
import Thunk from '../lib-es2015/Thunk';

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

  const tensor = new Tensor(Thunk.of(input), [24]);

  t.deepEqual(tensor.reshape([2, 3, 4]).tolist(), output1);
  t.deepEqual(tensor.reshape([2,   12]).tolist(), output2);

});

test("Tensor transpose", t=> {
 
  t.plan(2);

  const input = range(24);
  const tensor = new Tensor(Thunk.of(input), [4, 6]);

  const output = 
    [[ 0,  6, 12, 18],
     [ 1,  7, 13, 19],
     [ 2,  8, 14, 20],
     [ 3,  9, 15, 21],
     [ 4, 10, 16, 22],
     [ 5, 11, 17, 23]];

  const output2 = 
    [[[ 0, 12],
      [ 1, 13],
      [ 2, 14]],

     [[ 3, 15],
      [ 4, 16],
      [ 5, 17]],

     [[ 6, 18],
      [ 7, 19],
      [ 8, 20]],

     [[ 9, 21],
      [10, 22],
      [11, 23]]];

  t.deepEqual(tensor.transpose().tolist(), output);
  t.deepEqual(
    tensor
      .reshape([2, 4, 3])
      .transpose([1, 2, 0])
      .tolist(),
    output2);

});
