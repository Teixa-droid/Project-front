import React, { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER } from '../../graphql/users/queries';
import Input from '../../components/Input';
import ButtonLoading from '../../components/ButtonLoading';
import useFormData from '../../hooks/useFormData';
import { EDIT_USER } from '../../graphql/users/mutations';
import { toast } from 'react-toastify';
import Dropdown from '../../components/Dropdown';
import { Enum_UserState } from '../../utils/enums';


const EditUser = () => {

    const { form, formData, updateFormData } = useFormData(null);
    const { _id } = useParams();

    const {
        data: queryData,
        error: queryError,
        loading: queryLoading
    } = useQuery(GET_USER, {
        variables: { _id },
    });
    const [editUser, { data: mutationData, loading: mutationLoading, error: mutationError }] =
        useMutation(EDIT_USER);

    const submitForm = (e) => {
        e.preventDefault();
        delete formData.rol;
        editUser({
            variables: { _id, ...formData},
        });
    };

    useEffect(() => {
        if(mutationData){
            toast.success("Utilizador modificado corretamente")
        }
       
    }, [mutationData]);

    useEffect(() => {
        if (mutationError) {
            toast.error('Utilizador modificado com suceso');
        }
        if (queryError) {
            toast.error('Erro ao consultar o utilizador');
        }

    }, [queryError, mutationError]);

    if (queryLoading) return <div>Loading...</div>;

    return (
        <div className='flew flex-col w-full h-full items-center justify-center p-10'>
            <Link to='/users'>
                <i className='fas fa-arrow-left text-gray-600 cursor-pointer font-bold text-x1 hover:text-gray-900' />
            </Link>
            <h1 className='m-4 text-3xl text-gray-800 font-bold text-center'>Editar User</h1>
            <form
                onSubmit={submitForm}
                onChange={updateFormData}
                ref={form}
                className='flex flex-col items-center justify-center'
            >
                <Input
                    label='Nome da pessoa:'
                    type='text'
                    name='name'
                    defaultValue={queryData.User.name}
                    required={true}
                />
                <Input
                    label='Apelido da pessoa:'
                    type='text'
                    name='lastname'
                    defaultValue={queryData.User.lastname}
                    required={true}
                />
                <Input
                    label='email da pessoa:'
                    type='email'
                    name='email'
                    defaultValue={queryData.User.email}
                    required={true}
                />
                <Input
                    label='Identificação da pessoa:'
                    type='text'
                    name='identification'
                    defaultValue={queryData.User.identification}
                    required={true}
                />
                <Dropdown
                    label='Estado da pessoa'
                    name='state'
                    defaultValue={queryData.User.state}
                    required={true}
                    options={Enum_UserState}
                />
                <span>Rol do utiliizador: {queryData.User.rol}</span>
                <ButtonLoading disabled={Object.keys(formData).length === 0} loading={mutationLoading} text='Accepted' />

            </form>
        </div>
    );
};

export default EditUser;
