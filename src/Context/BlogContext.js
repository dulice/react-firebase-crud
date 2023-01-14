import { createContext, useCallback, useState } from 'react';

export const BlogContext = createContext();

const BlogContextProvider = ({children}) => {
    const categories = ["Romance", "Adventure", "Comedy"];
    const [posts, setPosts] = useState([]);
    
    const getPosts = useCallback((posts) => {
        setPosts(posts);
    },[])
    const value = { posts, getPosts, categories };
    return (
        <BlogContext.Provider value={value}>
            {children}
        </BlogContext.Provider>
    )
}

export default BlogContextProvider;