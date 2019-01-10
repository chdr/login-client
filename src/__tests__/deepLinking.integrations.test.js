import React from 'react';
import { mount, unmount } from 'enzyme';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import App from '../components/App';
import NativeLoginFormContainer from '../components/NativeLoginForm.Container';

describe('deep linking functionality', () => {
  let wrapped;
  const OLD_ENV = process.env;
  const mockAdapter = new MockAdapter(axios);
  const testUrl = '/client';
  const testFwdParamValue = 'http%3A%2F%2Fwww.cgdev.com%3A8888%2Fadmin%2Fcustomers%2Fget%2Fid%2F571b3f10-0d8d-11e9-b94d-0050560134d5'

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.API_URL = 'http://login.chdrdev.com:8888';
    process.env.MARKETING_URL = 'http://www.chdrdev.com:8888';

    wrapped = mount(
      <MemoryRouter initialEntries={[`${testUrl}?fwd=${testFwdParamValue}`]}>
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

  describe('in the native login form', () => {
    it('should pass the fwd query parameter if found on application load', () => {
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

      // expect the container component to have the fwd parameter in its state
      expect(wrapped.exists('form')).toEqual(true);
      expect(wrapped.find(NativeLoginFormContainer).prop('fwd')).toEqual(testFwdParamValue);

      wrapped.find('form').simulate('submit');

      setTimeout(() => {
        wrapped.update();

        // after submitting, expect to be redirected as with any successful login
        expect(window.location.replace).toBeCalledWith(mockResponseHeaders.location);

        done();
      }, 0);
    });
  });

  describe('in the oauth callback buttons', () => {
    it('should pass the fwd query parameter if found on application load', () => {
      const gitHubSelector = `a[href="http://login.chdrdev.com:8888/oauth/github?fwd=${testFwdParamValue}"]`;
      const googleSelector = `a[href="http://login.chdrdev.com:8888/oauth/google?fwd=${testFwdParamValue}"]`;
      expect(wrapped.exists(gitHubSelector)).toEqual(true);
      expect(wrapped.exists(googleSelector)).toEqual(true);
    });
  });
});
