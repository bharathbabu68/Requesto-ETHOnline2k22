import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import Home from "./Landing Page/Home";
import Inbox from "./Inbox";
import DappHome from "./DappHome";
import PaymentLink from "./PaymentLink";
import PageNotFound from "./PageNotFound";


const Main = () => {
  return (
    <>
    <BrowserRouter>
        <Switch>
          <Route path="/inbox" component={Inbox}/>
          <Route path="/app/request/:request_id" exact component={({match})=>{  return <PaymentLink request_id_to_fetch={match.params.request_id}/> }} />
          <Route path="/app" exact component={DappHome}/>
          <Route path="/" exact component={Home}/>
          <Route path="/"  component={PageNotFound}/>
        </Switch>
    </BrowserRouter>
    </>
  )
}

export default Main