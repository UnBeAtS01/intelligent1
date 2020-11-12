import express from 'express';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: '90006e8b145043ffb521001de960e80f'//cd9852e4f93040fb8a989a0ee1875acc
});
const handleApiCall = (req, res)=>{
    app.models.predict('c0c0ac362b03416da06ab3fa36fb58e3', req.body.input)
    .then(data=>{
        res.json(data);
    })
    .catch(err=>res.status(400).json('unable to fetch'));
};


const handleimage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get'));

}

export default{
    handleimage,
    handleApiCall
};