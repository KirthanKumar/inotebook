import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const s1 = {
    name: "Harry",
    class: "5b",
  };

  const [state, setState] = useState(s1);

  const update = () => {
    setTimeout(() => {
      setState({
        name: "Marry",
        class: "6c",
      });
    }, 2000);
  };

  return (
    <NoteContext.Provider value={{ state, update }}>
      {/* { state, update } is same as { state:state, update:update } */}
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
