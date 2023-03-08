const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../Model/user');
const Cars = require('../Model/cars');
const nodemailer = require('nodemailer');
const newOTP = require('../Model/otp');
const Coupon = require('../Model/coupon');
const crypto = require('crypto');
const Category = require('../Model/category');
const Wishlist = require('../Model/wishlist');
const Ticket = require('../Model/tickets');
const Banner = require('../Model/index')
const Razorpay = require("razorpay");
const Order = require('../Model/order');
const Notification = require('../Model/notification')

let msg = "";
let data = "";

const getHome = async (req, res) => {
  try {
    const mail = req.session.username;
    const banners = await Banner.find();
    const user = await User.findOne({ email: mail });

    let orderData;
    if (user) {
      orderData = await Notification.findOne({ userId: user._id })
    }
    console.log(orderData);

    res.render('user/index', { data, msg, banners, user, orderData });
    msg = "";

  } catch (error) {
    msg = error
    res.redirect('/500', { msg })
    res.redirect((500), '/500', { msg })
  }
}

const getLogin = (req, res) => {
  try {
    res.render('user/login', { msg })
    msg = "";
  } catch (error) {
    msg = error
    res.redirect('/404')
  }
}


const postLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({ email: email });
    if (user.status === "Active") {
      if (user) {
        bcrypt.compare(password, user.password).then((hash) => {
          if (hash) {
            req.session.username = req.body.email;
            res.redirect('/');
          } else {
            res.redirect('/login');
            msg = "Invalid Credentials";
          }
        }).catch(err => {
          res.redirect('/login');
          msg = "Invalid Credentials";
        });
      } else {
        msg = "User not found"
        res.redirect('/login');
      }
    } else {
      msg = "You are banned"
      res.redirect('/login');
    }
  } catch (error) {
    msg = error.message;
    res.redirect('/login');
  }
}

const getSignUp = (req, res) => {
  try {
    res.render('user/register', { msg })
  } catch (err) {
    msg = err
    res.redirect('/404')
  }
}

const postSignUp = async (req, res) => {
  try {
    if (req.body.password === req.body.cpassword) {
      const myUser = req.body;
      const email = req.body.email;
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'mjaseer43@gmail.com',
          pass: 'gqwiikrnrhcajove'
        }
      })
      const user = await User.findOne({ email: email });
      if (user) {
        msg = "user already exist"
        res.redirect('/signUp')
      } else {
        const emailOtp = email;
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`
        console.log(otp);
        const expiration = new Date();
        expiration.setMinutes(expiration.getMinutes() + 5);
        const nwOTP = new newOTP({ email: emailOtp, otp: otp, expiration: expiration });
        nwOTP.save((err) => {
          if (err) {
            msg = err;
            res.redirect('/500')
          } else {
            const mailOptions = {
              from: 'mjaseer43@gmail.com',
              to: email,
              subject: 'OTP for Sefage Cars Account',
              text: `Your OTP is: ${otp}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                msg = err;
                res.redirect('/500');
              } else {
                console.log(`OTP sent to ${email}: ${otp}`);
                res.alert(`OTP sent to ${email}`);
              }
            })
          }
          res.redirect(`/otp?fname=${myUser.fname}&email=${myUser.email}&cpassword${myUser.cpassword}&password=${myUser.password}&lname=${myUser.lname}&phone=${myUser.phone}&cities=${myUser.cities}&state=${myUser.state}&flats=${myUser.flats}`);
        });
      }
    } else {
      msg = "Confirm password should be same as Password"
      res.redirect('/signUp');
    }
  } catch (error) {
    msg = error
    redirect('/404')
  }
}

const getOtp = (req, res) => {
  try {
    userinfo = req.query
    res.render('user/otp', { userinfo, msg })
  } catch (err) {
    msg = err;
    res.redirect('/404')
  }
}

const postOtp = async (req, res) => {
  let hashpassword = await bcrypt.hash(req.body.password, 10)
  try {
    let myDetails = new User({
      fname: req.body.fname,
      lname: req.body.lname,
      email: req.body.email,
      password: hashpassword,
      cpassword: req.body.cpassword,
      cities: req.body.cities,
      state: req.body.state,
      flats: req.body.flats,
      phone: req.body.phone,
      status: "Active"
    });

    const otp = req.body.emailOtp;
    newOTP.findOne({ otp: otp }, (err, otpDetails) => {
      if (err) {
        msg = err
        res.redirect('/onlyOtp')
      } else {
        if (otpDetails) {
          if (otpDetails.expiration > Date.now()) {
            myDetails.save().then(item => {
              res.redirect('/')
            })
          } else {
            msg = "OTP expired"
            res.redirect('/signUp');
          }
        } else {
          msg = "Invalid OTP"
          res.redirect('/otp');
        }
      }
    });

    newOTP.deleteMany({}, (err) => {
      if (err) {
        msg = err;
        res.redirect('/onlyOtp')
      }
    })
  } catch (err) {
    msg = err + "(OTP not varified)"
    res.redirect('/500')
  }
}

