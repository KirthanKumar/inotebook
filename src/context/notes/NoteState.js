import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";

  // For now we are hardcoring data. Later will do API request and fetch data from database.
  const initialnotes = [];

  const [notes, setNotes] = useState(initialnotes);

  // get all notes
  const getNotes = async () => {
    // API Call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjYwNzNlYTk1ZTE2NzQzMTQzYzVjZmRkIn0sImlhdCI6MTcxMTc2MzkwOH0.p1OXEKlS5tD6rxXDuoRAn9Uncoud-QkD8it89DG6BqY", // hardcoring for now
      },
    });

    const json = await response.json();
    // console.log(json);
    setNotes(json);
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    // API CALL
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjYwNzNlYTk1ZTE2NzQzMTQzYzVjZmRkIn0sImlhdCI6MTcxMTc2MzkwOH0.p1OXEKlS5tD6rxXDuoRAn9Uncoud-QkD8it89DG6BqY", // hardcoring for now
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    console.log("Adding a new note");
    const note = {
      _id: "6607d37d49f68db91e430cb6", // _id should be unique
      user: "66073ea95e16743143c5cfde",
      title: title,
      description: description,
      tag: tag,
      date: "2024-03-30T08:55:25.620Z [ADDED]",
      __v: 0,
    };

    // setNotes(notes.push(note)); // concat returns an array whereas push updates an array. so we use concat not push
    setNotes(notes.concat(note));
  };

  // Delete a Note
  const deleteNote = async (id) => {
    // API CALL
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjYwNzNlYTk1ZTE2NzQzMTQzYzVjZmRkIn0sImlhdCI6MTcxMTc2MzkwOH0.p1OXEKlS5tD6rxXDuoRAn9Uncoud-QkD8it89DG6BqY", // hardcoring for now
      },
    });
    const json = await response.json();
    console.log(json);

    console.log("Deleting the note with id" + id);
    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    // API call

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjYwNzNlYTk1ZTE2NzQzMTQzYzVjZmRkIn0sImlhdCI6MTcxMTc2MzkwOH0.p1OXEKlS5tD6rxXDuoRAn9Uncoud-QkD8it89DG6BqY", // hardcoring for now
      },
      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();
    console.log(json);

    // Logic to edit in client not in database
    let newNotes = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNotes.length; index++) {

      if (newNotes[index]._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  };

  return (
    // {/* { state, update } is same as { state:state, update:update } */}
    // <NoteContext.Provider value={{ state, update }}>

    // notes to access notes and setNotes to update notes
    <NoteContext.Provider
      value={{ notes, addNote, deleteNote, editNote, getNotes }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
