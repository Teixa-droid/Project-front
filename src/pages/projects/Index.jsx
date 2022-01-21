import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Dialog } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ReactLoading from 'react-loading';
import { PROJECTS } from 'graphql/projects/queries';
import Dropdown from 'components/Dropdown';
import Input from 'components/Input';
import { Enum_ProjectState, Enum_ObjectiveType } from 'utils/enums';
import ButtonLoading from 'components/ButtonLoading';
import {
  DELETE_OBJECTIVE,
  EDIT_OBJECTIVE,
  EDIT_PROJECT,
} from 'graphql/projects/mutations';
import useFormData from 'hooks/useFormData';
import PrivateComponent from 'components/PrivateComponent';
import { CREATE_INSCRIPTION } from 'graphql/inscriptions/mutations';
import { useUser } from 'context/userContext';
import {
  AccordionStyled,
  AccordionSummaryStyled,
  AccordionDetailsStyled,
} from 'components/Accordion';

const IndexProjects = () => {
  const { data: queryData, loading } = useQuery(PROJECTS);

  if (loading) return <div> Waiting... </div>;

  if (queryData.Projects) {
    return (
      <div className='p-10 flex flex-col'>
        <div className='flex w-full items-center justify-center'>
          <h1 className='text-2x1 font-bold text-gray-900'>
            {' '}
            Lista de Projetos
          </h1>
        </div>
        <PrivateComponent roleList={['ADMINISTRATOR', 'LEADER']}>
          <div className='my-2 self-end'>
            <button
              type='button'
              className='bg-indigo-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-indigo-400'
            >
              <Link to='/projects/new'>Criar um Novo Projeto</Link>
            </button>
          </div>
        </PrivateComponent>
        {queryData.Projects.map((project) => (
          <AccordionProject project={project} />
        ))}
      </div>
    );
  }
  return <></>;
};

const AccordionProject = ({ project }) => {
  const [showDialog, setShowDialog] = useState(false);
  return (
    <>
      <AccordionStyled>
        <AccordionSummaryStyled
          expandIcon={<i className='fas fa-chevron-down' />}
        >
          <div className='flex w-full justify-between'>
            <div className='uppercase font-bold text-gray-100'>
              {project.name} - {project.status}
            </div>
          </div>
        </AccordionSummaryStyled>
        <AccordionDetailsStyled>
          <PrivateComponent roleList={['ADMINISTRATOR']}>
            <button
              type='button'
              onClick={() => {
                setShowDialog(true);
              }}
            >
              <i className='mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400' />
            </button>
          </PrivateComponent>
          <PrivateComponent roleList={['STUDENT']}>
            <ProjectInscription
              idProject={project._id}
              status={project.status}
              inscriptions={project.inscriptions}
            />
          </PrivateComponent>
          <div>Liderado Por: {project.leader.email} </div>
          <div className='flex'>
            {project.objectives.map((objective, index) => (
              <Objective
                index={index}
                _id={objective._id}
                idProject={project._id}
                type={objective.type}
                description={objective.description}
              />
            ))}
          </div>
        </AccordionDetailsStyled>
      </AccordionStyled>
      <Dialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
        }}
      >
        <FormEditProject _id={project._id} />
      </Dialog>
    </>
  );
};
const FormEditProject = ({ _id }) => {
  const { form, formData, updateFormData } = useFormData();

  // faltacapturar eeo da mutation
  // falta toast success
  const [editProject, { loading }] = useMutation(EDIT_PROJECT);

  const submitForm = (e) => {
    e.preventDefault();
    editProject({
      variables: {
        _id,
        fields: formData,
      },
    });
  };

  return (
    <div className='p-4'>
      <h1 className='font-bold'>Modificar estado do projeto</h1>
      <form
        ref={form}
        onChange={updateFormData}
        onSubmit={submitForm}
        className='flex flex-col items-center'
      >
        <Dropdown
          label='Estado do Projeto'
          name='status'
          options={Enum_ProjectState}
        />
        <ButtonLoading disabled={false} loading={loading} text='Confirmar' />
      </form>
    </div>
  );
};
const Objective = ({ index, _id, idProject, type, description }) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [
    removeObjective,
    { data: dataMutationRemove, loading: removeLoading },
  ] = useMutation(DELETE_OBJECTIVE, {
    refetchQueries: [{ query: PROJECTS }],
  });

  useEffect(() => {
    if (dataMutationRemove) {
      toast.success('objetivo eliminado');
    }
  }, [dataMutationRemove]);

  const runDelete = () => {
    removeObjective({ variables: { idProject, idObjective: _id } });
  };

  if (removeLoading)
    return (
      <ReactLoading
        data-testid='loading-in-button'
        type='spin'
        height={100}
        width={100}
      />
    );
  return (
    <div className='mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl'>
      <div className='text-lg font-bold'>{type}</div>
      <div>{description}</div>
      <PrivateComponent roleList={['ADMINISTRATOR', 'LEADER']}>
        <div className='flex my-2'>
          <button type='button' onClick={() => setShowEditDialog(true)}>
            <i className='fas fa-pen mx-2 text-yellow-500 hover:text-yellow-200 cursor-pointer' />
          </button>
          <button type='button' onClick={runDelete}>
            <i className='fas fa-trash mx-2 text-red-500 hover:text-yellow-200 cursor-pointer' />
          </button>
        </div>
        <Dialog open={showEditDialog} onClose={() => setShowEditDialog(false)}>
          <EditObjective
            description={description}
            type={type}
            index={index}
            idProject={idProject}
            setShowEditDialog={setShowEditDialog}
          />
        </Dialog>
      </PrivateComponent>
    </div>
  );
};

