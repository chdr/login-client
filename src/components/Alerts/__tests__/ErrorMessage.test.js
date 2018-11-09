import React from 'react';
import { mount, unmount } from 'enzyme';
import ErrorMessage from '../ErrorMessage';

let wrapped;
const title = 'This is a test error title';
const detail = 'This is a test error detail message';

beforeEach(() => {
  wrapped = mount(
    <ErrorMessage
      title={title}
      detail={detail}
    />
  );
});

afterEach(() => {
  wrapped.unmount();
});

it('displays the test error title', () => {
  expect(wrapped.render().text()).toContain(title);
});

it('displays the test error detail message', () => {
  expect(wrapped.render().text()).toContain(detail);
});
