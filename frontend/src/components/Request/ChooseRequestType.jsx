import {Container, Row, Col, Button, Card} from 'react-bootstrap'
const ChooseRequestType = (props) => {
  return (
    <Row>
            <Col md={6}>
            <Card style={{ width: '18rem' }}>
          <Card.Img style={{maxWidth: 'inherit', maxHeight: 'inherit', height: 'inherit', width:'inherit', objectFit:'cover'}} variant="top" src="https://www.ledgerinsights.com/wp-content/uploads/2021/03/nonfungible-token-nft-810x524.jpg" />
          <Card.Body>
            <Button variant="dark" onClick={()=> props.func("nft")}>Request NFT</Button>
          </Card.Body>
        </Card>
        </Col>
        <Col md={6}>
            <Card style={{ width: '18rem' }}>
          <Card.Img style={{maxWidth: 'inherit',maxHeight: 'inherit', height: 'inherit', width:'inherit', objectFit:'cover'}} variant="top" src="https://www.interactivebrokers.hu/images/web/cryptocurrency-hero.jpg" />
          <Card.Body>
            <Button variant="dark"  onClick={()=> props.func("crypto")}>Request Crypto</Button>
          </Card.Body>
        </Card>
        </Col>
      </Row>
  )
}

export default ChooseRequestType