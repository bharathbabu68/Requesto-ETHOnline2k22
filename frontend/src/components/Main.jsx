import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import Home from "./Landing Page/Home";
import Inbox from "./Inbox";
import DappHome from "./DappHome";


const Main = () => {
  return (
    <>
    <BrowserRouter>
        <Switch>
          <Route path="/inbox" component={Inbox}/>
          <Route path="/app/:request_id" component={({match})=>{  return <DappHome request_id_to_fetch={match.params.request_id}/> }} />
          <Route path="/app" component={DappHome}/>
          <Route path="/" component={Home}/>
        </Switch>
    </BrowserRouter>
    </>
  )
}

export default Main