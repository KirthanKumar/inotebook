import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  // const s1 = {
  //   name: "Harry",
  //   class: "5b",
  // };

  // const [state, setState] = useState(s1);

  // const update = () => {
  //   setTimeout(() => {
  //     setState({
  //       name: "Marry",
  //       class: "6c",
  //     });
  //   }, 2000);
  // };

  // For now we are hardcoring data. Later will do API request and fetch data from database.
  const initialnotes = [
    {
      _id: "6607790fa95048ff6de854b2",
      user: "66073ea95e16743143c5cfdd",
      title: "Updated My title",
      description: "Updated : Please wake up early",
      tag: "Updated personal",
      date: "2024-03-30T02:29:35.983Z",
      __v: 0,
    },
    {
      _id: "6607d37d49f68db91e430cb9",
      user: "66073ea95e16743143c5cfdd",
      title: "My title",
      description: "Please wake up early",
      tag: "personal",
      date: "2024-03-30T08:55:25.620Z",
      __v: 0,
    },
  ];

  const [notes, setNotes] = useState(initialnotes);

  return (
    // {/* { state, update } is same as { state:state, update:update } */}
    // <NoteContext.Provider value={{ state, update }}>

    // notes to access notes and setNotes to update notes
    <NoteContext.Provider value={{ notes, setNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
