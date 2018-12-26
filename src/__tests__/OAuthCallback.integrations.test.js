import React from 'react';
import { mount, unmount } from 'enzyme';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import App from '../components/App';

describe('OAuthCallback', () => {
  let wrapped;
  let authServer = '';
  const OLD_ENV = process.env;
  const queryParams = '?code=0&state=1';
  const mockAdapter = new MockAdapter(axios);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.API_URL = 'http://login.chdrdev.com:8888';
    process.env.MARKETING_URL = 'http://www.chdrdev.com:8888';
  });

  afterEach(() => {
    mockAdapter.reset();
    wrapped.unmount();
    process.env = OLD_ENV;
  });

  afterAll(() => {
    mockAdapter.restore();
  });

  describe('for GitHub at /client/github?queryParams=qp', () => {
    authServer = 'github';

    it('should make API call and attempt redirect if success response returned', (done) => {
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
        .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
        .reply(200, mockResponseData, mockResponseHeaders);

      window.location.replace = jest.fn();

      wrapped = mount(
        <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
          <App />
        </MemoryRouter>
      );

      setTimeout(() => {
        wrapped.update();

        expect(window.location.replace).toBeCalledWith(mockResponseHeaders.location);

        done();
      }, 0);
    });

    it('should return the form with an error message if an error is returned from server', (done) => {
      const mockResponseData = {
        detail: 'Undefined property: stdClass::$access_token',
        exception: {},
        status: 500,
        title: 'Internal Server Error',
        type: 'https://httpstatus.es/500'
      };

      mockAdapter
        .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
        .reply(500, mockResponseData, { status: 500 });

      wrapped = mount(
        <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
          <App />
        </MemoryRouter>
      );

      setTimeout(() => {
        wrapped.update();
        // expect the status and status text to be displayed
        expect(wrapped.render().text()).toContain(mockResponseData.title);
        expect(wrapped.render().text()).toContain(mockResponseData.detail);
        // expect a flash style message to exist
        expect(wrapped.find('div[role="alert"]').length).toEqual(1);

        done();
      }, 0);
    });

  });

  describe('for Google at /client/github?queryParams=qp', () => {
    authServer = 'google';

    it('should make API call and attempt redirect if success response returned', (done) => {
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
        .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
        .reply(200, mockResponseData, mockResponseHeaders);

      window.location.replace = jest.fn();

      wrapped = mount(
        <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
          <App />
        </MemoryRouter>
      );

      setTimeout(() => {
        wrapped.update();

        expect(window.location.replace).toBeCalledWith(mockResponseHeaders.location);

        done();
      }, 0);
    });
  });
});
