import React, { useState, useEffect } from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { TabView, TabPanel } from 'primereact/tabview';
// import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import "../App.css";
import { SplitButton } from 'primereact/splitbutton';
import { Avatar } from 'primereact/avatar';
import { Row, Col, Container, Button } from 'react-bootstrap';
import { SelectButton } from 'primereact/selectbutton';

const Inbox = () => {

  const [countries, setCountries] = useState([]);
  const [selectedCountry2, setSelectedCountry2] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState(null);
  const [value3, setValue3] = useState(null);

  const groupedCities = [
    {
        label: 'Germany', code: 'DE',
        items: [
            { label: 'Berlin', value: 'Berlin' },
            { label: 'Frankfurt', value: 'Frankfurt' },
            { label: 'Hamburg', value: 'Hamburg' },
            { label: 'Munich', value: 'Munich' }
        ]
    },
    {
        label: 'USA', code: 'US',
        items: [
            { label: 'Chicago', value: 'Chicago' },
            { label: 'Los Angeles', value: 'Los Angeles' },
            { label: 'New York', value: 'New York' },
            { label: 'San Francisco', value: 'San Francisco' }
        ]
    },
    {
        label: 'Japan', code: 'JP',
        items: [
            { label: 'Kyoto', value: 'Kyoto' },
            { label: 'Osaka', value: 'Osaka' },
            { label: 'Tokyo', value: 'Tokyo' },
            { label: 'Yokohama', value: 'Yokohama' }
        ]
    }
  ];

  const searchCountry = (event) => {
    setTimeout(() => {
        let _filteredCountries;
        if (!event.query.trim().length) {
            _filteredCountries = [...countries];
        }
        else {
            _filteredCountries = countries.filter((country) => {
                return country.name.toLowerCase().startsWith(event.query.toLowerCase());
            });
        }

        setFilteredCountries(_filteredCountries);
    }, 250);
  }

  const itemTemplate = (item) => {
    return (
        <div className="country-item">
            <img alt={item.name} src={`images/flag/flag_placeholder.png`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${item.code.toLowerCase()}`} />
            <div>{item.name}</div>
        </div>
    );
  }

  const justifyOptions = [
    {name: 'Crypto', value: 'Right'},
    {name: 'NFTs', value: 'Center'},
    {name: 'Stream', value: 'Justify'}
  ];

  const cryptoCard = () =>  {
    return (
      <div class="box" style={{height: "170px", width: "93%", borderRadius: "10px", margin: "auto auto"}} id="req-card" className="card justify-content-center align-items-center">
        <Row className="mt-1">

          <Col md={2} style={{height: "100%", margin: "auto 0"}}>
          
            <div>
              <img height={100} src="https://cryptologos.cc/logos/ethereum-eth-logo.png"></img>
            </div>
            <h4>Crypto</h4>

          </Col>

          <Col md={4}>
            {/* <h3 style={{color: "white"}}>Request From:</h3> */}
            <br></br>
            <h5 style={{color: "white"}}><a href="/" style={{color: "white"}}>0xAASADAHDAS2173218312794912419</a></h5>
            <p style={{overflow: "hidden", textOverflow: "ellipsis", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", display: "-webkit-box"}}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </Col>

          <Col md={4}>
            
              <div>
                <img height={60} src="https://repository-images.githubusercontent.com/259626953/2b306f80-89b2-11ea-93b7-d4761f9618e8"></img>
              </div>
            <h6>Received 3 days ago <i class="pi pi-clock"></i></h6>
            <Row style={{margin: "5px", textAlign: "center"}}>
              <Col style={{border: "1px solid black", borderRadius: "5px", backgroundColor: "#8fa832", padding: "2px", margin: "2px"}}>
                <h6 style={{color: "white", textAlign: "center", margin: "auto auto"}}>NFT</h6>
              </Col>
              <Col style={{border: "1px solid black", borderRadius: "5px", backgroundColor: "#6f32a8", padding: "2px", margin: "2px"}}>
                <h6 style={{color: "white", textAlign: "center", margin: "auto auto"}}>POLYGON</h6>
              </Col>
              <Col style={{border: "1px solid black", borderRadius: "5px", backgroundColor: "#6f32a8", padding: "2px", margin: "2px"}}>
                <h6 style={{color: "white", textAlign: "center", margin: "auto auto"}}>STREAM</h6>
              </Col>
              <font style={{fontSize: "12px", fontWeight: "light"}}>Powered by EPNS</font>
            </Row>
          </Col>

          <Col md={2}>
            <Row>

              <Col md={6} style={{textAlign: "center"}} className="justify-content-center align-items-center">
                <Col md={12}>
                  <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" height="45px"></img>
                  <h2 style={{textAlign: "center", width: "100%"}}>42.4 ETH</h2>
                </Col>
              </Col>
              
              <Col md={6}>
                  <Button style={{margin: "5px"}} variant="success">Pay <i class="pi pi-check"></i></Button>
                  <Button style={{margin: "5px"}} variant="warning">Reject <i class="pi pi-times"></i></Button>
              </Col>

            </Row>
          </Col>

        </Row>
        {/* <br></br>
        <h3 style={{color: "white"}}>Request From:</h3>
        <h6 style={{color: "white"}}><a href="/" style={{color: "white"}}>0xAASADAHDAS2173218312794912419</a></h6>
        <br></br>
        <div id="card" style={{width: "80%"}} class="card justify-content-center align-items-center">
          <h2>42.4 <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" height="30px"></img></h2>
          <h6>Received 3 days ago <i class="pi pi-clock"></i></h6>
          <br></br>
          <div>
            <p style={{overflow: "hidden", textOverflow: "ellipsis", WebkitLineClamp: "2", WebkitBoxOrient: "vertical", display: "-webkit-box"}}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
          </div>
          <Row style={{margin: "5px"}}>
            <div style={{border: "1px solid black", borderRadius: "5px", backgroundColor: "#8fa832", padding: "2px", width: "50px", margin: "2px"}}>
              <h6 style={{color: "white", textAlign: "center", margin: "auto auto"}}>NFT</h6>
            </div>
            <div style={{border: "1px solid black", borderRadius: "5px", backgroundColor: "#6f32a8", padding: "2px", width: "100px", margin: "2px"}}>
              <h6 style={{color: "white", textAlign: "center", margin: "auto auto"}}>POLYGON</h6>
            </div>
            <div style={{border: "1px solid black", borderRadius: "5px", backgroundColor: "#6f32a8", padding: "2px", width: "100px", margin: "2px"}}>
              <h6 style={{color: "white", textAlign: "center", margin: "auto auto"}}>STREAM</h6>
            </div>
          </Row>
          <div>
            <img height={40} src="https://s2.coinmarketcap.com/static/img/coins/200x200/9111.png"></img>
          </div>
          <font style={{fontSize: "12px", fontWeight: "light"}}>Powered by EPNS</font>
        </div>
        <br></br> */}
      </div>
    );
  }

    // <div class="flex flex-wrap align-items-center justify-content-center card-container">
    //     <div class="w-5" className="country-item">
    //         <img alt={item.name} src={`images/flag/flag_placeholder.png`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${item.code.toLowerCase()}`} />
    //         <div>{item.name}</div>
    //     </div>
    //   </div>
  return (
    <div className="flex flex-wrap align-items-center justify-content-center">

        <br></br>
        <br></br>

        <Col md={12}>
        
          <h1>Your Requests</h1>
          <br></br>
          <br></br>

          <Row>

            <Col md={9}>
              <AutoComplete style={{width: "100%"}} value={selectedCountry2} suggestions={filteredCountries} completeMethod={searchCountry} field="name" dropdown forceSelection itemTemplate={itemTemplate} onChange={(e) => setSelectedCountry2(e.value)} aria-label="Search address of " placeholder="Search for the person's address here..." />
            </Col>

            <Col md={3}>
              <SelectButton style={{textAlign: "right"}} value={value3} options={justifyOptions} onChange={(e) => setValue3(e.value)} optionLabel="name" />
            </Col>
            

          </Row>

          
          <br></br>
          <br></br>


          <Row style={{textAlign: "center"}}>
            {cryptoCard()}
            {/* {cryptoCard()}
            {cryptoCard()}
            {cryptoCard()}
            {cryptoCard()} */}
          </Row>
          
        </Col>


      {/* <div id="inbox" class="w-10 align-items-center justify-content-center">
          <TabView className="tabview-header-icon">
              <TabPanel header="Received Transactions" rightIcon="pi pi-send">
                <Card title="Advanced Card" subTitle="Subtitle" style={{ width: '25em' }} footer={footer} header={header}>
                  <p className="m-0" style={{lineHeight: '1.5'}}>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt
                      quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!</p>
                </Card>
              </TabPanel>
              <TabPanel header="Sent Transactions" rightIcon="pi pi-check">
                  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                  architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.</p>
              </TabPanel>
          </TabView>
      </div> */}

    </div>
  )
}

export default Inbox