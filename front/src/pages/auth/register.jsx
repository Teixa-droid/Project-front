import { useMutation } from '@apollo/client';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ButtonLoading from '../../components/ButtonLoading';
import Dropdown from '../../components/Dropdown';
import Input from '../../components/Input';
import { REGISTRATION } from '../../graphql/auth/mutations';
import useFormData from '../../hooks/useFormData';
import { Enum_Rol } from '../../utils/enums';
import { useNavigate } from 'react-router';
import { useAuth } from '../../context/authContext';

const Register = () => {
    const { setToken } = useAuth();
    const navigate = useNavigate();
    const { form, formData, updateFormData } = useFormData();
    const [registration, { data: dataMutation, loading: loadingMutation, error: errorMutation }] = useMutation(REGISTRATION);

    const submitForm = (e) => {
        e.preventDefault();
        registration({ variables: formData });
    };

    useEffect(() => {
        if (dataMutation) {
            if (dataMutation.registration.token) {
               localStorage.setItem('token', dataMutation.registration.token);
                navigate('/');
            }
        }
    }, [dataMutation, setToken, navigate]);

    return (
        <div className='flex flex-col h-full w-full items-center justify-center'>
            <h1 className='text-3x1 font-bold my-4'>Register</h1>
            <form className='flex flex-col' onSubmit={submitForm} onChange={updateFormData} ref={form}>
                <div className='grid grid-cols-2 gap-5'>
                    <Input label='Nome:' name='name' type='text' required />
                    <Input label='Apelido:' name='lastname' type='text' required />
                    <Input label='Documento:' name='identification' type='text' required />
                    <Dropdown label='Rol desejado:' name='rol' required={true} options={Enum_Rol} />
                    <Input label='Email:' name='email' type='email' required />
                    <Input label='Password:' name='password' type='password' required />
                </div>
                <ButtonLoading
                    disabled={Object.keys(formData).length === 0}
                    loading={false}
                    text='Registar'
                />
            </form>
            <span>Já estás registado?</span>
            <Link to='/auth/login'>
                <span className='text-blue-700'>Inicia a sessão</span>
            </Link>
        </div>
    );
};

export default Register;
