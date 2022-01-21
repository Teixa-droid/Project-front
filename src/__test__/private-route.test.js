import React from 'react';
import PrivateRoute from '../components/PrivateRoute';
import { render, screen, cleanup } from '@testing-library/react';
import { UserContext } from '../context/userContext';

afterEach(cleanup);
it('renders not authorized if the roles dont match', () => {
  render(
    <UserContext.Provider value={{ userData: { rol: 'LEADER' } }}>
      <PrivateRoute roleList={['ADMINISTRATOR']}>
        <div>Este children</div>
      </PrivateRoute>
    </UserContext.Provider>
  );
  expect(screen.getByTestId('not-authorized')).toHaveTextContent(
    'Não estas autorizado para ver este sitio.'
  );
});

it('renders the children if the user role is in the roleList', () => {
  render(
    <UserContext.Provider value={{ userData: { rol: 'ADMINISTRATOR' } }}>
      <PrivateRoute roleList={['ADMINISTRATOR']}>
        <div data-testid='children'>Este children</div>
      </PrivateRoute>
    </UserContext.Provider>
  );
  expect(screen.getByTestId('children')).toBeInTheDocument();
});
