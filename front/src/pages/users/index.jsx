import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USERS } from '../../graphql/users/queries';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Enum_Rol, Enum_UserState } from '../../utils/enums';
import PrivateRoute from '../../components/PrivateRoute';

const UsersIndex = () => {
    const { data, error, loading } = useQuery(GET_USERS);

    useEffect(() => {
    }, [data]);

    useEffect(() => {
        if (error) {
            toast.error('Error');
        }
    }, [error]);

    if (loading) return <div>Loading ...</div>;


    return (
        <PrivateRoute roleList={['ADMINISTRATOR']}>
        <div>
            User Data:
            <table className='table'>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Apelido</th>
                        <th>email</th>
                        <th>Identificação</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>editar</th>
                    </tr>
                </thead>
                <tbody>
                    {data && data.Users ? (
                        <>
                            {data.Users.map((u) => {
                                return (
                                    <tr key={u._id}>
                                        <td>{u.name}</td>
                                        <td>{u.lastname}</td>
                                        <td>{u.email}</td>
                                        <td>{u.identification}</td>
                                        <td>{Enum_Rol[u.rol]}</td>
                                        <td>{Enum_UserState[u.state]}</td>
                                        <td>
                                            <Link to={`/users/edit/${u._id}`}>
                                                <i className='fas fa-pen text-yellow-600 hover:bg-yellow-400 cursor-pointer' />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </>
                    ) : (
                        <div>Nao autorizado</div>
                    )}
                </tbody>
            </table>
        </div>
        </PrivateRoute>

    );
};

export default UsersIndex;
