import { doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useContext, useEffect, useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { db, storage } from "../firebaseConfig";
import { useNavigate, useParams } from "react-router-dom";
import { BlogContext } from "../Context/BlogContext";
import { toast } from "react-toastify";

const BlogEdit = () => {
  const { id } = useParams();
  const { posts, categories } = useContext(BlogContext);
  const [content, setContent] = useState({
    title: "",
    category: "Romance",
    description: "",
    image: null,
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const findPost = async () => {
      const post = await posts.find((post) => post.id === id);
      setContent(post);
    };
    findPost();
  }, [id, posts]);

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
    if (
      content.title === "" ||
      content.content === "" ||
      content.description === ""
    ) {
      validateInput("Please fill all the fields");
    } else if (!file) {
      await updateDoc(doc(db, "posts", id), content);
      setIsLoading(false);
      navigate("/");
      toast.success("Post has been updated");
    } else {
      const imagePath = content.image.split("/").find((s) => s.includes("?"));
      const filename = imagePath.substring(0, imagePath.indexOf("?"));
      const deleteImg = ref(storage, filename);
      await deleteObject(deleteImg);

      const imageRef = ref(storage, file.name);
      const uploadTask = uploadBytesResumable(imageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Uploading ${progress}% done`);
        },
        (err) => {
          toast.error(err.message);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(`File available at: ${downloadURL}`);
            updateDoc(doc(db, "posts", id), { ...content, image: downloadURL });
            setIsLoading(false);
            navigate("/");
            toast.success("Post has been updated");
          });
        }
      );
    }
  };

  return (
    <Container>
      <Card className="m-5">
        <Card.Header>
          <h5 className="text-primary text-center">Edit A Post</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Label htmlFor="image" className="m-3 w-25">
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : content.image
                    ? content.image
                    : "https://pic.onlinewebfonts.com/svg/img_133373.png"
                }
                alt=""
                className="w-100"
              />
            </Form.Label>
            <br />
            <Form.Control
              hidden={true}
              id="image"
              type="file"
              accept="image/*"
              name="image"
              onChange={(e) => setFile(e.target.files[0])}
            />

            <Form.Label>Title: </Form.Label>
            <Form.Control
              name="title"
              value={content.title}
              onChange={(e) => handleInput(e)}
            />

            <Form.Group className="my-3">
              <Form.Label htmlFor="category">Category</Form.Label>
              <Form.Select
                id="category"
                name="category"
                value={content.category}
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
              value={content.description}
              onChange={(e) => handleInput(e)}
            />
            <Button
              className="my-3 float-right"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Updating" : "Update"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogEdit;