const emailPost = async (req, res) => {
  try {
    const email = req.body.email;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'mjaseer43@gmail.com',
        pass: 'gqwiikrnrhcajove'
      }
    })
    let user = await User.findOne({ email: email });
    if (user) {
      const emailOtp = email;
      const otp = `${Math.floor(1000 + Math.random() * 9000)}`
      console.log(otp);
      const expiration = new Date();
      expiration.setMinutes(expiration.getMinutes() + 5);
      const nwOTP = new newOTP({ email: emailOtp, otp: otp, expiration: expiration });
      nwOTP.save(async (err) => {
        if (err) {
          msg = err;
          res.redirect('/500')
        } else {
          const mailOptions = {
            from: 'mjaseer43@gmail.com',
            to: email,
            subject: 'OTP for Sefage Cars Account',
            text: `Your OTP is: ${otp}`
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              msg = error
              res.redirect('/500')
            } else {
              console.log(`OTP sent to ${email}: ${otp}`);
              res.alert(`OTP sent to ${email}`);
            }
          })
        }
        res.redirect(`/onlyOtp?&email=${email}`);
      });
    } else {
      msg = "User not found "
      res.redirect('/forgotPass')
    }
  } catch (error) {
    msg = error
    res.redirect('/404')
  }
};

const getOnlyOtp = (req, res) => {
  try {
    email = req.query
    res.render('user/onlyotp', { email })
  } catch (err) {
    msg = err;
    res.redirect('/500')
  }
};

const onlyOtpPost = async (req, res) => {
  try {
    const email = req.body.email;
    console.log('email' + email)
    const otp = req.body.emailOtp;
    console.log(otp);
    newOTP.findOne({ otp: otp }, (err, otpDetails) => {
      if (err) {
        msg = err;
        res.redirect('/500')
      } else {
        if (otpDetails) {
          if (otpDetails.expiration > Date.now()) {
            res.redirect(`/setPassword?&email=${email}`)
          } else {
            msg = "OTP expired"
            res.redirect('/onlyOtp');
          }
        } else {
          msg = "Invalid OTP"
          res.redirect('/onlyOtp');
        }
      }
    });

    newOTP.deleteMany({}, (err) => {
      if (err) {
        msg = err
        res.redirect('/500')
      }
    })
  } catch (err) {
    msg = err
    res.redirect('/onlyOtp')
  }
};

const getSetPassword = (req, res) => {
  try {
    email = req.query
    res.render('user/changepassword', { email })
  } catch (err) {
    msg = err;
    res.redirect('/500')
  }
}

const postSetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const email = req.body.email;
    console.log(password)
    const hashpass = await bcrypt.hash(req.body.password, 10)
    const user = await User.findOneAndUpdate({ email: email }, { $set: { password: hashpass } });
    if (user) {
      res.redirect('/login');
    } else {
      res.redirect('/setPassword')
    }
  } catch (error) {
    msg = error
    res.redirect('/404')
  }
};

const getLikes = async (req, res) => {
  try {
    const mail = req.session.username;
    const userData = await User.findOne({ email: mail });
    const id = userData._id
    if (userData) {
      const data = await Wishlist.findOne({ userId: id })
      const carId = data?.carId
      const car = await Cars.find({ _id: carId })
      res.render("user/likes", { car });
    } else {
      res.redirect("/");
      msg = "Please Login"
    }
  } catch {
    msg = "Please Login"
    res.redirect('/404')
  }
}


const getProfile = async (req, res) => {
  try {

    const userData = await User.findOne({ email: req.session.username });
    console.log(userData);
    if (userData) {
      const booking = await Ticket.findOne({ userId: userData._id });
      const orders = await Order.findOne({ userId: userData._id });

      let matchingCars;
      if (orders) {
        console.log(orders + "here");
        const carIds = orders.carId.map(car => car.carId);

        matchingCars = await Cars.find({
          _id: { $in: carIds }
        });


        orders.carId.forEach((data) => {
          console.log(data.carId)
        });
        console.log(matchingCars);

      }

      const data = Object.values(userData);

      res.render("user/profile", { data, booking, orders, matchingCars });

    } else {
      res.redirect("/login");
    }
  } catch (error) {
    msg = error
    res.redirect('/login')
  };
}


