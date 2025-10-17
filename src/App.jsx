import React, { Suspense, useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import routes from './routes/routesConfig/RoutesConfig';
import { restoreSession } from './features/auth/authSlice';
import LoadingSpinner from './components/loadingspiner/LoadingSpiner';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const routing = useRoutes(routes);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {routing}
    </Suspense>
  );
}

export default App;