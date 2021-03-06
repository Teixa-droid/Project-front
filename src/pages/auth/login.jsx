import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ButtonLoading from 'components/ButtonLoading';
import Input from 'components/Input';
import { useAuth } from 'context/authContext';
import { LOGIN } from 'graphql/auth/mutations';
import useFormData from 'hooks/useFormData';

function Login() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { form, formData, updateFormData } = useFormData();
  // falta capturar error da mutation
  const [login, { data: dataMutation, loading: mutationLoading }] =
    useMutation(LOGIN);

  const submitForm = (e) => {
    e.preventDefault();

    login({
      variables: formData,
    });
  };

  useEffect(() => {
    if (dataMutation) {
      if (dataMutation.login.token) {
        setToken(dataMutation.login.token);
        navigate('../../');
      }
    }
  }, [dataMutation, setToken, navigate]);
  return (
    <div className='flex flex-col items-center justify-center w-full h-full p-10'>
      <h1 className='text-xl font-bold text-gray-900'>Iniciar sessao</h1>
      <form
        className='flex flex-col'
        onSubmit={submitForm}
        onChange={updateFormData}
        ref={form}
      >
        <Input name='email' type='email' label='Email' required />
        <Input name='password' type='password' label='Password' required />
        <ButtonLoading
          disabled={Object.keys(formData).length === 0}
          loading={mutationLoading}
          text='Iniciar sessao'
        />
      </form>
      <span>Nao tens conta?</span>
      <Link to='/auth/register'>
        <span className='text-blue-700'>Regista-te</span>
      </Link>
    </div>
  );
}

export default Login;
