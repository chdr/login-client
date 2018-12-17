import React from 'react';
import { mount, unmount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import App from '../components/App';

describe('App component rendering', () => {
  const OLD_ENV = process.env;
  let wrapped;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.API_URL = 'http://login.chdrdev.com:8888';
    process.env.MARKETING_URL = 'http://www.chdrdev.com:8888';
    // MemoryRouter is provided by react router 4 for non-browser environments
    wrapped = mount(
      <MemoryRouter initialEntries={['/client']}>
        <App />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    wrapped.unmount();
    process.env = OLD_ENV;
  });

  it('stands up when given /client route', () => {
    expect(wrapped.exists('div.App')).toEqual(true);
  });

  it('renders a GitHub login button', () => {
    expect(wrapped.render().text()).toContain('Log in with GitHub');
    expect(wrapped.exists('a[href="http://login.chdrdev.com:8888/oauth/github"] button')).toEqual(true);
  });

  it('renders a Google login button', () => {
    expect(wrapped.render().text()).toContain('Log in with Google');
    expect(wrapped.exists('a[href="http://login.chdrdev.com:8888/oauth/google"] button')).toEqual(true);
  });

  it('contains a form with an email and password input, and a submit button', () => {
    // contains form
    expect(wrapped.find('form').length).toEqual(1);
    // contains email
    // htmlFor is used by react before rendering to DOM as for
    expect(wrapped.render().text()).toContain('Email');
    expect(wrapped.find('label[htmlFor="id"]').length).toEqual(1);
    // contains password
    expect(wrapped.render().text()).toContain('Password');
    expect(wrapped.find('label[htmlFor="password"]').length).toEqual(1);
    // contains submit button
    expect(wrapped.find('button[type="submit"]').length).toEqual(1);
  });

  it('contains a "Remember me" checkbox and forgotten password link', () => {
    // remember me
    expect(wrapped.find('input[type="checkbox"][name="rememberMe"]').length).toEqual(1);
    expect(wrapped.render().text()).toContain('Remember me');
    // forgot password
    expect(wrapped.exists('a[href="http://www.chdrdev.com:8888/#forgot-password"]')).toEqual(true);
    expect(wrapped.render().text()).toContain('Forgot your password?');
  });

  it('contains a link to sign up', () => {
    expect(wrapped.render().text()).toContain('Sign up');
    expect(wrapped.find('a[href="http://www.chdrdev.com:8888/signup"] button').length).toEqual(1);
  });
});