const EditObjective = ({
  description,
  type,
  index,
  idProject,
  setShowEditDialog,
}) => {
  const { form, formData, updateFormData } = useFormData();
  const [editObjective, { data: dataMutation, loading }] = useMutation(
    EDIT_OBJECTIVE,
    {
      refetchQueries: [{ query: PROJECTS }],
    }
  );

  useEffect(() => {
    if (dataMutation) {
      toast.success('Objetivo editado');
      setShowEditDialog(false);
    }
  }, [dataMutation, setShowEditDialog]);

  const submitForm = (e) => {
    e.preventDefault();
    editObjective({
      variables: {
        idProject,
        indexObjective: index,
        fields: formData,
      },
    }).catch((error) => {
      toast.error('Erro ao editar objetivo', error);
    });
  };
  return (
    <div className='p-4'>
      <h1 className='text-2x1 font-bold text-gray-900'>Editar objetivo</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Dropdown
          label='Tipo de objetivo'
          name='type'
          required
          options={Enum_ObjectiveType}
          defaultValue={type}
        />
        <Input
          label='Ddescrição do objetivo'
          name='description'
          required
          defaultValue={description}
        />
        <ButtonLoading
          text='Confirmar'
          disabled={Object.keys(formData).length === 0}
          loading={loading}
        />
      </form>
    </div>
  );
};

const ProjectInscription = ({ idProject, status, inscriptions }) => {
  const [stateInscription, setStateInscription] = useState('');
  // falta error desta mutation
  const [createInscription, { data, loading }] =
    useMutation(CREATE_INSCRIPTION);
  const { userData } = useUser();

  useEffect(() => {
    if (userData && inscriptions) {
      const flt = inscriptions.filter((el) => el.student._id === userData._id);
      if (flt.length > 0) {
        setStateInscription(flt[0].status);
      }
    }
  }, [userData, inscriptions]);

  useEffect(() => {
    if (data) {
      toast.success('Incrrição criada com sucesso.');
    }
  }, [data]);

  const confirmInscription = () => {
    createInscription({
      variables: { project: idProject, student: userData._id },
    });
  };

  return (
    <>
      {stateInscription !== '' ? (
        <span>
          {' '}
          Já estas inscrito neste projeto e o estado é {stateInscription}{' '}
        </span>
      ) : (
        <ButtonLoading
          onClick={() => confirmInscription()}
          disabled={status === 'INACTIVE'}
          loading={loading}
          text='Inscrever'
        />
      )}
    </>
  );
};
export default IndexProjects;
