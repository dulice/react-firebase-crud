import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { toast } from 'react-toastify';
import { auth } from '../firebaseConfig';

const ResetPasswordModal = ({show, setShow}) => {
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

      const handleForgotPassword = () => {
        if(email === "") {
          toast.error("Please enter your email address");
        } else {
          sendPasswordResetEmail(auth, email)
          .then(() => {
              setText("Your password has been reset. Please check you email");
          })
          .catch((err) => {
              toast.error(err.message);
          });
        }
    }
  return (
    <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {text && <Alert variant='success'>{text}</Alert>}
          <Form.Label>Please Enter Your Email: </Form.Label>
          <Form.Control name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShow(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleForgotPassword}>
            Send
          </Button>
        </Modal.Footer>
    </Modal>
  )
}

export default ResetPasswordModal