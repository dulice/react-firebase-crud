import { deleteDoc, doc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import React, { useContext } from 'react'
import { Breadcrumb, Button, Card } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { db, storage } from '../firebaseConfig'
import { AuthContext } from '../Context/AuthContext';
import { toast } from 'react-toastify'

const Blog = ({post}) => {
    const { state } = useContext(AuthContext);
    const { user } = state;
    const navigate = useNavigate();
    const handleDelete = async (id, imageUrl) => {
        try{
            const imagePath = imageUrl.split('/').find(s => s.includes('?'));
            const filename = imagePath.substring(0, imagePath.indexOf('?'));
            const deleteImg = ref(storage, filename);
            await deleteObject(deleteImg);
            await deleteDoc(doc(db, 'posts', id));
            toast.success("Post has been deleted");
        } catch (err) {
            toast.error(err.message);
        }
    }
  return (
    <>
        <Card.Header className="d-flex justify-content-between align-items-end">
            <Breadcrumb className="mb-0">
                <Breadcrumb.Item>{post.category}</Breadcrumb.Item>
                <Breadcrumb.Item active>{post.title}</Breadcrumb.Item>
            </Breadcrumb>
            {user && <div>
                <Button variant="outline-success" className="me-1" onClick={() => navigate(`/blog_edit/${post.id}`)}><FaEdit /></Button>
                <Button variant="outline-danger" onClick={() => handleDelete(post.id, post.image)}><FaTrash /></Button>
            </div>}
        </Card.Header>
        <Card.Img src={post.image} alt="" />
        <Card.Body>{post.description}</Card.Body>
    </>
  )
}

export default Blog