const deleteMe = async (req, res) => {
  try {
    await User.findByIdAndDelete({ _id: req.query.id });
    req.session.username = null;
    res.redirect("/");
  } catch (err) {
    msg = err;
    res.redirect('/404')
  }

}

const editMe = async (req, res) => {
  try {
    const id = req.query.id;
    const userData = await User.findById({ _id: id });
    if (userData) {
      res.render('user/editme', { user: userData })
    } else {
      res.redirect('/profile')
    }
  } catch (err) {
    msg = err
    res.redirect('/404')
  }
}

const postEditMe = async (req, res) => {
  const mail = req.body.email
  await User.findOneAndUpdate({ email: mail }, {
    $set: {
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone
    }
  })
  res.redirect('/profile')
}

const getBrowse = async (req, res) => {
  try {
    await Cars.find().populate("category");
    const category = await Category.find();
    const cars = await Cars.find();
    if (cars) {
      res.render('user/browse', { cars, category, msg })
      msg = "";
    } else {
      msg = " No Data Found"
      res.redirect('/')
    }
  } catch (err) {
    msg = err
    res.redirect('/404')
  }
}


const addlike = async (req, res) => {
  try {
    const mail = req.session.username;
    const id = req.query.id;
    await Wishlist.find().populate('userId');
    await Wishlist.find().populate('carId');
    const user = await User.findOne({ email: mail });
    if (user) {
      const data = await Cars.findOne({ _id: id });
      const currentUser = await Wishlist.findOne({ userId: user._id });
      if (currentUser) {
        await Wishlist.findOneAndUpdate({ userId: currentUser.userId }, { $push: { carId: data._id } }).then(() => {
          res.redirect('/browse');
        })
      } else {
        let newWishlist = new Wishlist({
          userId: user,
          carId: [data]
        })
        newWishlist.save().then(data =>
          res.redirect('/browse'))
      }
    } else {
      msg = "Please login"
      res.redirect('/browse')
    }
  } catch (error) {
    msg = error;
    res.redirect('/500')
  }

}

const removeLike = async (req, res) => {
  try {
    const mail = req.session.username;
    const id = req.query.id;
    const user = await User.findOne({ email: mail })
    await Wishlist.findOneAndUpdate({ userId: user._id }, { $pull: { carId: id } })
    res.redirect('/likes')
  } catch (err) {

  }
}

const getCarDetail = async (req, res) => {
  try {
    const id = req.query.id;
    const email = req.session.username;
    const userData = await User.findOne({ email: email })
    const cars = await Cars.findById({ _id: id })
    if (cars) {
      res.render('user/cardetails', { cars, userData })
    } else {
      res.redirect('/browse')
    }
  } catch (err) {
    msg = err;
    res.redirect('/500')
  }
}


const coupon = async (req, res) => {

  try {

    const carId = req.body.carId;
    const quantity = req.body.quantity;
    const coupon = req.body.couponCode;
    const mail = req.session.username;

    const userDetails = await User.findOne({ email: mail })
    const cars = await Cars.findById(carId);

    Coupon.findOne({ code: coupon })
      .then(data => {
        console.log(data);
        if (data) {
          const disc = (cars.ticketrate * quantity) * data.discount / 100;
          let discount = Math.round(disc);

          Coupon.findOne({ code: coupon, "users.userId": userDetails._id })
            .then((user) => {
              console.log(user, 'user found');
              if (user) {
                discount = cars.ticketrate * quantity
                msg = "no";
                res.json({ success: false, discount, msg })
              } else {
                res.json({ success: true, discount });
              }
            })
        } else {
          msg = "yes";
          discount = cars.ticketrate * quantity
          res.json({ success: false, msg, discount })
        }
      })

  } catch (err) {

    res.json({ success: false, err });

  }
}



