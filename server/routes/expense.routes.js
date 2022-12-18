const express = require("express")
const router = express.Router()

const Expense = require("../models/expense.models");

let balance = 0;
let total = []

router.get("/", (req, res) => {
    Expense.find({}, (error, doc) => {
        if (error) {
            console.log(error);
            res.send(error)
        } else {

            for (let i = 0; i < doc.length; i++) {
                total.push(doc[i].amount);
            }
            console.log('result line 20: ', total);          
            
            const sum = total.reduce((accumulator, value) => {
                return accumulator + value;
            }, 0);

            console.log('line 32: ', sum);

            res.json(doc);
        }
    });
})

router.post("/", (req, res) => {
    console.log(req.body);
    let final_category = req.body.category;
    let final_amount = 0;

    if (final_category == 'Expense') {
        final_amount = -req.body.amount;
    } else {
        final_amount = req.body.amount;
    }

    console.log('final amount ', final_amount);

    const expenseData = new Expense({
        category: req.body.category,
        amount: final_amount,
        remarks: req.body.remarks
    })
    expenseData.save((error, doc) => {
        if (error) {
            res.send(error)
        }
        else {
            res.json(doc);
        }
    });
})

router.delete('/:id', (req, res) => {

    console.log('params id: ', req.params.id);

    Expense.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            consolo.log('Error from category route:', err);
            res.send(err);
        }
        res.send('record deleted');
    });
})

module.exports = router;


