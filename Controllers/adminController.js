const express = require('express');
const User = require('../Model/user')
const bcrypt = require('bcrypt');
const Cars = require('../Model/cars');
const Coupon = require('../Model/coupon')
const Category = require('../Model/category');
const Banner = require('../Model/index');
const category = require('../Model/category');

let msg = "";

const getlogin = async (req, res, next) => {
  if (req.session.email) {
    res.redirect("/admin/home");
  } else {
    res.render('admin/login');
  }
};

const postlogin = async (req, res) => {
  console.log(5);
  const email = req.body.email;
  try {
    req.session.email = email;
    if(req.session.email){
      console.log("awersfghijoksdfghj");
    }
    console.log("homme");
    res.redirect("/admin/home");
  } catch (error) {
    console.log(error.message);
  }
}

const gethome = async (req, res) => {

  try {
    User.find({}, (err, userdetails) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin/home", { details: userdetails });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

const block = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findByIdAndUpdate({ _id: id }, { $set: { status: "Block" } });
    if (userData) {
      res.redirect('/admin/tables');
    }
  } catch {
    res.redirect('/admin/tables');
  };
}

const unBlock = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findOne({ _id: id });
    if (userData.status === "Active") {
      res.redirect('/admin/tables');
    } else {
      await User.updateOne({ _id: id }, { $set: { status: "Active" } })
      res.redirect('/admin/tables')
    }
  } catch {
    res.redirect('/admin/tables')
    console.log("Active")
  }
};

const getTable = async (req, res) => {
  try {
    User.find({}, (err, userdetails) => {
      if (err) {
        console.log(err);
      } else {
        res.render("admin/tables", { details: userdetails });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.redirect('/admin/404')
  }
};


const getcar = async (req, res) => {
  try {
    const cars = await Cars.find().populate("category");
    if (cars) {
      res.render('admin/car', { cars });
    }
  } catch {
    res.redirect('/admin/404')
  }
}

const getaddcar = async (req, res) => {
  try {
    const category = await Category.find()
    res.render('admin/addcar', { category })
  } catch {
    res.redirect('/admin/404')
  }
}

const postaddcar = async (req, res) => {
  try {
    let image = req.files.map(file =>
      ({ path: file.filename })
    )
    let ticketrate = Math.round(req.body.price * (8.33 / 100))
    await Cars.findOne({ name: req.body.name }).then(async (car) => {
      if (car) {
        res.redirect("/admin/addCar");
      } else {
        let cars = new Cars({
          name: req.body.name,
          brand: req.body.brand,
          image: image,
          price: req.body.price,
          category: req.body.category,
          ticketrate: ticketrate,
          ticket: 12
        })
        let cat = cars.save().then((cat) => {
          return cat
        });

        await Category.findOneAndUpdate({ _id: (await cat).category }, { $push: { produId: (await cat)._id } });
        res.redirect('/admin/car');
      }
    })
  } catch (err) {
    console.log("err");
    res.redirect('/admin/car')
  }
}

const geteditcar = async (req, res) => {
  try {
    const id = req.query.id;
    const carData = await Cars.findById({ _id: id });
    console.log(carData.image);
    if (carData) {
      res.render('admin/editcar', { car: carData })
    } else {
      res.redirect('/admin/car')
    }
  } catch {
    res.render('user/404')
  }
}

const posteditcar = async (req, res) => {
  const id = req.params.id;
  const carData = await Cars.findByIdAndUpdate(id, {
    $set: {
      name: req.body.name,
      brand: req.body.brand,
      price: req.body.price,
      ticketrate: req.body.price * (8.33 / 100),
      ticket: req.body.ticket
    }
  }, { new: true }
  );
  res.redirect("/admin/car");
}

const deletecar = async (req, res) => {
  const usedrData = await Cars.findByIdAndDelete({ _id: req.params.id });
  res.redirect("/admin/car");
}

const getCategory = async (req, res) => {
  let category = await Category.find({})
  let carId = category.map((data) => {
    return data._id
  })
  let cars = await Cars.find({ category: carId })
  res.render('admin/category', { category, cars, msg })
  msg = "";
}

const postCategory = async (req, res) => {
  try {
    let item = await Category.findOne({ category_name: req.body.category })
    console.log(item + "item found")
    if (item || req.body.category == "") {
      console.log("item found" + item)
      msg = "Cannot add this item"
      res.redirect('/admin/category')
    } else {
      let category = new Category({ category_name: req.body.category });
      category.save()
      console.log(category)
      res.redirect('/admin/category');
    }
  } catch {
    console.log("category not added")
  }
}

const deleteUser = async (req, res) => {
  const usedData = await User.findByIdAndDelete({ _id: req.query.id });
  res.redirect("/admin/tables");
}

const signout = async (req, res) => {
  req.session.email = null;
  console.log("session deleted");
  res.redirect("/admin");
  res.end();
}



const editBanner = async (req, res) => {
  const id = req.query.id;
  let data = await Banner.findById(id);
  res.render('admin/editBanner', { data });
}

const postBanner = async (req, res) => {
  await Banner.findOneAndUpdate({}, {
    $set: {
      bannerHead: req.body.head,
      bannerSubHead: req.body.subhead,
      bannerDetils: req.body.details,
    }
  })
  res.redirect('/admin/banner')
}

const couponPost = async (req, res) => {
  let code = await Coupon.find({ code: req.body.couponCode })
  if (code.code) {
    console.log(code);
    msg = "Coupon already exist"
    res.redirect("/admin/coupon");
  } else {
    let coupon = new Coupon({
      code: req.body.couponCode,
      expireAt: req.body.expiryDate,
      discount: req.body.discount,
      maximumDiscountAmount: req.body.maxAmount,
      minimumAmount: req.body.minAmount,
      users: [{ userId: null }]
    })
    coupon.save().then(() => {
      res.redirect('/admin/coupon');
    })
  }
}

const coupon = async (req, res) => {
  let data = await Coupon.find({})
  res.render('admin/coupon', { data });
}

const banner = async (req, res) => {
  let data = await Banner.find()
  res.render('admin/banner', { data })
}

const addBanner = (req, res) => {
  res.render('admin/addBanner')
}

const postAddBanner = async (req, res) => {
  const image = req.files.map((data) => {
    return data?.filename
  })
  const exist = await Banner.findOne({ bannerHead: req.body.head })
  if (exist) {
    res.redirect('/admin/addBanner')
  } else {
    let data = new Banner({
      bannerImage: image,
      bannerHead: req.body.head,
      bannerSubHead: req.body.subhead,
      bannerDetils: req.body.details
    })
    data.save().then((data) => {
      res.redirect('/admin/banner')
    })
  }
}

const deleteBanner = async (req, res) => {
  console.log("done" + req.query.id);
  const id = req.query.id
  await Banner.findByIdAndDelete({ _id: id })
  res.redirect('/admin/banner')
}

const not = (req, res) => {
  res.render('admin/404')
}

module.exports = {
  getlogin,
  postlogin,
  gethome,
  block,
  unBlock,
  getcar,
  getaddcar,
  postaddcar,
  geteditcar,
  posteditcar,
  deletecar,
  signout,
  getTable,
  postCategory,
  getCategory,
  deleteUser,
  editBanner,
  postBanner,
  couponPost,
  coupon,
  banner,
  addBanner,
  postAddBanner,
  not,
  deleteBanner
}