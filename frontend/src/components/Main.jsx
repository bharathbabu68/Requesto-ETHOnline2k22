import {  BrowserRouter,  Switch, Route, Link, } from "react-router-dom";
import Test from "./Test";
import Home from "./Home";
import NavBar from "./NavBar";
import Inbox from "./Inbox";
import DappHome from "./DappHome";

const Main = () => {
  return (
    <>
    <BrowserRouter>
        <Switch>
            <Route path="/test" component={Test}/>
            <Route path="/inbox" component={Inbox}/>
            <Route path="/app" component={DappHome}/>
             <Route path="/" component={Home}/>
        </Switch>
    </BrowserRouter>
    </>
  )
}

export default Main