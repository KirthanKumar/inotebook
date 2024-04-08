// rafcemlFor=

import React, { useContext } from "react";
import noteContext from "../context/notes/noteContext";

const NoteItem = (props) => {
  const { note, updateNote } = props;

  const context = useContext(noteContext);
  const { deleteNote } = context;

  return (
    <div className="col-md-3">
      <div className="card my-3" style={{ width: "18rem" }}>
        <div className="card-body">
          <div className="d-flex align-items-center">
            <h5 className="card-title">{note.title}</h5>
            <i
              className="fa-solid fa-trash mx-2 mb-2 ms-auto"
              style={{ color: "blue" }}
              onClick={() => {
                deleteNote(note._id);
                props.showAlert("Deleted Successfully", "success");
              }}
            ></i>
            <i
              className="fa-solid fa-pen-to-square mx-2 mb-2"
              style={{ color: "blue" }}
              onClick={() => {
                updateNote(note);
              }}
            ></i>
          </div>
          <h6 className="card-subtitle mb-2 text-muted">{note.tag}</h6>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteItem;
