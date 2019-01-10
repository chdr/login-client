import React from 'react';
import { mount, unmount } from 'enzyme';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import App from '../components/App';
import NativeLoginFormContainer from '../components/NativeLoginForm.Container';
import mockLocalStorage from '../utility/mocks/mockLocalStorage';

describe('use of localStorage', () => {
  let wrapped;
  const OLD_ENV = process.env;
  const mockAdapter = new MockAdapter(axios);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...OLD_ENV };
    process.env.API_URL = 'http://login.chdrdev.com:8888';
    process.env.MARKETING_URL = 'http://www.chdrdev.com:8888';
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage() });
  });

  afterEach(() => {
    mockAdapter.reset();
    wrapped.unmount();
    process.env = OLD_ENV;
    localStorage.clear();
  });

  afterAll(() => {
    mockAdapter.restore();
  });

    it('should load values to form found in localStorage', () => {
      const lsRememberMe = true;
      const lsId = 'test@getcheddar.com';
      localStorage.setItem('rememberMe', lsRememberMe);
      localStorage.setItem('id', lsId);

      wrapped = mount(
        <MemoryRouter initialEntries={['/client']}>
          <App />
        </MemoryRouter>
      );

      const expectedInitialState = {
        isSubmitting: false,
        id: lsId,
        password: '',
        rememberMe: lsRememberMe,
        idErrors: [],
        passwordErrors: [],
        rememberMeErrors: []
      };

      // check form state
      expect(wrapped.find(NativeLoginFormContainer).state()).toEqual(expectedInitialState);

      // check field states
      expect(wrapped.find('input[name="id"]').prop('value')).toEqual(lsId);
    });

    describe('setting and clearing localStorage', () => {
      const lsRememberMe = true;
      const lsId = 'test@getcheddar.com';

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

      window.location.replace = jest.fn();

      beforeEach(() => {
        mockAdapter
          .onPost(process.env.API_URL)
          .reply(200, mockResponseData, mockResponseHeaders);

        wrapped = mount(
          <MemoryRouter initialEntries={['/client']}>
            <App />
          </MemoryRouter>
        );
      });

      it('should set localStorage if rememberMe is Checked', (done) => {
        // change each form field
        wrapped.find('input[name="id"]').simulate('change', {
          target: {
            name: 'id',
            value: 'test@getcheddar.com'
          }
        });

        wrapped.find('input[name="password"]').simulate('change', {
          target: {
            name: 'password',
            value: 'thetestpassword'
          }
        });

        wrapped.find('input[name="rememberMe"]').simulate('change', {
          target: {
            name: 'rememberMe',
            value: true
          }
        });

        wrapped.find('form').simulate('submit');

        setTimeout(() => {
          wrapped.update();

          expect(localStorage.getItem('id')).toEqual(lsId);
          expect(localStorage.getItem('rememberMe')).toEqual(lsRememberMe.toString());

          done();
        }, 0);
      });

      it('should clear localStorage if rememberMe is not checked', (done) => {
        // change each form field
        wrapped.find('input[name="id"]').simulate('change', {
          target: {
            name: 'id',
            value: 'test@getcheddar.com'
          }
        });

        wrapped.find('input[name="password"]').simulate('change', {
          target: {
            name: 'password',
            value: 'thetestpassword'
          }
        });

        wrapped.find('input[name="rememberMe"]').simulate('change', {
          target: {
            name: 'rememberMe',
            value: false
          }
        });

        wrapped.find('form').simulate('submit');

        setTimeout(() => {
          wrapped.update();

          expect(localStorage.getItem('id')).toEqual(null);
          expect(localStorage.getItem('rememberMe')).toEqual(null);

          done();
        }, 0);
      });
    });
});
