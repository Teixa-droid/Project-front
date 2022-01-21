import React, { useState, useEffect } from 'react';
import PrivateLayout from 'layouts/PrivateLayout';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserContext } from 'context/userContext';
import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Index from 'pages/Index';
import Page2 from 'pages/Page2';
import IndexCategory1 from 'pages/category1/Index';
import Category1 from 'pages/category1/Category1Page1';
import UsersIndex from 'pages/users';
import EditUser from 'pages/users/edit';
import AuthLayout from 'layouts/AuthLayout';
import { AuthContext } from 'context/authContext';
import Register from 'pages/auth/register';
import IndexInscriptions from 'pages/inscriptions';
import Login from 'pages/auth/login';
import IndexProjects from 'pages/projects/Index';
import jwt_decode from 'jwt-decode';
import 'styles/globals.css';
import 'styles/table.css';
import NewProject from 'pages/projects/NewProject';
import Profile from 'pages/profile';

const httpLink = createHttpLink({
  // uri: 'http://localhost:4000/graphql',
   uri: 'https://servidor-gp.herokuapp.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem('token'));
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink),
});

function App() {
  const [userData, setUserData] = useState({});
  const [authToken, setAuthToken] = useState('');

  const setToken = (token) => {
    setAuthToken(token);
    if (token) {
      localStorage.setItem('token', JSON.stringify(token));
    } else {
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    if (authToken) {
      const decoded = jwt_decode(authToken);
      setUserData({
        _id: decoded._id,
        name: decoded.name,
        lastname: decoded.lastname,
        identification: decoded.identification,
        email: decoded.email,
        rol: decoded.rol,
        mypicture: decoded.mypicture,
      });
    }
  }, [authToken]);

  return (
    <ApolloProvider client={client}>
      <AuthContext.Provider value={{ authToken, setAuthToken, setToken }}>
        <UserContext.Provider value={{ userData, setUserData }}>
          <BrowserRouter>
            <Routes>
              <Route path='/' element={<PrivateLayout />}>
                <Route path='' element={<Index />} />
                <Route path='/users' element={<UsersIndex />} />
                <Route path='/users/edit/:_id' element={<EditUser />} />
                <Route path='/projects' element={<IndexProjects />} />
                <Route path='/projects/new' element={<NewProject />} />
                <Route path='/inscriptions' element={<IndexInscriptions />} />
                <Route path='/perfil' element={<Profile />} />
                <Route path='page2' element={<Page2 />} />
                <Route path='category1' element={<IndexCategory1 />} />
                <Route path='category1/page1' element={<Category1 />} />
              </Route>
              <Route path='/auth' element={<AuthLayout />}>
                <Route path='register' element={<Register />} />
                <Route path='login' element={<Login />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
      </AuthContext.Provider>
    </ApolloProvider>
  );
}

export default App;
