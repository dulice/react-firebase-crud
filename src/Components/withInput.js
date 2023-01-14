import { FacebookAuthProvider, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, db, facebookProvider, googleProvider } from "../firebaseConfig";

const UpdateComponent = (OriginalComponent) => {
  const NewComponent = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
      username: "",
      email: "",
      password: "",
    });

    const [fallbackUser, setFallbackUser] = useState({});

    const postUser = async (user) => {
        try {
            await addDoc(collection(db, "users"), user);
          } catch (e) {
            toast.error(e.message);
          }
    }

    const handleInput = (e) => {
      const newUser = { [e.target.name]: e.target.value };
      setUser({ ...user, ...newUser });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          // The signed-in user info.
          const user = result.user;
          setFallbackUser(user);
          navigate("/");
        })
        .then(() => {
          const { displayName, email, password, photoURL } = fallbackUser;
          addDoc(collection(db, 'users'), {
            displayName,
            email,
            password,
            photoURL
          });
        })
        .catch((error) => {
          toast.error(error.message);
        });
    };

    const handleFacebookLogin = () => {
        signInWithPopup(auth, facebookProvider)
          .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            console.log(user);
            navigate("/");
          })
          .catch((error) => {
            toast.error(error.message);
          });
      };

    const buttonStyle = { width: "max-content" };

    return (
      <OriginalComponent
        user={user}
        handleInput={handleInput}
        handleGoogleLogin={handleGoogleLogin}
        handleFacebookLogin={handleFacebookLogin}
        postUser={postUser}
        style={buttonStyle}
      />
    );
  };
  return NewComponent;
};

export default UpdateComponent;