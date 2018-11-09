import React from 'react';
import { mount, unmount } from 'enzyme';
import NativeLogin from '../NativeLogin';

let wrapped;

beforeEach(() => {
  // do nothing
  // real function is used to pass error information back up to parent component
  const mockOnSubmitError = () => {};
  const mockOnSuccessError = () => {};
  const mockClearOnSubmit = () => {};

  wrapped = mount(
    <NativeLogin
      onSubmitError={mockOnSubmitError}
      onSubmitSuccess={mockOnSuccessError}
      clearOnSubmit={mockClearOnSubmit}
    />
  );
});

afterEach(() => {
  wrapped.unmount();
});

it('has a form element', () => {
  expect(wrapped.find('form').length).toEqual(1);
});

it('has id and password inputs that can be changed', () => {
  // test that the id input can be updated
  wrapped.find('input[name="id"]').simulate('change', {
    target: {
      name: 'id',
      value: 'test@getcheddar.com'
    }
  });

  wrapped.update();

  expect(wrapped.find('input[name="id"]').prop('value')).toEqual('test@getcheddar.com');

  // test that the password input can be updated

  wrapped.find('input[name="password"]').simulate('change', {
    target: {
      name: 'password',
      value: 'badpassword'
    }
  });

  wrapped.update();

  expect(wrapped.find('input[name="password"]').prop('value')).toEqual('badpassword');
});

it('should display formatted error messages on response from server', () => {});
