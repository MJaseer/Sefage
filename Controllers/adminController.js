const express = require('express');
const User = require('../Model/user')
const Cars = require('../Model/cars');
const Coupon = require('../Model/coupon')
const Category = require('../Model/category');
const Banner = require('../Model/index');
const Order = require('../Model/order')
const moment = require('moment');
require('dotenv').config({ path: '.env' });

let msg = "";

const getlogin = async (req, res, next) => {
  if (req.session.email) {
    res.redirect("/admin/home");
  } else {
    res.render('admin/login' ,{ msg });
  }
};

const postlogin = async (req, res) => {
  const email = req.body.email;
  try {
    if (req.body.email == process.env.adminEmail && req.body.password == process.env.adminPassword) {
      req.session.email = email;
      if (req.session.email) {
        res.redirect("/admin/home");
      }
    } else {
      msg = "Invalid Credentials";
      res.redirect('/admin')
    }
  } catch (error) {
    console.log(error.message);
  }
}

const gethome = async (req, res) => {

  try {
    User.find({}, async (err, userdetails) => {
      if (err) {
        console.log(err);
      } else {
        const data = await Order.find()
          .populate({
            path: 'carId.carId',
            model: 'car',
            populate: [
              {
                path: "category",
                model: "category"
              }
            ]
          })

        let categoryName = [];
        let ids = []
        data.forEach((category) => {
          category.carId.forEach(data => {
            ids.push(data.carId.category._id)
            categoryName.push(data.carId.category.category_name)
          })
        });
        const categoryNames = [...new Set(categoryName)];
        msg='';
        res.render("admin/home", { details: userdetails, categoryNames });
      }
    });
  } catch (error) {
    console.log(error.message);
  }
}

const categorySales = async (req, res) => {

  const data = await Order.find()
    .populate({
      path: 'carId.carId',
      model: 'car',
      populate: [
        {
          path: "category",
          model: "category"
        }
      ]
    })
  let categoryName = [];
  let ids = []
  data.forEach((category) => {
    category.carId.forEach(data => {
      ids.push(data.carId.category._id)
      categoryName.push(data.carId.category.category_name)
    })
  });

  const categoryNames = [...new Set(categoryName)];

  let value = ids.reduce((acc, id) => {
    const idString = id.toString();
    acc[idString] = acc[idString] ? acc[idString] + 1 : 1;

    return acc;
  }, {});

  let values = Object.values(value);

  if (categoryNames && values) {
    console.log(values, categoryNames);
    res.json({ success: true, categoryNames, values })
  } else {
    res.json({ success: false })
  }
}

const monthlySales = async (req, res) => {
  try {
    console.log('connected');

    const data = await Order.find()
      .populate({
        path: 'carId.carId',
        model: 'car'
      })
    if (data) {
      const groupedResult = data.reduce((acc, order) => {
        order.carId.forEach((carOrder) => {
          const month = carOrder.time.getMonth() + 1;
          const car = carOrder.carId;

          const existingRecord = acc.find((record) => {
            return record.month === month;
          });

          if (existingRecord) {
            existingRecord.total_quantity += carOrder.quantity;
            existingRecord.total_payable += carOrder.payable;
            existingRecord.total_paid += carOrder.paid;
          } else {
            acc.push({
              month,
              total_quantity: carOrder.quantity,
            });
          }
        });
        return acc;
      }, []);

      const monthlySales = []
      groupedResult.forEach((data) => {
        monthlySales.push(data)
      })

      let month = []
      let values = []

      monthlySales.forEach(data => {
        month.push(data.month)
        values.push(data.total_quantity)
      }); values

      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      const getMonthName = (month) => {
        return monthNames[month - 1];
      };

      let monthName = []

      for (let i = 0; i < month.length; i++) {
        monthName.push(getMonthName(month[i]))
      }

      res.json({ success: true, month: monthName, values })
    } else {
      msg = " No data found"
      res.json({ success: false, msg })
    }
  } catch (err) {
    msg = " Uncensored error occured"
    res.json({ success: false, msg })
  }

}


const salesReport = async (req, res) => {
  const data = await Order.find({ 'carId.status': true }).populate('userId')
    .populate({
      path: 'carId.carId',
      model: 'car'
    })

  res.render('admin/salesReport', { data });
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

const orderList = async (req, res) => {
  try {

    const orders = await Order.find({}).populate('userId')
      .populate({
        path: "carId.carId",
        model: "car",
        populate: [
          {
            path: "category",
            model: "category"
          }
        ]
      })

    res.render('admin/orderlist', { orders })
  } catch {
    res.redirect('/admin/404')
  }
}


const viewItem = async (req, res) => {
  const id = req.params.id;

  const product = await Order.findOne({ 'carId._id': id }).populate('userId')
    .populate({
      path: 'carId.carId',
      model: 'car',
      populate: [
        {
          path: "category",
          model: "category"
        }
      ]
    })
  console.log(id);

  const foundObject = product.carId.find(obj => obj._id.toString() === id);
  console.log(foundObject);

  if (product) {
    res.render('admin/orderDetail', { product, foundObject })
  } else {
    msg = 'No data found'
    res.render('admin/orderDetail', { msg })
  }

}

const cancelOrder = async (req, res) => {

  const id = req.params.id

  const product = await Order.findOneAndUpdate({ "carId._id": id }, {
    $set: {
      "carId.$.status": false
    }
  })
  console.log(product);
  if (!product) {
    res.json({ success: false })
  } else {
    res.json({ success: true })
  }

}

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
    msg = "Unexpected error occured"
    res.redirect('/500')
  }
}

const deleteUser = async (req, res) => {
  const usedData = await User.findByIdAndDelete({ _id: req.query.id });
  res.redirect("/admin/tables");
}


const signout = async (req, res) => {
  req.session.email = null;
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
    msg = "Coupon already exist"
    res.redirect("/admin/coupon");
  } else {
    const datenow = moment(req.body.expiryDate).format('MMMM YYYY DD');
    console.log(datenow);
    let coupon = new Coupon({
      code: req.body.couponCode,
      expireAt: datenow,
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
  categorySales,
  monthlySales,
  salesReport,
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
  orderList,
  viewItem,
  cancelOrder,
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