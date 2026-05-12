const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const User = require("./models/User");
const Product = require("./models/Product");
const Order = require("./models/Order");

const app = express();


// MIDDLEWARE

app.use(cors());
app.use(express.json());


// MONGODB CONNECTION

mongoose.connect(process.env.MONGO_URL)

.then(() => {

    console.log("MongoDB Connected");

})

.catch((error) => {

    console.log(error);

});


// INSERT PRODUCTS

async function insertProducts(){

    const count =
    await Product.countDocuments();

    if(count === 0){

        await Product.insertMany([

            {
                name: "Rolex Watch",
                price: 999,
                category: "watch",
                image: "images/rolex.png"
            },

            {
                name: "Fastrack Watch",
                price: 1199,
                category: "watch",
                image: "images/fastrack.png"
            },

            {
                name: "Nike Shoes",
                price: 2999,
                category: "shoes",
                image: "images/nike.png"
            },

            {
                name: "Puma Shoes",
                price: 2499,
                category: "shoes",
                image: "images/puma.png"
            },

            {
                name: "iPhone",
                price: 90000,
                category: "phone",
                image: "images/iphone.png"
            },

            {
                name: "Samsung Phone",
                price: 70000,
                category: "phone",
                image: "images/samsung.png"
            },

            {
                name: "T-Shirt",
                price: 799,
                category: "clothes",
                image: "images/tshirt.png"
            },

            {
                name: "Hoodie",
                price: 899,
                category: "clothes",
                image: "images/hoodie.png"
            }

        ]);

        console.log("Products Inserted");

    }

}

insertProducts();


// REGISTER API

app.post("/register", async (req, res) => {

    try{

        const user =
        new User(req.body);

        await user.save();

        res.json({

            success: true,

            message:
            "Registration Successful"

        });

    }

    catch(error){

        res.json({

            success: false,

            message: error.message

        });

    }

});


// LOGIN API

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const user =
    await User.findOne({

        email,
        password

    });

    if(user){

        res.json({

            success: true,

            message:
            "Login Successful"

        });

    }

    else{

        res.json({

            success: false,

            message:
            "Invalid Email or Password"

        });

    }

});


// GET PRODUCTS API

app.get("/products", async (req, res) => {

    const products =
    await Product.find();

    res.json(products);

});


// PLACE ORDER API

app.post("/place-order", async (req, res) => {

    try{

        const { products, total } =
        req.body;

        const order = new Order({

            products,
            total

        });

        await order.save();

        res.json({

            success: true,

            message:
            "Order Placed Successfully"

        });

    }

    catch(error){

        res.json({

            success: false,

            message: error.message

        });

    }

});


// SERVER

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});