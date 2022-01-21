import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import Input from 'components/Input';
import { GET_USERS } from 'graphql/users/queries';
import { Link } from 'react-router-dom';
import Dropdown from 'components/Dropdown';
import ButtonLoading from 'components/ButtonLoading';
import useFormData from 'hooks/useFormData';
import { Enum_ObjectiveType } from 'utils/enums';
import { nanoid } from 'nanoid';
import { ObjContext, useObj } from 'context/objContext';
import { CREATE_PROJECT } from 'graphql/projects/mutations';

const NewProject = () => {
  const { form, formData, updateFormData } = useFormData();
  const [Userlist, setUserList] = useState({});

  // falta captura do erro da query
  const { data, loading } = useQuery(GET_USERS, {
    variables: {
      filter: { rol: 'LEADER', state: 'AUTHORIZED' },
    },
  });

  // falta msg success
  // falta captura do erro da query da mutation e verificar loading

  const [createProject] = useMutation(CREATE_PROJECT);

  useEffect(() => {
    if (data) {
      const lu = {};
      data.Users.forEach((element) => {
        lu[element._id] = element.email;
      });
      setUserList(lu);
    }
  }, [data]);

  const submitForm = (e) => {
    e.preventDefault();

    formData.objectives = Object.values(formData.objectives);
    formData.assumption = parseFloat(formData.assumption);
    createProject({
      variables: formData,
    });
  };

  if (loading) return <div>...Loading</div>;

  return (
    <div className='p-10 flex flex-col items-center'>
      <div className='self-start'>
        <Link to='/projects'>
          <i className='fas fa-arrow-left' />
        </Link>
      </div>
      <h1 className='text-2x1 font-bold text-gray-900'>Criar Novo Projeto</h1>
      <form ref={form} onChange={updateFormData} onSubmit={submitForm}>
        <Input name='name' label='Nome do Projeto' required type='text' />
        <Input
          name='assumption'
          label='Pressuposto do Projeto'
          required
          type='number'
        />
        <Input name='startdate' label='Data de inicio' required type='date' />
        <Input name='enddate' label='Data de fim' required type='date' />
        <Dropdown label='Leader' options={Userlist} name='leader' required />
        <Objectives />
        <ButtonLoading text='Criar Projeto' loading={false} disabled={false} />
      </form>
    </div>
  );
};

const Objectives = () => {
  const [objectiveList, setObjectiveList] = useState([]);
  const [maxObjectives, setMaxObjectives] = useState(false);
  const removeObjective = (id) => {
    setObjectiveList(objectiveList.filter((el) => el.props.id !== id));
  };

  const AggregateObjectiveComponent = () => {
    const id = nanoid();
    return <FormObjetive key={id} id={id} />;
  };

  useEffect(() => {
    if (objectiveList.length > 4) {
      setMaxObjectives(true);
    } else {
      setMaxObjectives(false);
    }
  }, [objectiveList]);

  return (
    <ObjContext.Provider value={{ removeObjective }}>
      <div>
        <span>Objetivos do Projeto</span>
        {!maxObjectives && (
          <button
            type='button'
            onClick={() =>
              setObjectiveList([
                ...objectiveList,
                AggregateObjectiveComponent(),
              ])
            }
          >
            <i className='fas fa-plus rounded-full bg-orange-500 hover:bg-orange-400 text-white p-2 mx-2 cursor-pointer' />
          </button>
        )}
        {objectiveList.map((objective) => objective)}
      </div>
    </ObjContext.Provider>
  );
};

const FormObjetive = ({ id }) => {
  const { removeObjective } = useObj();

  return (
    <div className='flex items-center'>
      <Input
        name={`nested||objectives||${id}||description`}
        label='Descricao'
        type='text'
        required
      />
      <Dropdown
        name={`nested||objectives||${id}||type`}
        options={Enum_ObjectiveType}
        label='Tipo de objetivo'
        required
      />
      <button type='button' onClick={() => removeObjective(id)}>
        <i className='fas fa-minus rounded-full bg-orange-500 hover:bg-orange-400 text-white p-2 cursor-pointer mt-6 ' />
      </button>
    </div>
  );
};

export default NewProject;
