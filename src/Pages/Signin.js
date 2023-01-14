import { signInWithEmailAndPassword } from 'firebase/auth';
import { Button, Card, Container, Form } from 'react-bootstrap'
import { auth } from '../firebaseConfig';
import withInput from '../Components/withInput';
import { useNavigate } from 'react-router-dom';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import ResetPasswordModal from './ResetPasswordModal';
import { useState } from 'react';
import { toast } from 'react-toastify';

const Signin = (props) => {
    const {user, handleInput, handleGoogleLogin, handleFacebookLogin, style } = props;
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, user.email, user.password)
            .then((userCredential) => {
                // console.log(userCredential.user);
                navigate('/');
            })
            .catch((err) => {
                toast.error(err.message);
            })
    }

  return (
    <Container>
        <Card className='m-5'>
            <Card.Header>
                <h5 className='text-primary text-center'>SignIn</h5>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Label>Username: </Form.Label>
                    <Form.Control name="username" value={user.username} onChange={(e) => handleInput(e)}/>

                    <Form.Label>Email: </Form.Label>
                    <Form.Control name="email" type='email' value={user.email} onChange={(e) => handleInput(e)}/>

                    <Form.Label>Password: </Form.Label>
                    <Form.Control name="password" type='password' value={user.password} onChange={(e) => handleInput(e)}/>
                    <Button className='my-3 float-right' type="submit">SignIn</Button>
                    <p className='text-primary text-center' onClick={() => setShow(true)}>Forgot your password?</p>
                    <ResetPasswordModal show={show} setShow={setShow}/>
                    <hr />
                    <h6 className='text-center'>OR</h6>
                    <GoogleLoginButton style={style} onClick={() => handleGoogleLogin()} />
                    <FacebookLoginButton style={style} onClick={() => handleFacebookLogin()} />
                </Form>
            </Card.Body>
        </Card>
    </Container>
  )
}

export default withInput(Signin);