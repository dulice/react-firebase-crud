import { createContext, useReducer } from 'react';

export const AuthContext = createContext();

const initial = {
    user: null,
};

const reducer = (state, action) => {
    switch (action.type) {
        case "Login":
            return { ...state, user: action.payload}

        case "Logout":
            return { ...state, user: null }
        
        default:
            return state;
    }
}
const ContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(reducer, initial);
    const value = { state, dispatch };
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default ContextProvider;