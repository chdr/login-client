import React from 'react';
import { mount, unmount } from 'enzyme';
import axios from 'axios';
import { MemoryRouter } from 'react-router';
import MockAdapter from 'axios-mock-adapter';
import App from '../components/App';
import config from '../config';

describe('native login form behavior', () => {
  let wrapped;
  const mockAdapter = new MockAdapter(axios);

  beforeEach(() => {
    // MemoryRouter is provided by react router 4 for non-browser environments
    wrapped = mount(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  afterEach(() => {
    wrapped.unmount();
    mockAdapter.reset();
  });

  afterAll(() => {
    mockAdapter.restore();
  });

  it('app displays a general error message if authentication failed on submit', (done) => {
    // Cheddar's server currently returns data: '' on 401
    mockAdapter
      .onPost(config.baseUri)
      .reply(401, '');

    // submit the form
    wrapped.find('form').simulate('submit');

    setTimeout(() => {
      wrapped.update();
      // expect a flash style message to exist
      expect(wrapped.find('div[role="alert"]').length).toEqual(1);
      // expect the status and status text to be displayed
      expect(wrapped.render().text()).toContain('Login-in failed');
      expect(wrapped.render().text()).toContain('The email address and password you entered did not match our records.');

      done();
    }, 0);
  });

  describe('server-side validation error messaging', () => {
    const mockResponseData = {
      detail: 'Input failed validation',
      parameters: {
        id: {
          emailAddressInvalidHostname: '\'f.c\' is not a valid hostname for the email address',
          hostnameInvalidHostname: 'The input does not match the expected structure for a DNS hostname',
          hostnameLocalNameNotAllowed: 'The input appears to be a local network name but local network names are not allowed'
        },
        password: {
          stringLengthTooShort: 'The input is less than 8 characters long'
        }
      },
      status: 412,
      title: 'Invalid parameter',
      type: '/api/doc/invalid-parameter'
    };

    const idParameterKeys = Object.keys(mockResponseData.parameters.id);
    const passwordParameterKeys = Object.keys(mockResponseData.parameters.password);

    beforeEach(() => {
      mockAdapter
        .onPost(config.baseUri)
        .reply(412, mockResponseData);
    });

    it('app displays a general error message if server-side validation failed', (done) => {
      // submit the form
      wrapped.find('form').simulate('submit');

      setTimeout(() => {
        wrapped.update();
        // expect a flash style message to exist
        expect(wrapped.find('div[role="alert"]').length).toEqual(1);
        // expect the status and status text to be displayed
        expect(wrapped.render().text()).toContain(mockResponseData.title);
        expect(wrapped.render().text()).toContain(mockResponseData.detail);

        done();
      }, 0);
    });

    it('app displays an error message inline if server-side validation failed for each failed validation', (done) => {
      // submit the form
      wrapped.find('form').simulate('submit');

      // wait for call to be intercepted
      setTimeout(() => {
        // update DOM
        wrapped.update();

        // check that specific error message is displayed
        idParameterKeys.forEach((k) => {
          expect(wrapped.render().text())
            .toContain(mockResponseData.parameters.id[k]);
        });

        passwordParameterKeys.forEach((k) => {
          expect(wrapped.render().text())
            .toContain(mockResponseData.parameters.password[k]);
        });

        done();
      }, 0);
    });

    it('should clear a parameter error messages on that specific input change', (done) => {
      // start with some parameter values
      wrapped.find('input[name="id"]').simulate('change', {
        target: { value: 'test@getcheddar.com', name: 'id' }
      });

      wrapped.find('input[name="password"]').simulate('change', {
        target: { value: 'thetestpassword', name: 'password' }
      });

      wrapped.update();

      // submit the form
      wrapped.find('form').simulate('submit');

      // wait for call to be intercepted
      setTimeout(() => {
        // update DOM
        wrapped.update();

        // change one of the inputs
        wrapped.find('input[name="id"]').simulate('change', {
          target: { value: '', name: 'id' }
        });

        // update DOM
        wrapped.update();

        // check that the error messages are gone for that input
        idParameterKeys.forEach((k) => {
          expect(wrapped.render().text())
            .not.toContain(mockResponseData.parameters.id[k]);
        });

        // check that the error message still exist for the other input
        passwordParameterKeys.forEach((k) => {
          expect(wrapped.render().text())
            .toContain(mockResponseData.parameters.password[k]);
        });

        done();
      }, 0);
    });
  });

  it('clears any error previous error messages on successful resubmit', (done) => {
    mockAdapter
      .onPost(config.baseUri)
      .reply(401, '');

    // submit the form
    wrapped.find('form').simulate('submit');

    setTimeout(() => {
      wrapped.update();
      // expect a flash style message to exist
      expect(wrapped.find('div[role="alert"]').length).toEqual(1);
      // expect the status and status text to be displayed
      expect(wrapped.render().text()).toContain('Login-in failed');
      expect(wrapped.render().text()).toContain('The email address and password you entered did not match our records.');

      mockAdapter.reset();

      mockAdapter
        .onPost(config.baseUri)
        .reply(200, {
          id: 'test@getcheddar.com',
          firstName: null,
          lastName: null,
          timezone: null,
          isActive: null
        });

      wrapped.find('form').simulate('submit');

      setTimeout(() => {
        wrapped.update();

        expect(wrapped.find('div[role="alert"]').length).toEqual(0);
        expect(wrapped.render().text()).not.toContain('Login-in failed');
        expect(wrapped.render().text()).not.toContain('The email address and password you entered did not match our records.');
        done();
      }, 0);
    }, 0);
  });
});
