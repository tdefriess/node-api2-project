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
                    error: "There was an error while saving the post to the database."
                })
            })
    } else {
        res.status(400).json({
            errorMessage: "Please provide title and contents for the post."
        })
    }
})

router.post('/:id/comments', (req, res) => {
    const id = req.params.id;
    const { text } = req.body;
    const comment = { post_id: id, text: text}
    if (!text) {
        res.status(400).json({
            errorMessage: "Please provide text for the comment."
        })
    } else {
        Posts.findById(id)
            .then(post => {
                if (post.length === 0) {
                    res.status(404).json({
                        message: "The post with the specified ID does not exist."
                    })
                }
            })
            .catch(err => console.log(err));
        Posts.insertComment(comment)
            .then(comment_id => {
                res.status(201).json({
                    text: req.body.text
                })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: "There was an error while saving this comment to the database."
                })
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