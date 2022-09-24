import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import Home from "./Landing Page/Home";
import DappHome from "./DappHome";
import PaymentLink from "./PaymentLink";
import PageNotFound from "./PageNotFound";
import PaymentSuccess from "./PaymentSuccess";


const Main = () => {
  return (
    <>
    <BrowserRouter>
        <Switch>
          <Route path="/app/request/:request_id" exact component={({match})=>{  return <PaymentLink request_id_to_fetch={match.params.request_id}/> }} />
          <Route path="/app" exact component={DappHome}/>
          <Route path="/app/payment-success" exact component={PaymentSuccess}/>
          <Route path="/" exact component={Home}/>
          <Route path="/"  component={PageNotFound}/>
        </Switch>
    </BrowserRouter>
    </>
  )
}

export default Main