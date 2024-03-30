import { createContext } from "react";

// this is a syntax to create context. this context will hold all states related to notes and by using this context even the lowest component can access these states. 
// NoteState.js has states and noteContext.js is its related context.
const noteContext = createContext();

export default noteContext;