const order = async (req, res) => {
  try {

    let total = parseInt(req.body.total);
    const count = parseInt(req.body.count);
    const carId = req.body.carId;
    const coupon = req.body.coupon;

    await Ticket.find().populate('carId');
    await Ticket.find().populate('userId');

    const mail = req.session.username;
    const userData = await User.findOne({ email: mail });
    const carDetail = await Cars.findOne({ _id: carId });

    if (carDetail.ticket >= count) {

      const razorpayInstance = new Razorpay({
        // key_id:process.env.KEY_ID,
        key_id: "rzp_test_C9okbWzHpHQQPA", //      
        key_secret: "xitq4ziAwpE5tPr6LPeDyMFs"
      })
      razorpayInstance
      let amt = total * (30 / 100)
      Math.round(amt);
      const amount = parseInt(amt);
      razorpayInstance.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: "" + userData._id,
      }, (err, order) => {
        if (err) {
          msg = err;
          console.log(err);
          res.json({ success: false, msg })
        } else {
          res.json({ success: true, order, amount, coupon, count, carId, total })
        }
      })
    } else {
      if (carDetail.ticket == 0) {
        msg = `No tickets are aviliable for ${carDetail.brand} ${carDetail.name}`;
        res.json({ success: false, msg })
      } else {
        msg = `only ${carDetail.ticket - 1} tickets are aviliable for ${carDetail.brand} ${carDetail.name}`;
        res.json({ success: false, msg })
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, error })
  }
}

const verifyPayment = async (req, res) => {
  try {
    const payment = req.body;
    const orderDetails = req.body.order;
    const mail = req.session.username;


    let hmac = crypto.createHmac('SHA256', 'xitq4ziAwpE5tPr6LPeDyMFs')
    hmac.update(payment.response.razorpay_order_id + '|' + payment.response.razorpay_payment_id)
    hmac = hmac.digest('hex');

    if (hmac == payment.response.razorpay_signature) {

      const coupon = payment.order.coupon;
      let amount = parseInt(payment.order.amount);
      const count = parseInt(payment.order.count);
      const carId = payment.order.carId;
      const total = payment.order.total;


      const userData = await User.findOne({ email: mail });
      const carDetail = await Cars.findOne({ _id: carId });

      await Coupon.findOneAndUpdate({ code: coupon }, { $push: { users: { userId: userData._id } } });

      const currentUser = await Ticket.findOne({ userId: userData._id });

      if (currentUser) {

        const existingCar = await Ticket.findOne({ 'carId.carId': carId });

        if (existingCar) {

          await Ticket.findOneAndUpdate({ "carId.carId": carId },
            {
              $inc: {
                "carId.$.quantity": count,
                "carId.$.payable": total - amount,
                "carId.$.paid": amount,
              }
            },
            { new: true },);

        } else {
          const pushQuery = {
            $push: {
              carId: {
                carId: carDetail._id,
                quantity: count,
                payable: total - amount,
                paid: amount,
              }
            }
          };

          await Ticket.findOneAndUpdate({ userId: userData._id }, pushQuery, { new: true });
        }
      } else {

        const newTicket = new Ticket({
          userId: userData,
          carId: {
            carId: carDetail._id,
            quantity: count,
            payable: total - amount,
            paid: amount
          },
        });

        newTicket.save()


      }

      //Deducting booked tickets
      await Cars.findByIdAndUpdate({ _id: carDetail._id }, { $inc: { ticket: -count } })

      const orderData = await Order.findOne({ userId: userData._id })

      const discount = (carDetail.ticketrate * count) - total

      if (orderData) {

        await Order.findOneAndUpdate({ userId: userData._id }, {
          $push: {
            carId: {
              carId: carDetail._id,
              quantity: count,
              payable: total - amount,
              paid: amount,
              time: Date.now(),
              discount: discount
            },
            time: Date.now(),
          }
        })

      } else {

        const newOrder = new Order({
          userId: userData,
          carId: {
            carId: carDetail._id,
            quantity: count,
            payable: total - amount,
            paid: amount,
            time: Date.now(),
            discount: discount
          },

        });

        newOrder.save()

      }

      //Notification Saver
      if (carDetail.ticket - count == 0) {
        console.log((count), "counted as 000000000000000");
        let existUser = await Notification.findOne({ userId: userData._id })

        if (existUser) {

          await Notification.findOneAndUpdate({ userId: userData._id }, {
            $push: {
              carId: {
                carId: carDetail._id,
                quantity: count,
                payable: total - amount,
                paid: amount,
                time: Date.now(),
                discount: discount,
              },
            }
          })

        } else {

          const newNote = new Notification({
            userId: userData,
            carId: {
              carId: carDetail._id,
              name: carDetail.name,
              quantity: count,
              payable: total - amount,
              paid: amount,
              time: Date.now(),
              discount: discount
            },

          });

          newNote.save()

        }

      }


      const orderId = orderDetails.order.receipt
      res.status(200).send({ success: orderDetails.success, orderId });
    }
  } catch (err) {

    console.error(`Error Verify Online Payment:`, err);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });

  }
}


