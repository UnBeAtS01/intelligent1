
import express, { response } from 'express';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
import Image from './components/image.js';
const db = knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: 'unbeat01',
        password: 'AZ$az1234567',
        database: 'intelligent'
    }
});

db.select('*').from('users').then(data => {
    console.log(data);
});
const app = express();
app.use(cors());
app.use(express.json());
const database = {
    user: [{
        id: "123",
        username: "unbeat01_ankit",
        email: "unbeat01@gmail.com",
        password: "cookies",
        name: "ankit sinha",
        entries: 0,
        joined: new Date()


    },
    {
        id: "124",
        username: "_ankit",
        email: "minions123@gmail.com",
        password: "minions",
        name: "naincy sinha",
        entries: 0,
        joined: new Date()
    }
    ]

}

app.get('/', (req, res) => {
    res.send(database.user);
});


app.post('/signin', (req, res) => {//ankit make seprate file if project become big..remember app.post('/signin',(req,res)=>{signin.handlesignin(req,res,db,bcrypt)})//if->signin is imported and handlesignin is fuc that exported from signin file;
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('invalid format');
    }
    db.select('email', 'hash').from('login')
        .where('email', '=', email)
        .then(data => {
            const isvalid = bcrypt.compareSync(password, data[0].hash);
            if (isvalid) {
                return db.select('*').from('users')
                    .where('email', '=', email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            }
            else {
                res.status(400).json('wrong credential');
            }
        })
        .catch(err => res.status(400).json(400).json('wrong credentials'))
});


app.post('/signup', (req, res) => {
    const { email, name, password } = req.body;
    /* database.user.push({
         id: '125',
         name: name,
         email: email,
         password: password,
         enteries: 0,
         joined: new Date()
     });*/
    if (!email || !name || !password) {
        return res.status(400).json('invalid format');
    }
    var hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
            .into('login')
            .returning('email')
            .then(loginemail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginemail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(response => {
                        res.json(response[0]);
                    }

                    )

            })
            .then(trx.commit)
            .catch(trx.rollback)
    })

        .catch(err => res.status(400).json('unable to signup'))
})


app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users')
        .where({
            id: id
        })
        .then(user => {
            if (user.length)
                res.json(user[0]);
            else
                res.status(400).json('not found');
        })


    //res.status(400).json('no user found');

})

app.put('/image', (req, res) => { Image.handleimage(req, res, db) });
app.post('/imageurl', (req, res) => { Image.handleApiCall(req, res) });


app.listen(4000, () => {
    console.log('running');
})
/*
/ --->res=this is working
/signinn --->POST =successful
/register --->POST = USER
/prifile/:userid --->GET =user
/image --> PUT -->user



*/