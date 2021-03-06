import React from 'react';
import { useUser } from 'context/userContext';

function PrivateRoute({ roleList, children }) {
  const { userData } = useUser();

  if (roleList.includes(userData.rol)) {
    return children;
  }

  return (
    <div data-testid='not-authorized' className='text-9xl text-red-500 '>
      Não estas autorizado para ver este sitio.
    </div>
  );
}

export default PrivateRoute;
