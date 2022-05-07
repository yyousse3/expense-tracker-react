import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import List from './List'
import Alert from './Alert'
import { clear } from '@testing-library/user-event/dist/clear';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};

function App() {
  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  //const [date, setDate] = useState('');
  const [monthlyCost, setMonthly] = useState(0);
  const [annualCost,setAnnual] = useState(0)
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({ show: false, msg: '', type: '' });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      showAlert(true, 'danger', 'please enter a value for the item name');
    } else if (!cost || isNaN(cost)){
      showAlert(true, 'danger', 'please enter a numeric value for the item cost');
    }
    
    else if (name && isEditing) {
      setList(
        list.map((item) => {
          if (item.id === editID) {
            setMonthly(monthlyCost-parseInt(item.costOfItem) + parseInt(cost));
            setAnnual(annualCost-parseInt(item.costOfItem) + parseInt(cost));
            //setDate(date);
            //return { ...item, costOfItem: cost, title: name, dateOfPurchase: date };
            return { ...item, costOfItem: cost, title: name };
          }
          return item;
        })
      );
      setName('');
      setCost('');
      //setDate('');
      setEditID(null);
      setIsEditing(false);
      showAlert(true, 'success', 'value changed');
    } else {
      setMonthly(parseInt(cost) + monthlyCost)
      setAnnual(parseInt(cost) + annualCost)
      showAlert(true, 'success', 'item added to the list');
      //const newItem = { id: new Date().getTime().toString(), costOfItem: cost, title: name, dateOfPurchase: date};
      const newItem = { id: new Date().getTime().toString(), costOfItem: cost, title: name};

      setList([...list, newItem]);
      setName('');
      setCost('');
      //setDate('');
    }
  };

  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };
  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([]);
    setAnnual(0);
    setMonthly(0);

  };
  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    list.forEach(item => {
      if (item.id===id){
        // if (item.dateOfPurchase[2]=="2" && item.dateOfPurchase[3]=="2"){
        //     setAnnual(annualCost - parseInt(item.costOfItem));
        // }
        // if (item.dateOfPurchase[5]=="0" && item.dateOfPurchase[6]=="5"){
        //     setMonthly(monthlyCost - parseInt(item.costOfItem));
        // }
        setAnnual(annualCost - parseInt(item.costOfItem));
        setMonthly(monthlyCost - parseInt(item.costOfItem));
      }
    })
    setList(list.filter((item) => item.id !== id));
  };
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(specificItem.title);
    setCost(specificItem.costOfItem);
    //setDate(specificItem.dateOfPurchase);

    //make it so when you change the cost, it substracts the old cost and updates it
  };
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  
  
  return (

    <section className='section-center'>
      
      <form className='grocery-form' onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}

        <h3>Expense Tracker</h3>
        <div className='form-control'>
          <input
            type='text'
            className='grocery'
            placeholder='e.g. Netflix'
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          
          <input
            type='text'
            className='grocery'
            placeholder='e.g. 10'
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
          {/* <input 
          type="date" 
          className='grocery'
          value = {date}
          onChange={(e)=>setDate(e.target.value)}
          /> */}

          

          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
          
        </div>
      </form>
      {list.length > 0 && (
        <div className='grocery-container'>
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className='clear-btn' onClick={(e) => { if (window.confirm('Are you sure you wish to clear the item?')) clearList()}}>
            clear items
          </button>
        </div>
      )}

    <div id = "monthly-cost">
      Monthly Costs: {monthlyCost}
    </div>
    <div>
      Annual Costs: {annualCost}
    </div>
    <div id = "button-center">
      <button id= "new-month" type = "submit" onClick={() => setMonthly(0)} className='submit-btn'>
            New Month
          </button>
      <button id = "new-year" type = "submit" onClick={() => (setAnnual(0),setMonthly(0))} className='submit-btn'>
            New Year
          </button>
    </div>
    
    </section>
    
    

        

  );

  
}

export default App;
