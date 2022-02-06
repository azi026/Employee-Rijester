import React,{useState,useEffect} from 'react';
import Employee from './Employee';
import axios from 'axios';
export default function EmployeeList() {
    const[employeList,setEmployeeList]=useState([ ]);
    const[recordForEdit,setRecordForEdit]=useState(null)

    useEffect(()=>{
        refreshEmployeeList();
    } )
    const employeeAPI=(url='https://employeeregester.somee.com/api/Employee/')=>{
        
        return{
        fetchAll: () => axios.get(url),
        create: newRecord => axios.post(url ,newRecord),
        update:(id,updateRecord)=>axios.put(url +id, updateRecord),
        delete:id => axios.delete(url + id)

        }       
    }
    
    // const employeeAPI=(url="https://EmployeeRegester.somee.com/api/Employee/")=>{
        
    //     return{
    //     fetchAll: () => axios.get(url),
    //     create: newRecord => axios.post(url ,newRecord),
    //     update:(id,updateRecord)=>axios.put(url +id, updateRecord),
    //     delete:id => axios.delete(url + id)

    //     }       
    // }

    function refreshEmployeeList(){
        employeeAPI().fetchAll()
        .then(res => {setEmployeeList(res.data)})      
        .catch(err => console.log(err))
     
   }

    const addOrEdit=(formData,onSucces)=>{
        if(formData.get('employeeID')==="0") 
        employeeAPI().create(formData)
        .then(res=>{
            onSucces();
            refreshEmployeeList();

        })
        .catch(err=>console.log(err))
        else{
            employeeAPI().update(formData.get('employeeID'),formData)
        .then(res=>{
            onSucces();
            refreshEmployeeList();

        })
        .catch(err=>console.log(err))

        }
    }
    
    const showRecordDetalils=data=>{
        setRecordForEdit(data);

    }
    const onDelet=(e,id)=>{
        e.stopPropagation();
        if(window.confirm("Are you sure to delet this record?")){
            employeeAPI().delete(id)
            .then(res=>refreshEmployeeList())
            .catch(err=>console.log(err))
        }

    }
     const imageCard = data => {
         return(
         <div className="card" onClick={()=>{showRecordDetalils(data)}}>
             <div className="card-body">
                 <img src={data.imageSrc} className="card-img-top rounded-circle" alt=""/>
                 <h5>{data.employeeName}</h5>
                 <span>{data.occupation}</span><br/>
                 <button className="btn btn-light delete-button" onClick={e=>onDelet(e,parseInt(data.employeeID))}>  
                     <i className="far fa-trash-alt"></i>
                 </button>
             </div>

         </div>)
     }
    

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="jumbotron jumbotron-fluid py-4">
                <div className="container text-center">
                    <h1 className="display-4">Employ Register</h1>
                </div>
                </div>
            </div>
            <div className="col-md-4">
                <Employee
                addOrEdit={addOrEdit}
                recordForEdit={recordForEdit}
                />

            </div>
            <div className="col-md-8">             
              <table>
                  <tbody>
                      {
                         
                         [...Array(Math.ceil(employeList.length/3))].map((e,i) =>
                          <tr key={i}>
                             <td>{imageCard (employeList[3 * i])}</td>
                              <td>{employeList[3 * i + 1] ? imageCard (employeList[3 * i + 1]): null}</td>
                             <td>{employeList[3 * i + 2] ? imageCard (employeList[3 * i + 2]): null}</td>
                          </tr>
                             
                         )
                     }
                  </tbody>
              </table>

            </div>
            
        </div>
    )
}
