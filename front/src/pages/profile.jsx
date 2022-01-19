import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import ButtonLoading from '../components/ButtonLoading';
import Input from '../components/Input';
import { EDIT_PROFILE } from '../graphql/users/mutations.js';
import useFormData from '../hooks/useFormData.js';
import { uploadFormData } from '../utils/uploadFormData';
import { useUser } from '../context/userContext.js';
import { GET_USER } from '../graphql/users/queries.js';
import { toast } from 'react-toastify';

const Profile = () => {

    const [editPicture, setEditPicture] = useState(false);
    const { form, formData, updateFormData } = useFormData();
    const { userData, setUserData } = useUser();

    const [editProfile, { data: dataMutation, error: errorMutation, loading: loadingMutation }] =
        useMutation(EDIT_PROFILE);

    const {
        data: queryData,
        loading: queryLoading,
        refetch,
    } = useQuery(GET_USER, {
        variables: {
            _id: userData._id,
        },
    });

    useEffect(() => {
        if (dataMutation) {
            setUserData({ ...userData, picture: dataMutation.editProfile.picture });
            toast.success('Perfil modificado com sucesso');
            refetch();
          }
    }, [dataMutation]);

    useEffect(() => {
        console.log('ud', queryData);
    }, [queryData]);

    const submitForm = async (e) => {
        e.preventDefault();

        const formUploaded = await uploadFormData(formData);

        editProfile({
            variables: {
                _id: userData._id,
                fields: formUploaded,
            },
        });
    };

    if (queryLoading) return <div data-testid='loading'>Loading...</div>;

    return (
        <div className='p-10 flex flex-col items-center justify-center w-full-width'>
            <h1 className='font-bold text-2x1 text-gray-900'>Perfil do utiliizador</h1>
            <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
                <Input
                    defaultValue={queryData.User.name}
                    label='Nome'
                    name='name'
                    type='text'
                    required={true}
                />
                <Input
                    defaultValue={queryData.User.lastname}
                    label='Apelido'
                    name='lastname'
                    type='text'
                    required={true}
                />
                <Input
                    defaultValue={queryData.User.identification}
                    label='Identificação'
                    name='identification'
                    type='text'
                    required={true}
                />
                {queryData.User.picture && !editPicture ? (
                    <div className='flex flex-col items-center'>
                        <img
                            className='h-32'
                            src={queryData.User.picture}
                            alt='Foto Utilizador'
                        />
                        <button
                            type='button'
                            onClick={() => setEditPicture(true)}
                            className='bg-indigo-300 p-1 my-2 rounded-md text-white'
                        >
                            Mudar imagem
                        </button>
                    </div>
                ) : (
                    <div>
                        <Input label='Foto' name='picture' type='file' required />
                        <button
                            type='button'
                            onClick={() => setEditPicture(false)}
                            className='bg-indigo-300 p-1 my-2 rounded-md text-white'
                        >
                            Cancelar
                        </button>
                    </div>
                )}
                <ButtonLoading text='Confirmar' loading={loadingMutation} disabled={false} />
            </form>
        </div>
    );
};

export default Profile;
