import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import {BrowserView, MobileView} from 'react-device-detect';
import Home from "./Landing Page/Home";
import DappHome from "./DappHome";
import PaymentLink from "./PaymentLink";
import PageNotFound from "./PageNotFound";


const Main = () => {
  return (
    <>
    <BrowserRouter>
        <Switch>
        <Route path="/" exact component={Home}/>
        <BrowserView>
          <Route path="/app/request/:request_id" exact component={({match})=>{  return <PaymentLink request_id_to_fetch={match.params.request_id}/> }} />
          <Route path="/app" exact component={DappHome}/>
          <Route path="/"  component={PageNotFound}/>  
          </BrowserView>        
        </Switch>
    </BrowserRouter>
    </>
  )
}

export default Main