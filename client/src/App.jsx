import { useState, useEffect } from 'react'
import axios from "axios";

import './App.css'



function App() {
  const [users,setUsers]=useState([]);
  const [filterusers,setFilterusers]=useState([])
  const [isModelOpen,setisModelOpen]=useState(false)
  const [userData,setuserData]=useState({
    name:"",age:"",city:"" })

  const getAllUsers= async () => {
    await axios.get("http://localhost:8000/users").then
    ((res) => {
      
      setUsers(res.data);
      setFilterusers(res.data)
      } );
  };

  useEffect( () => {
     getAllUsers()
  },[])
  
  const handleSearchChange=(e) => {
  const SearchText = e.target.value.toLowerCase();
  const filteredUsers= users.filter((user)=>
    user.name.toLowerCase().includes(SearchText) || user.city.toLowerCase().includes(SearchText));
    setFilterusers(filteredUsers)
  
  }

  const handleDelete=async(id) => {

  const isConformed=window.confirm("user is deleting")
  if(isConformed){
  await axios.delete(`http://localhost:8000/users/${id}`).then
  ((res)=> {
    setUsers(res.data);
    setFilterusers(res.data)
  })
}
  }

  const handleAddRecord=() => {
   setuserData({name:"",age:"",city:""})
   setisModelOpen(true)
  }

  const closeModel=() => {
    setisModelOpen(false)
    getAllUsers()
  }

  const handleData=(e)=> {
    setuserData({ ...userData, [e.target.name]: e.target.value})
  }

  const handleSubmit= async(e)=> {
  e.preventDefault();

  if(userData.id){
    await axios.patch(`http://localhost:8000/users/${userData.id}`,userData).then
    ((res)=> {
      console.log(res)
    })
  }else{
  await axios.post("http://localhost:8000/users",userData).then
  ((res)=> {
    console.log(res)
  })
  }
  closeModel();
  setuserData({name:"",age:"",city:""})

  }

  // Update the User

  const handleUpdateRecord = (user)=> {
    setuserData(user)
    setisModelOpen(true)

  }

  return (
    <>
      <div className="container">
       <h3>Crud Operation With React js Frontend and Node js backend</h3>
       <div className="input-Search">
        <input type="search" placeholder='Search Text Here' onChange={handleSearchChange} />
        <button className="btn green" onClick={handleAddRecord}>Add Record</button>
       </div>
       <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Name</th>
            <th>Age</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            filterusers && filterusers.map((user,index) => {
              return (
                <tr key={user.id}>
            <td>{index + 1}</td>
            <td>{user.name}</td>
            <td>{user.age}</td>
            <td>{user.city}</td>
            <td>
              <button className="btn green" onClick={()=> handleUpdateRecord(user)}>Edit</button>
            </td>
            <td>
              <button className="btn red" onClick={()=> handleDelete(user.id)}>Delete</button>
            </td>
          </tr>
              )
            })
          }
        
         
          
            
        </tbody>
       </table>
       
       {isModelOpen && (
          <div className="model">
            <div className="model-content">
              <span className="close" onClick={closeModel}>&times;</span>
              <h2>{userData.id? "Update Record" : "Add Record"}</h2>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" name="name" value={userData.name} onChange={handleData}  id="name"/>
              </div>
              <div className="input-group">
                <label htmlFor="age">Age:</label>
                <input type="number" name="age" value={userData.age} onChange={handleData}  id="age"/>
              </div>
              <div className="input-group">
                <label htmlFor="city">City:</label>
                <input type="text" name="city" value={userData.city} onChange={handleData}  id="city"/>
              </div>
              <button className='btn green' onClick={handleSubmit}>{userData.id? "Update User" : "Add User"}</button>
            </div>
          </div>
        )
       }

      </div>
     
    </>
  )
}

export default App
