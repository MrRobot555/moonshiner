const express = require('express');
const mongodb = require('mongodb');

const router = express.Router();

//Get Post
router.get('/', async (req, res) => {
    const deals = await loadPostsCollection();
    res.send(await deals.find({}).toArray());
});

//Add Post

router.post('/', async (req, res) => {
    const deals = await loadPostsCollection();
    await deals.insertOne({
        text : req.body.text,
        createdAt : new Date()
    });
    res.status(201).send();
});


//Delete Post
router.delete('/:id', async (req, res) => {
    const deals = await loadPostsCollection();
    await deals.deleteOne({_id: new mongodb.ObjectID(req.params.id)});
    res.status(200).send();
});


//Update Post
router.put('/:id/:textinput', async (req, res) => {
    const deals = await loadPostsCollection();
    await deals.updateOne(
        {_id: new mongodb.ObjectID(req.params.id)}, 
        {
            $set : 
            {
                text : req.params.textinput,
                updatedAt : new Date()
            }
        }
    );
    res.status(200).send();
});



async function loadPostsCollection() {
    const client = await mongodb.MongoClient.connect
    ('mongodb+srv://myuser:aTHHPcMGLbrHpo2i@hotdeals.ae9hs.mongodb.net/hotdeals?retryWrites=true&w=majority', {
        useNewUrlParser : true
    });

    return client.db('hotdeals').collection('deals');
}

module.exports = router;