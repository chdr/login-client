import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';
import NativeLogin from '../NativeLogin';
import OAuthButtons from '../OAuth/OAuthButtons';

let wrapped;

beforeEach(() => {
  wrapped = shallow(<App />);
});

it('displays OAuth buttons component', () => {
  expect(wrapped.find(OAuthButtons).length).toEqual(1);
});

it('contains the signin form component', () => {
  expect(wrapped.find(NativeLogin).length).toEqual(1);
});
