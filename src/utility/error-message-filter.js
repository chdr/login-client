function errorMessageFilter({ response, authServer = '' }) {
  const { status } = response;
  let errorTitle = '';
  let errorDetail = '';

  switch (status) {
    case 401: {
      if (authServer === 'google') {
        errorTitle = 'Account not found';
        errorDetail = 'We\'re sorry, but the email address you selected from Google could not be found in Cheddar. Please try a different email address, or create an account at Cheddar.';
      } else {
        errorTitle = 'Log-in failed';
        errorDetail = 'The email address and password you entered did not match our records.';
      }
      break;
    }
    default: {
      errorTitle = response.data.title;
      errorDetail = response.data.detail;
      break;
    }
  }

  return Object.assign({}, {
    errorTitle,
    errorDetail
  });
}

export default errorMessageFilter;
