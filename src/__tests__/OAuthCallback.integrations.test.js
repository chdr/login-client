import React from 'react';
import { mount, unmount } from 'enzyme';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import MockAdapter from 'axios-mock-adapter';
import App from '../components/App';
import OAuthEmailConfirmationForm from '../components/OAuth/OAuthEmailConfirmationForm.Container';

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

    it('should attempt redirect if 200 response returned with location header', (done) => {
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

    describe('if a 200 response is returned without a location header', () => {
      const mockResponseData = [
        'test@getcheddar.com',
        'test@cheddargetter.com'
      ];

      it('should return to a form with a list of emails', (done) => {
        mockAdapter
          .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
          .reply(200, mockResponseData, {});

        wrapped = mount(
          <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
            <App />
          </MemoryRouter>
        );

        setTimeout(() => {
          wrapped.update();

          // expect the resulting page to have a form
          expect(wrapped.find('form').length).toEqual(1);
          // with both email addresses
          expect(wrapped.render().text()).toContain(mockResponseData[0]);
          expect(wrapped.render().text()).toContain(mockResponseData[1]);
          // and a password field
          expect(wrapped.render().text()).toContain('Password');
          expect(wrapped.find('label[htmlFor="password"]').length).toEqual(1);
          // and submit button
          expect(wrapped.find('button[type="submit"]').length).toEqual(1);

          done();
        }, 0);
      });

      it('should indicate which authorization service was used', (done) => {
        const authServer = 'Google';

        mockAdapter
          .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
          .reply(200, mockResponseData, {});

        wrapped = mount(
          <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
            <App />
          </MemoryRouter>
        );

        setTimeout(() => {
          wrapped.update();

          expect(wrapped.render().text()).toContain(authServer);

          done();
        });
      });

      it('form should update values when modified', (done) => {
        mockAdapter
          .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
          .reply(200, mockResponseData, {});

        wrapped = mount(
          <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
            <App />
          </MemoryRouter>
        );

        setTimeout(() => {
          wrapped.update();

          // password can be changed
          wrapped.find('input[name="password"]').simulate('change', {
            target: {
              name: 'password',
              value: 'testpassword'
            }
          });

          wrapped.update();

          expect(wrapped.find('input[name="password"]').prop('value')).toEqual('testpassword');
          expect(wrapped.find(OAuthEmailConfirmationForm).state('password')).toEqual('testpassword');

          const firstEmailSelector = 'input[name="id"][value="test@getcheddar.com"]';
          const secondEmailSelector = 'input[name="id"][value="test@cheddargetter.com"]';

          // by default, the first email should be selected
          expect(wrapped.find(firstEmailSelector).prop('checked')).toEqual(true);
          expect(wrapped.find(secondEmailSelector).prop('checked')).toEqual(false);
          expect(wrapped.find(OAuthEmailConfirmationForm).state('id')).toEqual(mockResponseData[0]);

          // email can be changed
          wrapped.find(secondEmailSelector).simulate('change', {
            target: {
              name: 'id',
              value: 'test@cheddargetter.com'
            }
          });

          wrapped.update();

          expect(wrapped.find(secondEmailSelector).prop('checked')).toEqual(true);
          expect(wrapped.find(firstEmailSelector).prop('checked')).toEqual(false);
          expect(wrapped.find(OAuthEmailConfirmationForm).state('id')).toEqual(mockResponseData[1]);

          done();
        }, 0);
      });

      it('should attempt a redirect if submitted successfully', (done) => {
        const mockLoginResponseData = {
          id: 'test@getcheddar.com',
          firstName: null,
          lastName: null,
          timezone: null,
          isActive: 1
        };

        const mockLoginResponseHeaders = {
          status: 200,
          location: 'http://www.chdrdev.com:8888/admin/dashboard/',
        };

        mockAdapter
          .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
          .reply(200, mockResponseData, {})
          .onPost(process.env.API_URL)
          .reply(200, mockLoginResponseData, mockLoginResponseHeaders);

        wrapped = mount(
          <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
            <App />
          </MemoryRouter>
        );

        window.location.replace = jest.fn();

        setTimeout(() => {
          wrapped.update();

          // sanity checks to ensure correct page loaded
          // check if form exists
          expect(wrapped.exists('form')).toEqual(true);
          // check if password field exists
          expect(wrapped.exists('input[name="password"]')).toEqual(true);
          // check if both expected radio inputs exist
          const firstEmailSelector = 'input[name="id"][value="test@getcheddar.com"]';
          const secondEmailSelector = 'input[name="id"][value="test@cheddargetter.com"]';
          expect(wrapped.exists(firstEmailSelector)).toEqual(true);
          expect(wrapped.exists(secondEmailSelector)).toEqual(true);

          wrapped.find('form').simulate('submit');

          setTimeout(() => {
            wrapped.update();

            expect(window.location.replace).toBeCalledWith(mockLoginResponseHeaders.location);

            done();
          }, 0);
        }, 0);
      });

      it('should display an error message if an error is returned', (done) => {
        const mockLoginResponseData = {
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
          .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
          .reply(200, mockResponseData, {})
          .onPost(process.env.API_URL)
          .reply(412, mockLoginResponseData);

          wrapped = mount(
            <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
              <App />
            </MemoryRouter>
          );

          setTimeout(() => {
            wrapped.update();

            // sanity checks to ensure correct page loaded
            // check if form exists
            expect(wrapped.exists('form')).toEqual(true);
            // check if password field exists
            expect(wrapped.exists('input[name="password"]')).toEqual(true);
            // check if both expected radio inputs exist
            const firstEmailSelector = 'input[name="id"][value="test@getcheddar.com"]';
            const secondEmailSelector = 'input[name="id"][value="test@cheddargetter.com"]';
            expect(wrapped.exists(firstEmailSelector)).toEqual(true);
            expect(wrapped.exists(secondEmailSelector)).toEqual(true);

            wrapped.find('form').simulate('submit');

            setTimeout(() => {
              wrapped.update();

              expect(wrapped.exists('div[role="alert"]')).toEqual(true);
              expect(wrapped.render().text()).toContain(mockLoginResponseData.title);
              expect(wrapped.render().text()).toContain(mockLoginResponseData.detail);
              expect(wrapped.render().text()).toContain(mockLoginResponseData.parameters.id.hostnameInvalidHostname);
              expect(wrapped.render().text()).toContain(mockLoginResponseData.parameters.id.hostnameLocalNameNotAllowed);
              expect(wrapped.render().text()).toContain(mockLoginResponseData.parameters.password.stringLengthTooShort);

              done();
            }, 0);
          }, 0);
      });
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

    it('should display unique error message if 401 returned from Google callback', (done) => {
      mockAdapter
      .onGet(`${process.env.API_URL}/oauth/${authServer}-callback${queryParams}`)
      .reply(401, '');

      wrapped = mount(
        <MemoryRouter initialEntries={[`/client/${authServer}${queryParams}`]}>
          <App />
        </MemoryRouter>
      );

      setTimeout(() => {
        wrapped.update();

        expect(wrapped.exists('div[role="alert"]')).toEqual(true);
        expect(wrapped.render().text()).toContain('Account not found');
        expect(wrapped.render().text()).toContain('We\'re sorry, but the email address you selected from Google could not be found in Cheddar. Please try a different email address, or create an account at Cheddar.');

        done();
      }, 0);
    });

    // TODO - A lot of the tests in the GitHub describe should be replicated
    // with Google. Consider rewriting so that each test is applied as both
    // options are iterated over.
  });
});
