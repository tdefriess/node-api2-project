const express = require('express');

const Posts = require('../data/db');

const router = express.Router();

router.post('/', (req, res) => {
    console.log(res.query)
    if (req.body.title && req.body.contents) {
        Posts.insert(req.body)
            .then(id => {
                res.status(201).json(id)
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: "There was an error while saving the post to the database"
                })
            })
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
})

router.get('/', (req, res) => {
    Posts.find(req.query)
        .then(posts => {
            res.status(200).json(posts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: "The posts information could not be retrieved"
            })
        })
})

module.exports = router;