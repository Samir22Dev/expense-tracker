import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Component/Navbar.js";
import { Formik } from 'formik';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import converter from 'number-to-words';

console.log(converter.toWords(13563));

const AllCategory = () => {

    const [allCategory, setAllCategory] = useState([])
    const [amount, setAmount] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/expense")
            .then(res => {
                console.log(res.data);
                setAllCategory(res.data);
            }).catch((error) => {
                console.log(error);
            })
    }, []);

    const notify = () => {
        toast.success('Item Deleted', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    const deleteItem = (id) => {

        let result = window.confirm("Are you sure you want to delete that record!");
        console.log(result);

        if (result) {
            axios.delete(`http://localhost:5000/expense/${id}`)
                .then((response) => {
                    const newItem = allCategory.filter((newVal) => {
                        console.log('id is ', newVal._id);
                        return newVal._id !== id;
                    });
                    console.log('new', newItem);
                    setAllCategory(newItem);
                    notify();
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }


    // ------------ START DOWNLOAD PDF -----------------/

    const downloadPDF = () => {
        console.log('ok');
        const doc = new jsPDF({
            orientation: 'landscape'
        });
        var totalPagesExp = "{total_pages_count_string}";


        doc.autoTable({
            html: '#my-table', styles: { fontSize: 8 }, margin: { top: 22, left: 10, right: 10 },
            didDrawPage: function (data) {

                doc.setFontSize(20);
                doc.setTextColor(40);
                doc.text(10, 10, 'expense tracker');
                doc.text(10, 18, 'Current category Report');

                doc.setFontSize(9);
                let dt = new Date();
                doc.text(260, 18, 'Print: ' + dt.getDate() + '-' + (dt.getMonth() + 1) + '-' + dt.getFullYear());


                var str = "Page " + doc.internal.getNumberOfPages()
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " of " + totalPagesExp;
                }
                doc.setFontSize(10);
                var pageSize = doc.internal.pageSize;
                var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
                doc.text(str, data.settings.margin.left, pageHeight - 10);

            }
        });

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.save('current_category.pdf');
    }
    // ----------------- END PDF -----------------------------


    let balance = 0;
    let abc = []

    for (let i = 0; i < allCategory.length; i++) {
       
        abc.push(allCategory[i].amount);
    }


    for (let i = 0; i < abc.length; i++) {
        balance = balance + abc[i];
        
    }
    console.log('result', balance)
  

    return (
        <React.Fragment>
            <Navbar />
            <div className="container">

                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6  offset-md-1">.
                        <h3>Add New Transaction</h3>
                        <Formik
                            initialValues={{ category: '', amount: '', remarks: '' }}
                            validate={values => {
                                const errors = {};
                                if (values.category == '') {
                                    errors.category = 'Please select a valid category';
                                }
                                if (!values.amount) {
                                    errors.amount = 'Please insert a valid amount';
                                }
                                if (!values.remarks) {
                                    errors.remarks = 'Please insert a valid description';
                                }
                                return errors;
                            }}
                            onSubmit={(values, { setSubmitting }) => {
                                axios.post('http://localhost:5000/expense', {
                                    category: values.category,
                                    amount: values.amount,
                                    remarks: values.remarks
                                })
                                    .then((response) => {
                                        console.log(response.data);
                                        if (values.category == 'Expense') {
                                            setAllCategory([...allCategory, { _id: response.data._id, category: values.category, amount: -values.amount, remarks: values.remarks }]);
                                        } else {
                                            setAllCategory([...allCategory, { _id: response.data._id, category: values.category, amount: values.amount, remarks: values.remarks }]);
                                        }
                                        values.amount = '';
                                        values.remarks = '';
                                        values.category = 'Select Please';
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });

                                setSubmitting(false);
                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <label htmlFor="exampleInputEmail1" className="form-label">Category</label>

                                    <select className="form-select" name="category" id="category" value={values.category} onChange={handleChange} onBlur={handleBlur} aria-label="Default select example">
                                        <option defaultValue={'Select Please'}>Select Please</option>
                                        <option value='Expense'>Expense</option>
                                        <option value='Income'>Income</option>
                                    </select>

                                    <span style={{ color: 'red' }}>{errors.category && touched.category && errors.category}</span>
                                    <br /><br />


                                    <label htmlFor="exampleInputEmail1" className="form-label">Amount</label>
                                    <input className="form-control"
                                        type="number"
                                        name="amount"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.amount}
                                    />
                                    <span style={{ color: 'red' }}>{errors.amount && touched.amount && errors.amount}</span>
                                    <br /><br />


                                    <label htmlFor="exampleInputEmail1" className="form-label">Description</label>
                                    <input className="form-control"
                                        type="text"
                                        name="remarks"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.remarks}
                                    />
                                    <span style={{ color: 'red' }}>{errors.remarks && touched.remarks && errors.remarks}</span>
                                    <br /><br />

                                    <div>
                                        <button type="submit" className="btn btn-sm btn-primary" disabled={isSubmitting}>
                                            Insert Category
                                        </button>  &nbsp;&nbsp;
                                        <button type="button" onClick={downloadPDF} className="btn btn-sm btn-danger">Download PDF</button>
                                    </div>
                                </form>
                            )}
                        </Formik>

                        <br /><br />
                        <h3>All Transaction</h3>

                        <table id="my-table" className="table table-hover table-striped">
                            <thead>
                                <tr className="table-dark">
                                    <th scope="col">S#</th>
                                    <th scope="col">Amount</th>
                                    <th scope="col">Remarks</th>
                                    <th scope="col">Delete</th>
                                </tr>
                            </thead>

                            <tbody>

                                {allCategory.map((category, index) => {
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td className={category.category == 'Income' ? 'text-success' : 'text-danger'}>{category.amount.toLocaleString()}</td>
                                            <td>{category.category} - {category.remarks}</td>
                                            <td><Link to={`/`}><RiDeleteBin6Line onClick={() => deleteItem(category._id)} color="green" /></Link></td>
                                        </tr>
                                    )
                                })}

                                {

                                }
                                <tr>
                                    <td className="text-primary">Balance</td>                                    
                                    <td className="text-primary fw-bold">{balance.toLocaleString()}</td>
                                    <td colSpan="2" className="text-primary">{converter.toWords(balance).charAt(0).toUpperCase() + converter.toWords(balance).slice(1)} Only.</td>                                    
                                </tr>
                            </tbody>
                        </table>


                    </div>

                </div>
            </div>


            <div className="container">




                {/*----------------------------- end form --------------------*/}





            </div>

            <ToastContainer position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover />

        </React.Fragment>
    )
}

export default AllCategory;
