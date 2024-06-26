import React, { useContext, useState } from "react";
import noteContext from "../context/notes/noteContext";
import { Link } from "react-router-dom";
import "../styles/home.css";

const AddNote = (props) => {
  const context = useContext(noteContext);
  const { addNote } = context;

  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "",
  });

  const handleClick = (e) => {
    e.preventDefault();
    addNote(note.title, note.description, note.tag);
    setNote({ title: "", description: "", tag: "" });
    props.showAlert("Updated Successfully", "success");
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
    // this syntax says that keep note object as it is, but if changes occurs add it to note or overwrite it in note.
    // select component in inspect (that is enabled using react developer tools) and see the changes.
  };

  return (
    <>
      <Link to={"/"} role="button">
        <i className="fa-solid fa-arrow-left" style={{ color: "#74C0FC" }}>
          {" "}
          Home
        </i>
      </Link>
      <div className="container my-3 mt-4 addnotes">
        <h2>Create New Note</h2>
        <p className="mb-4">Add a new note with your info / notes</p>
        <form>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              aria-describedby="emailHelp"
              onChange={onChange}
              minLength={5}
              required
              value={note.title}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description *
            </label>
            <input
              type="text"
              className="form-control"
              id="description"
              name="description"
              onChange={onChange}
              minLength={5}
              required
              value={note.description}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag *
            </label>
            <input
              type="text"
              className="form-control"
              id="tag"
              name="tag"
              onChange={onChange}
              value={note.tag}
            />
          </div>
          <button
            type="submit"
            className="btn btn-outline-primary"
            disabled={note.title.length < 5 || note.description.length < 5}
            onClick={handleClick}
          >
            Add Note
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNote;
