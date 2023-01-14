import { signOut } from 'firebase/auth'
import React, { useContext } from 'react'
import { Navbar, Container, Nav, Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { AuthContext } from '../Context/AuthContext'
import { auth } from '../firebaseConfig'
import { routes } from '../routes'

const Navs = () => {
  const { state , dispatch } = useContext(AuthContext);
  
  const handleLogout = () => {
    signOut(auth);
    dispatch({type: "Logout"});
  }
  return (
    <Navbar bg="dark" variant="dark" sticky='top'>
        <Container>
          <Navbar.Brand href="#" className="text-warning">Blog</Navbar.Brand>
          <Nav className="text-end">         
            {routes.map(r => (
                <LinkContainer key={r.name} to={r.path}>
                    <Button variant='dark' className='text-capitalize ms-3'>{r.name}</Button>
                </LinkContainer>
            ))}
            {state.user && 
            <>
              <Button variant='primary' className='ms-3'>{state.user.email}</Button>
              <Button variant='danger' className='ms-3' onClick={handleLogout}>Logout</Button>
              
            </>
            }
          </Nav>
        </Container>
      </Navbar>
  )
}

export default Navs