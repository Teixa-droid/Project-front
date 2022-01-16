import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { PROJECTS } from '../../graphql/projects/queries';
import { Dialog } from '@mui/material';
import Dropdown from '../../components/Dropdown';
import { Enum_ProjectState } from '../../utils/enums';
import ButtonLoading from '../../components/ButtonLoading';
import { EDIT_PROJECT } from '../../graphql/projects/mutations';
import useFormData from '../../hooks/useFormData';
import PrivateComponent from '../../components/PrivateComponent';
import { Link } from 'react-router-dom';
import { CREATE_INSCRIPTION } from '../../graphql/inscriptions/mutations';
import { useUser } from '../../context/userContext';
import { toast } from 'react-toastify';
import { AccordionStyled, AccordionSummaryStyled, AccordionDetailsStyled } from '../../components/Accordion';



const IndexProjects = () => {
    const { data: queryData, loading, error } = useQuery(PROJECTS);

    useEffect(() => {
        console.log('Project data', queryData);
    }, [queryData]);

    if (loading) return <div> Waiting... </div>;

    if (queryData.Projects) {
        return (
            <div className='p-10 flex flex-col'>
                <div className='flex w-full items-center justify-center'>
                    <h1 className='text-2x1 font-bold text-gray-900'> Lista de Projetos</h1>
                </div>
                <PrivateComponent roleList={['ADMINISTRATOR', 'LEADER']}>
                    <div className='my-2 self-end'>
                        <button className='bg-indigo-500 text-gray-50 p-2 rounded-lg shadow-lg hover:bg-indigo-400'>
                            <Link to='/projects/new'>Criar um Novo Projeto</Link>
                        </button>
                    </div>
                </PrivateComponent>
                {queryData.Projects.map((project) => {
                    return <AccordionProject project={project} />;
                })}
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
                <AccordionSummaryStyled expandIcon={<i className='fas fa-chevron-down' />}>
                    <div className='flex w-full justify-between'>
                        <div className='uppercase font-bold text-gray-100'>
                            {project.name} - {project.status}
                        </div>
                    </div>
                </AccordionSummaryStyled>
                <AccordionDetailsStyled>
                    <PrivateComponent roleList={['ADMINISTRATOR']}>
                        <i className='mx-4 fas fa-pen text-yellow-600 hover:text-yellow-400'
                            onClick={() => {
                                setShowDialog(true);
                            }}
                        />
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
                        {project.objectives.map((objective) => {
                            return <Objective type={objective.type} description={objective.description} />;
                        })}
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

    const [editProject, { data: dataMutation, loading, error }] = useMutation(EDIT_PROJECT);

    const submitForm = (e) => {
        e.preventDefault();
        editProject({
            variables: {
                _id,
                fields: formData,
            },
        });
    };

    useEffect(() => {
        console.log('dataMutation', dataMutation);
    }, [dataMutation]);

    return (
        <div className='p-4'>
            <h1 className='font-bold'>Modificar estado do projeto</h1>
            <form
                ref={form}
                onChange={updateFormData}
                onSubmit={submitForm}
                className='flex flex-col items-center'
            >
                <Dropdown label='Estado do Projeto' name='status' options={Enum_ProjectState} />
                <ButtonLoading disabled={false} loading={loading} text='Confirmar' />
            </form>
        </div>
    );
};
const Objective = ({ type, description }) => {
    return (
        <div className='mx-5 my-4 bg-gray-50 p-8 rounded-lg flex flex-col items-center justify-center shadow-xl'>
            <div className='text-lg font-bold'>{type}</div>
            <div>{description}</div>
            <PrivateComponent roleList={['ADMINISTRATOR']}>

                <div>Editar</div>
            </PrivateComponent>
        </div>
    );
};

const ProjectInscription = ({ idProject, status, inscriptions }) => {
    console.log(inscriptions);
    const [stateInscription, setStateInscription] = useState('');
    const [createInscription, { data, loading, error }] = useMutation(CREATE_INSCRIPTION);
    const { userData } = useUser();

    useEffect(() => {
        if(userData && inscriptions){
            const flt = inscriptions.filter((el) => el.student._id === userData._id);
            if (flt.length > 0) {
                setStateInscription(flt[0].status);
            }
        }
    }, [userData, inscriptions]);

    useEffect(() => {
        if (data) {
            console.log(data);
            toast.success('Incrrição criada com sucesso.');
        }
    }, [data]);

    const confirmInscription = () => {
        createInscription({ variables: { project: idProject, student: userData._id } });
    };

    return (
        <>
        { stateInscription !== '' ?(
            <span> Já estas inscrito neste projeto e o estado é {stateInscription} </span>
        ): (
        <ButtonLoading
            onClick={() => confirmInscription()}
            disabled={status === 'INACTIVE'}
            loading={loading}
            text='Inscrever'
        />
        ) }
        </>
    );
};
export default IndexProjects;
