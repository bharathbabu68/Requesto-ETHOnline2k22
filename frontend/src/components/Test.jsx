import { useState } from 'react';

import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog'; // To use <ConfirmDialog> tag
import { Link } from 'react-router-dom'
 
import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import '../ButtonDemo.css'

 

const Test = () => {
    const [date, setDate] = useState('')
    const [visible, setVisible] = useState(false)
  return (
    <>
    <Container fluid>
    <div className="button-demo">
    <h1>Testing Styling</h1>
    <h5>{date}</h5>
    <Calendar inline value={date} onChange={(e) => setDate(String(e.value))}></Calendar>
    <br/>
    <br/>
    <div className="template">
    <Button className="discord p-0" aria-label="Discord">
        <i className="pi pi-discord px-2"></i>
        <span className="px-3">Discord</span>
    </Button>
    <Button className="slack p-0" aria-label="Slack">
        <i className="pi pi-slack px-2"></i>
        <span className="px-3">Slack</span>
    </Button>
    </div>
    <br/>
    <Button  className="p-button-sm"  label="Confirm" icon="pi pi-check" iconPos="right" onClick={() => setVisible(true)}/>
 
    </div>
    <ConfirmDialog visible={visible} onHide={() => setVisible(false)} message="Are you sure you want to proceed?"
    header="Confirmation" icon="pi pi-exclamation-triangle" accept={()=>{}} reject={()=>{}} />
    </Container>
    </>
  )
}

export default Test