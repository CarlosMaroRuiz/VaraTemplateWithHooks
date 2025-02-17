import { WalletDashboard } from "../walletDashBoard";
import ListaAutores from "./components/autorList"
import CreateAuthor from "./components/createAct";



const TestingPage = () =>{
 return <div className="w-full">
  <WalletDashboard/>
  
   <ListaAutores/>
  <CreateAuthor/>

 </div>
}

export default TestingPage;