import React, { useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import PrivateRoute from 'components/PrivateRoute';
import { GET_INSCRIPTIONS } from 'graphql/inscriptions/queries';
import { APROVE_REGISTER } from 'graphql/inscriptions/mutations';
import ButtonLoading from 'components/ButtonLoading';
import { toast } from 'react-toastify';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';

function IndexInscriptions() {
  // falta capturar error da query
  const { data, loading, refetch } = useQuery(GET_INSCRIPTIONS);

  useEffect(() => {}, [data]);
  if (loading) return <div>Loading...</div>;
  return (
    <PrivateRoute roleList={['ADMINISTRATOR', 'LEADER']}>
      <div className='p-10'>
        <div>Pagina de incrições</div>
        <div className='my-4'>
          <AccordionInscription
            title='Inscrições aceites'
            data={data.Inscriptions.filter((el) => el.status === 'ACCEPTED')}
          />
          <AccordionInscription
            title='Inscrições em espera'
            data={data.Inscriptions.filter((el) => el.status === 'PENDING')}
            refetch={refetch}
          />
          <AccordionInscription
            title='Inscrições rejeitadas'
            data={data.Inscriptions.filter((el) => el.status === 'REJECTED')}
          />
        </div>
      </div>
    </PrivateRoute>
  );
}

function AccordionInscription({ data, title, refetch = () => {} }) {
  return (
    <AccordionStyled>
      <AccordionSummaryStyled>
        {title} ({data.length})
      </AccordionSummaryStyled>
      <AccordionDetailsStyled>
        <div className='flex'>
          {data &&
            data.map((inscription) => (
              <Inscription inscription={inscription} refetch={refetch} />
            ))}
        </div>
      </AccordionDetailsStyled>
    </AccordionStyled>
  );
}

function Inscription({ inscription, refetch }) {
  const [approveRegistration, { data, loading, error }] =
    useMutation(APROVE_REGISTER);

  useEffect(() => {
    if (data) {
      toast.success('Success');
      refetch();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error('Erro');
    }
  }, [error]);

  const changeRegistrationStatus = () => {
    approveRegistration({
      variables: {
        approveRegistrationId: inscription._id,
      },
    });
  };

  return (
    <div className='bg-gray-900 text-gray-50 flex flex-col p-6 m-2 rounded-lg shadow-xl'>
      <span>{inscription.project.name}</span>
      <span>{inscription.student.name}</span>
      <span>{inscription.status}</span>
      {inscription.status === 'PENDING' && (
        <ButtonLoading
          onClick={() => {
            changeRegistrationStatus();
          }}
          text='Confirmar inscrição'
          loading={loading}
          disabled={false}
        />
      )}
    </div>
  );
}

export default IndexInscriptions;
