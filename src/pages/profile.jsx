import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import ButtonLoading from 'components/ButtonLoading';
import Input from 'components/Input';
import { EDIT_PROFILE } from 'graphql/users/mutations';
import useFormData from 'hooks/useFormData';
import { uploadFormData } from 'utils/uploadFormData';
import { useUser } from 'context/userContext';
import { GET_USER } from 'graphql/users/queries';

function Profile() {
  const [editPicture, setEditPicture] = useState(false);
  const { form, formData, updateFormData } = useFormData();
  const { userData, setUserData } = useUser();
  // falta capturar error da mutation
  const [editProfile, { data: dataMutation, loading: loadingMutation }] =
    useMutation(EDIT_PROFILE);
  // falta capturar error da query
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
      setUserData({
        ...userData,
        mypicture: dataMutation.editProfile.mypicture,
      });
      toast.success('Perfil modificado com sucesso');
      refetch();
    }
  }, [dataMutation]);

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
      <h1 className='font-bold text-2x1 text-gray-900'>
        Perfil do utiliizador
      </h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input
          defaultValue={queryData.User.name}
          label='Nome'
          name='name'
          type='text'
          required
        />
        <Input
          defaultValue={queryData.User.lastname}
          label='Apelido'
          name='lastname'
          type='text'
          required
        />
        <Input
          defaultValue={queryData.User.identification}
          label='Identificação'
          name='identification'
          type='text'
          required
        />
        {queryData.User.mypicture && !editPicture ? (
          <div className='flex flex-col items-center'>
            <img
              className='h-32'
              src={queryData.User.mypicture}
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
            <Input label='Foto' name='mypicture' type='file' required />
            <button
              type='button'
              onClick={() => setEditPicture(false)}
              className='bg-indigo-300 p-1 my-2 rounded-md text-white'
            >
              Cancelar
            </button>
          </div>
        )}
        <ButtonLoading
          text='Confirmar'
          loading={loadingMutation}
          disabled={false}
        />
      </form>
    </div>
  );
}

export default Profile;
