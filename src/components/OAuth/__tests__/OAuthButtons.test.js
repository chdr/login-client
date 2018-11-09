import React from 'react';
import { shallow } from 'enzyme';
import OAuthButtons from '../OAuthButtons';
import OAuthButton from '../OAuthButton';

let wrapped;

beforeEach(() => {
  wrapped = shallow(<OAuthButtons />);
});

it('has two OAuth button components', () => {
  expect(wrapped.find(OAuthButton).length).toEqual(2);
});
