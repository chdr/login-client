import React from 'react';
import { mount, unmount } from 'enzyme';
import axios from 'axios';
import { MemoryRouter } from 'react-router';
import MockAdapter from 'axios-mock-adapter';
import App from '../components/App';
import config from '../config';

describe('OAuth callback', () => {
  let wrapped;
  const queryParams = '?code=0&state=1';
  const mockAdapter = new MockAdapter(axios);

  afterEach(() => {
    mockAdapter.reset();
    wrapped.unmount();
  });

  afterAll(() => {
    mockAdapter.restore();
  });

  describe('github endpoint', () => {
    it('should display an error message of a 500 status from the server', (done) => {
      const mockResponseData = {
        detail: 'Undefined property: stdClass::$access_token',
        exception: {},
        status: 500,
        title: 'Internal Server Error',
        type: 'https://httpstatus.es/500'
      };

      mockAdapter
        .onGet(`${config.baseUri}/oauth/github-callback${queryParams}`)
        .reply(500, mockResponseData);

      wrapped = mount(
        <MemoryRouter initialEntries={[`/login/github${queryParams}`]}>
          <App />
        </MemoryRouter>
      );

      setTimeout(() => {
        wrapped.update();
        // expect a flash style message to exist
        expect(wrapped.find('div[role="alert"]').length).toEqual(1);
        // expect the status and status text to be displayed
        expect(wrapped.render().text()).toContain(mockResponseData.title);
        expect(wrapped.render().text()).toContain(mockResponseData.detail);

        done();
      }, 1);
    });

    it('should display an error message if 401 status (authentication failed) returned from server', (done) => {
      mockAdapter
        .onGet(`${config.baseUri}/oauth/github-callback${queryParams}`)
        .reply(401, '');

      wrapped = mount(
        <MemoryRouter initialEntries={[`/login/github${queryParams}`]}>
          <App />
        </MemoryRouter>
      );

      setTimeout(() => {
        wrapped.update();
        // expect a flash style message to exist
        expect(wrapped.find('div[role="alert"]').length).toEqual(1);
        // expect the status and status text to be displayed
        expect(wrapped.render().text()).toContain('Login-in failed');
        expect(wrapped.render().text()).toContain('The email address and password you entered did not match our records.');

        done();
      }, 1);
    });
  });

  describe('google endpoint', () => {
    it('should display an error message of a 500 status from the server', (done) => {
      const mockResponseData = {
        detail: 'Undefined property: stdClass::$access_token',
        exception: {},
        status: 500,
        title: 'Internal Server Error',
        type: 'https://httpstatus.es/500'
      };

      mockAdapter
        .onGet(`${config.baseUri}/oauth/google-callback${queryParams}`)
        .reply(500, mockResponseData);

      wrapped = mount(
        <MemoryRouter initialEntries={[`/login/google${queryParams}`]}>
          <App />
        </MemoryRouter>
      );

      setTimeout(() => {
        wrapped.update();
        // expect a flash style message to exist
        expect(wrapped.find('div[role="alert"]').length).toEqual(1);
        // expect the status and status text to be displayed
        expect(wrapped.render().text()).toContain(mockResponseData.title);
        expect(wrapped.render().text()).toContain(mockResponseData.detail);

        done();
      }, 1);
    });

    it('should display an error message if 401 status (authentication failed) returned from server', (done) => {
      mockAdapter
        .onGet(`${config.baseUri}/oauth/google-callback${queryParams}`)
        .reply(401, '');

      wrapped = mount(
        <MemoryRouter initialEntries={[`/login/google${queryParams}`]}>
          <App />
        </MemoryRouter>
      );

      setTimeout(() => {
        wrapped.update();
        // expect a flash style message to exist
        expect(wrapped.find('div[role="alert"]').length).toEqual(1);
        // expect the status and status text to be displayed
        expect(wrapped.render().text()).toContain('Login-in failed');
        expect(wrapped.render().text()).toContain('The email address and password you entered did not match our records.');

        done();
      }, 1);
    });
  });
});
