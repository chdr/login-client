import React from 'react';
import { mount, unmount } from 'enzyme';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import App from '../components/App';

describe('App component behavior', () => {
  describe('Native login form', () => {
    let wrapped;
    const OLD_ENV = process.env;
    const queryParams = '?code=0&state=1';
    const mockAdapter = new MockAdapter(axios);

    beforeEach(() => {
      jest.resetModules();
      process.env = { ...OLD_ENV };
      process.env.API_URL = 'http://login.chdrdev.com:8888';
      process.env.MARKETING_URL = 'http://www.chdrdev.com:8888';

      wrapped = mount(
        <MemoryRouter initialEntries={['/client']}>
          <App />
        </MemoryRouter>
      );
    });

    afterEach(() => {
      mockAdapter.reset();
      wrapped.unmount();
      process.env = OLD_ENV;
    });

    afterAll(() => {
      mockAdapter.restore();
    });

    it('should display an error message from the server', (done) => {
      const mockResponseData = {
        detail: 'Input failed validation',
        parameters: {
          id: {
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

      mockAdapter
        .onPost(process.env.API_URL)
        .reply(412, mockResponseData);

        wrapped.find('form').simulate('submit');

        setTimeout(() => {
          wrapped.update();

          expect(wrapped.exists('div[role="alert"]')).toEqual(true);
          expect(wrapped.render().text()).toContain(mockResponseData.title);
          expect(wrapped.render().text()).toContain(mockResponseData.detail);
          expect(wrapped.render().text()).toContain(mockResponseData.parameters.id.hostnameInvalidHostname);
          expect(wrapped.render().text()).toContain(mockResponseData.parameters.id.hostnameLocalNameNotAllowed);
          expect(wrapped.render().text()).toContain(mockResponseData.parameters.password.stringLengthTooShort);

          done();
        }, 0);
    });

    it('should display an error message if authentication failed', (done) => {
      mockAdapter
        .onPost(process.env.API_URL)
        .reply(401, '');

      wrapped.find('form').simulate('submit');

      setTimeout(() => {
        wrapped.update();

        expect(wrapped.exists('div[role="alert"]')).toEqual(true);
        expect(wrapped.render().text()).toContain('Login-in failed');
        expect(wrapped.render().text()).toContain('The email address and password you entered did not match our records.');

        done();
      }, 0);
    });

    it('should attempt a redirect if 200 response returned from server', (done) => {
      const mockResponseData = {
        id: 'test@getcheddar.com',
        firstName: null,
        lastName: null,
        timezone: null,
        isActive: 1
      };
      const mockResponseHeaders = {
        status: 200,
        location: 'http://www.chdrdev.com:8888/admin/dashboard/',
      };
      mockAdapter
        .onPost(process.env.API_URL)
        .reply(200, mockResponseData, mockResponseHeaders);

      window.location.replace = jest.fn();

      wrapped.find('form').simulate('submit');

      setTimeout(() => {
        wrapped.update();

        expect(window.location.replace).toBeCalledWith(mockResponseHeaders.location);

        done();
      }, 0);
    });
  });
});