const myOrder = async (req, res) => {
  const mail = req.session.username;
  const user = await User.findOne({ email: mail });
  let orders = await Order.find({ userId: user._id }).populate("carId")
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

  let orderData;
  if (user) {
    orderData = await Notification.findOne({ userId: user._id })
  }

  let totalDiscount = 0;
  let totalPaid = 0;
  let totalGst = 0;

  orders.forEach(data => {
    data.carId.sort((a, b) => b.time - a.time);
    data.carId.forEach(data => {
      totalPaid = totalPaid + data.paid;
      totalDiscount = totalDiscount + data.discount;
    })
  });

  totalGst = totalPaid * (18 / 100);

  res.render('user/order', { user, orders, totalDiscount, totalGst, orderData });

}

const cancelOrder = async (req, res) => {
  const id = req.body.orderId;
  let data = await Order.findOneAndUpdate({ "carId._id": id }, {
    $set: {
      "carId.$.status": false
    }
  })

  if (!data) {
    res.json({ success: false, err })
  } else {
    let carData  ;
    data.carId.forEach(async (data) => {
      carData = data
      await Ticket.findOneAndUpdate({ "carId.carId": data.carId },
        {
          $inc: {
            "carId.$.quantity": -data.quantity,
            "carId.$.payable": -data.payable,
            "carId.$.paid": -data.paid,
          }
        },
        { new: true },);
    })
    await Cars.findOneAndUpdate({ _id: carData.carId },
      {
        $inc:{
          ticket: carData.quantity
        }
      })
    res.json({ success: true, data })
  }

}

const payNow = async (req, res) => {
  try {
    const orderId = req.body.orderId;
    const mail = req.session.username;
    const dataId = req.body.dataId;

    console.log(dataId);

    let total = 0;
    let count = 0;
    let carId;
    let id;

    const userData = await User.findOne({ email: mail })
    const noteData = await Notification.findOne({ userId: userData._id, "carId._id": orderId })
    noteData.carId.forEach((data) => {
      total = data.payable
      count = data.quantity
      carId = data.carId
      id = data._id
    });

    const razorpayInstance = new Razorpay({
      key_id: "rzp_test_C9okbWzHpHQQPA",
      key_secret: "xitq4ziAwpE5tPr6LPeDyMFs"
    })

    razorpayInstance
    let amt = total
    Math.round(amt);
    let amount = parseInt(amt);

    let options = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "" + userData._id,
    })

    res.json({
      success: true,
      options,
      userData,
      amount,
      dataId,
      orderId,
      carId,
      count,
      id
    });

  } catch (err) {
    console.error(`Error Payment:`, err);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}

const verifyFull = async (req, res) => {
  const body = req.body

  let hmac = crypto.createHmac('SHA256', 'xitq4ziAwpE5tPr6LPeDyMFs')
  hmac.update(body.response.razorpay_order_id + '|' + body.response.razorpay_payment_id)
  hmac = hmac.digest('hex');

  if (hmac == body.response.razorpay_signature) {

    const mail = req.session.username;
    const orderId = body.order.orderId
    const dataId = body.order.dataId
    console.log(req.body)

    const userData = await User.findOne({ email: mail })
    const noteData = await Notification.findOne({ "carId._id": orderId })
    const orderData = await Order.findOne({ "carId._id": dataId })

    let carId = req.body.order.carId
    let count = req.body.order.count
    let noteId = req.body.order.id

    let carData = await Cars.findOne({ _id: carId })

    let total = count * carData.ticketrate

    console.log(orderData + "orderdata");
    await Order.findOneAndUpdate({ userId: userData._id, "carId._id": dataId },
      {
        $set: {
          'carId.$.quantity': 0,
          'carId.$.payable': 0,
          'carId.$.paid': total
        }
      })
    await Notification.findOneAndDelete({ userId: userData._id, "carId._id": noteId })
  }
}

const signOut = (req, res) => {
  req.session.username = null;
  res.redirect('/')
}

const not = (req, res) => {
  res.render('user/404', { msg })
}

const netErr = (req, res) => {
  res.render('user/500', { msg })
}

module.exports = {
  getHome,
  getLogin,
  postLogin,
  getSignUp,
  postSignUp,
  getLikes,
  getProfile,
  deleteMe,
  getBrowse,
  signOut,
  postOtp,
  getOtp,
  emailPost,
  getOnlyOtp,
  onlyOtpPost,
  getSetPassword,
  postSetPassword,
  editMe,
  postEditMe,
  addlike,
  removeLike,
  getCarDetail,
  order,
  coupon,
  verifyPayment,
  myOrder,
  cancelOrder,
  payNow,
  verifyFull,
  not,
  netErr
}