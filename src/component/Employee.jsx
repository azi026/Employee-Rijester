import React, { useState ,useEffect} from 'react';
const defaultImageSrc = '/img/Placeholder.png';
const initialFieldValue = {
    employeeID:0,
    employeeName: '',
    occupation:'',
    imageName: '',
    imageSrc: defaultImageSrc,
    imageFile: null
}

export default function Employee(props) {
    const {addOrEdit,recordForEdit } = props;
    const [values, setValues] = useState(initialFieldValue);

    useEffect(()=>{
        if(recordForEdit!=null)
        setValues(recordForEdit);      
    },[recordForEdit])
    const [errors, setErrors] = useState({ });
    const handelInputChange = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }
    const showPriview = e => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues({
                ...values,
                imageFile: null,
                imageSrc: defaultImageSrc
            })
        }
    }
    const validate = () => {
        let temp = {};
        temp.employeeName =values.employeeName ===""?false:true;
        temp.imageSrc =values.imageSrc=== defaultImageSrc?false:true;
        setErrors(temp)
        return Object.values(temp).every(x => x === true);
    }
    const resetForm = () => {
        setValues(initialFieldValue)
        document.getElementById('image-uploader').value=null;
        setErrors({})
    }
    const handelFormSubmit = e => {
        e.preventDefault();
        if (validate()) {
            const formData = new FormData();
            formData.append('employeeID', values.employeeID)
            formData.append('employeeName', values.employeeName)
            formData.append('occupation', values.occupation)
            formData.append('imageName', values.imageName)          
            formData.append('imageFile', values.imageFile)
            addOrEdit(formData, resetForm);        }
    }
    const applayErroClass = filed => ((filed in errors && errors[filed]===false)?' invalid-Field':"")


    return (
        <>
            <div className="container text-center">
                <p className="lead">An Employee</p>
            </div>
            <form autoComplete="off" onSubmit={handelFormSubmit}>
                <div className="card">
                    <img src={values.imageSrc} className="card-img-top" alt=""/> 
                    <div className="card-body">
                        <div className="form-group">
                            <input type="file" accept="image/*" className={"form-control-file"+ applayErroClass('imageSrc')}
                                onChange={showPriview} id='image-uploader'/>
                        </div>
                        <div className="form-group">
                            <input className={"form-control" + applayErroClass('employeeName')} placeholder="EmployeeName" name="employeeName"
                                value={values.employeeName}
                                onChange={handelInputChange}/>
                        </div>
                        <div className="form-group">
                            <input className="form-control" placeholder="Occupation" name="occupation"
                                value={values.occupation} onChange={handelInputChange} />
                        </div>
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-light">Submit</button>
                        </div>
                    </div>

                </div>

            </form>

        </>
    )
}
