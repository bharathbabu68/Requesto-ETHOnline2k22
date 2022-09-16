import {Container, Nav, Navbar, NavDropdown} from 'react-bootstrap'
import "../logo.svg"

const NavBar = () => {
  return (
    <Navbar expand="lg" bg="dark" variant="dark">
    <Container fluid>
    <Navbar.Brand href="/">
            <img style={{marginRight:"15px"}}
              alt=""
              src="https://seeklogo.com/images/P/polygon-matic-logo-1DFDA3A3A8-seeklogo.com.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            <b>Requesto</b>
          </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/inbox">Inbox</Nav.Link>
          <Nav.Link href="/request">Request</Nav.Link>
          <Nav.Link href="/test">Test</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default NavBar