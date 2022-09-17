import { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
 
 

const RequestProceed = (props) => {

  const [value, setValue] = useState('')

  return (
    <>
      <span className="p-float-label">
      <InputText style={{width:"100%"}} id="in" value={value} onChange={(e) => setValue(e.target.value)} />
      <label htmlFor="in">{props.inputPlaceholder}</label>
     </span>
     <br />
     <Button label="Proceed" className="p-button-secondary" onClick={()=> props.func(value)} />
    </>
  )
}

export default RequestProceed