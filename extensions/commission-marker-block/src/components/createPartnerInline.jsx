import { useState } from "preact/hooks";

export default function CreatePartnerInline() {
  const [name, setName] = useState("");

  return (
    <>
      <s-text-field
        label="Partner Name"
        value={name}
        onInput={(event) => setName(event.currentTarget.value)}
      />

      <s-button>Save</s-button>
    
        <s-button onClick={()=>{
            const url = `extension:issue-tracker-action`;
            navigation?.navigate(url);
        }}> 
        Create Partner
        </s-button>


    </>
  );
}