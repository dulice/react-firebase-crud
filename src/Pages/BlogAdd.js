import { addDoc, collection, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useContext, useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { db, storage } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import { BlogContext } from "../Context/BlogContext";
import { toast } from "react-toastify";

const BlogAdd = () => {
  const { categories } = useContext(BlogContext);
  const [content, setContent] = useState({
    title: "",
    category: "Romance",
    description: "",
    image: null,
    createdAt: Timestamp.now(),
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInput = (e) => {
    const newContent = { [e.target.name]: e.target.value };
    setContent({ ...content, ...newContent });
  };

  const validateInput = (text) => {
    setIsLoading(false);
    return toast.error(text);
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    if (!file) {
      validateInput("Please select an image file");
    } else if (content.title === "") {
      validateInput("Please enter a title");
    } else if (content.category === "") {
      validateInput("Please enter a category");
    } else if (content.description === "") {
      validateInput("Please enter a description");
    } else {
      const imageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(imageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading ${progress}% done`);
        },
        (err) => {
          alert(err.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            addDoc(collection(db, "posts"), {...content, image: downloadURL});
            setIsLoading(false);
            navigate("/");
          });
        }
      );
    }
  };
  return (
    <Container>
      <Card className="m-5">
        <Card.Header>
          <h5 className="text-primary text-center">Write A Post</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Label htmlFor="image" className="m-3 w-25">
              <img
                src={file ? URL.createObjectURL(file) : "https://pic.onlinewebfonts.com/svg/img_133373.png"}
                alt=""
                className="w-100"
              />
            </Form.Label>
            <br/>
            <Form.Control
              hidden={true}
              id="image"
              type="file"
              accept="image/*"
              name="image"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <Form.Label>Title: </Form.Label>
            <Form.Control name="title" onChange={(e) => handleInput(e)} />

            <Form.Group className="my-3">
              <Form.Label htmlFor="category">Category</Form.Label>
              <Form.Select
                id="category"
                name="category"
                onChange={(e) => handleInput(e)}
                required={true}
              >
                <option disabled={true}>Select</option>
                {categories.map((c, i) => (
                  <option key={i} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Label>Description: </Form.Label>
            <textarea
              className="form-control"
              rows={10}
              name="description"
              onChange={(e) => handleInput(e)}
            />
            <Button
              className="my-3 float-right"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Posting" : "Post"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogAdd;
