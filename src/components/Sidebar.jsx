import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from 'context/authContext';
import { useUser } from 'context/userContext';
import PrivateComponent from 'components/PrivateComponent';

function SidebarLinks() {
  return (
    <ul className='mt-12'>
      <SidebarRoute to='' title='Inicio' icon='fas fa-home' />
      <SidebarRouteImage to='/perfil' title='Perfil' icon='fa fa-user' />
      <PrivateComponent roleList={['ADMINISTRATOR']}>
        <SidebarRoute to='/users' title='Users' icon='fas fa-user' />
      </PrivateComponent>
      <SidebarRoute to='/projects' title='Projetos' icon='fas fa-smile-wink' />
      <PrivateComponent roleList={['ADMINISTRATOR', 'LEADER']}>
        <SidebarRoute
          to='/inscriptions'
          title='Aprovação das inscroções'
          icon='fas fa-user'
        />
      </PrivateComponent>
      <Logout />
    </ul>
  );
}

function Logout() {
  const { setToken } = useAuth();
  const deleteToken = () => {
    setToken(null);
  };
  return (
    <li>
      <button type='button' onClick={() => deleteToken()}>
        <NavLink to='/auth/login' className='sidebar-route text-red-700'>
          <div className='flex items-center'>
            <i className='fas fa-sign-out-alt' />
            <span className='text-sm ml-2'>Logout</span>
          </div>
        </NavLink>
      </button>
    </li>
  );
}

function Logo() {
  return (
    <div className='py-3 w-full flex flex-col items-center justify-center'>
      <img src='study.png' alt='Logo' className='h-16' />
      <span className='my-2 text-xl font-bold text-center'>Titulo</span>
    </div>
  );
}

function Sidebar() {
  const [open, setOpen] = useState(true);
  return (
    <div className='flex flex-col md:flex-row flex-no-wrap md:h-full'>
      {/* Sidebar starts */}

      <div className='sidebar hidden md:flex'>
        <div className='px-8'>
          <Logo />
          <SidebarLinks />
        </div>
      </div>
      <div className='flex md:hidden w-full justify-between bg-gray-800 p-2 text-white'>
        <button type='button' onClick={() => setOpen(!open)}>
          <i className={`fas fa-${open ? 'times' : 'bars'}`} />
        </button>
        <i className='fas fa-home' />
      </div>
      {open && <ResponsiveSidebar />}
      {/* Sidebar ends */}
    </div>
  );
}
function ResponsiveSidebar() {
  return (
    <div>
      <div
        className='sidebar h-full z-40 absolute md:h-full sm:hidden transition duration-150 ease-in-out'
        id='mobile-nav'
      >
        <div className='px-8'>
          <Logo />
          <SidebarLinks />
        </div>
      </div>
    </div>
  );
}

function SidebarRoute({ to, title, icon }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? 'sidebar-route text-white bg-indigo-700'
            : 'sidebar-route text-gray-900 hover:text-white hover:bg-indigo-400'
        }
      >
        <div className='flex items-center'>
          <i className={icon} />
          <span className='text-sm ml-2'>{title}</span>
        </div>
      </NavLink>
    </li>
  );
}
function SidebarRouteImage({ to, title, icon }) {
  const { userData } = useUser();
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          isActive
            ? 'sidebar-route text-white bg-indigo-700'
            : 'sidebar-route text-gray-900 hover:text-white hover:bg-indigo-400'
        }
      >
        <div className='flex items-center'>
          {userData.mypicture ? (
            <img
              className='h-8 w-8 rounded-full'
              src={userData.mypicture}
              alt='mypicture'
            />
          ) : (
            <i className={icon} />
          )}
          <span className='text-sm ml-2'>{title}</span>
        </div>
      </NavLink>
    </li>
  );
}

export default Sidebar;
