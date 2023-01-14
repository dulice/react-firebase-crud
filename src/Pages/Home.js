import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useContext } from 'react'
import { auth } from '../firebaseConfig';
import { AuthContext } from '../Context/AuthContext';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { Card, Container, Button } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { db } from '../firebaseConfig'
import { BlogContext } from '../Context/BlogContext';
import Blog from '../Components/Blog';

const Home = () => {
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;
  const { posts, getPosts } = useContext(BlogContext);

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
        getPosts(data);
    })
    return unsubscribe;
  },[getPosts]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if(user) {
        // console.log("user has authenticated", user.email)
        dispatch({type: "Login", payload: user});
      }
    });
  },[dispatch]);

  return (
    <Container fluid="md">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-end">
            <h6>Posts ({posts.length} posts found)</h6>
            {user && <Link to="/blog_add">
              <Button variant="outline-primary" title="add-post"><FaPlus /></Button>
            </Link>}
          </div>
        </Card.Header>
        <Card.Body>
          {posts?.map(post =>(
            <Card key={post.id} className="mb-3">
              <Blog post={post} />
            </Card>
          ))}         
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Home