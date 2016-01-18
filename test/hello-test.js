import { describe, it } from 'mocha';
import { expect } from 'chai';

import { hello } from '../dist';

describe('hello tests', () => {
  it('message', () => {
    expect(hello()).to.equal('Hello from Player.me!');
  });
});
