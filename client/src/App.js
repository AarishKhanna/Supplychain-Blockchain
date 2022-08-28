import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json"
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { cost: 0, itemName: "exampleItem1", loaded: false, index: 0 };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts();;

      // Get the contract instance.
      const networkId = await this.web3.eth.net.getId();
      this.itemManager = new this.web3.eth.Contract(
        ItemManager.abi,
        ItemManager.networks[networkId] && ItemManager.networks[networkId].address,
      );
      this.item = new this.web3.eth.Contract(
        Item.abi,
        Item.networks[networkId] && Item.networks[networkId].address,
      );
      this.listenToPaymentEvent();
     // this.handleSubmit2();
      this.setState({ loaded: true });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };


  handleSubmit = async () => {
    const { cost, itemName } = this.state;
    console.log(itemName, cost, this.itemManager);
    let result = await this.itemManager.methods.createItem(itemName, cost).send({ from: this.accounts[0] });
    console.log(result);
    alert("Send " + cost + " Wei to " + result.events.SupplyChainStep.returnValues._address+" with Item index:"+result.events.SupplyChainStep.returnValues._itemIndex);
  };

  handleSubmit2 = async () => {
    const { index } = this.state;
   
    let result = await this.itemManager.methods.triggerDelivery(index).send({ from: this.accounts[0] });
    console.log(result);
  
    
  }

  

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data", async function(evt) {
    if(evt.returnValues._step == 1) {
     let item = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
    console.log(item);
    console.log("alert1");
    alert("Item " + item._identifier + +" with Item index: "+item._itemIndex + " was paid, deliver it now!"); };
    if(evt.returnValues._step == 2) {
      let item = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
     console.log(item);
     console.log("alert2");
     alert("Item " + item._identifier + " was delivered, ask for reviews from user "); };
      //console.log("Item was paid, deliver it now!");
     // console.log(evt);
     // console.log("alert2");
    });
  }

  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
       <div className="temp"> <h1>Supply Chain Management Blockchain D-App!</h1> </div> 
        <h2 className="temp2">Add desired Item to sell with it's Cost and Name:</h2><div className="temp6">
      Cost of Item: <input type="text" name="cost"  value={this.state.cost} onChange={this.handleInputChange} />
        Item Name: <input type="text" name="itemName" className="temp4" value={this.state.itemName} onChange={this.handleInputChange} />
        <button type="button" className="button-14" onClick={this.handleSubmit}>Create new Item</button></div><div className="temp5">
        <h2 className="temp2">Mark the Item that has been delivered by Entering the Index, VISIT RINKEBY ETHERSCAN FOR MORE:</h2>
        Delivered Item: <input type="text" name="index" value={this.state.index} onChange={this.handleInputChange} />
        <button type="button" className="button-14" onClick={this.handleSubmit2}>Mark Delivered</button></div>
      </div>
    );
  }
}

  export default App;
