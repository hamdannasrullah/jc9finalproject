import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import cookies from 'universal-cookie'

import { keepLogin } from '../actions'

import Home from './user/Home'
import Header from './user/Header'
import Footer from './user/Footer'
import ProductsByPart from './user/ProductsByPart'
import Login from './user/Login'
import Register from './user/Register'
import ManageProduct from './admin/ManageProduct'
import ManageUser from './admin/ManageUser'
import ManagePart from './admin/ManagePart'
import DetailProduct from './user/DetailProduct'
import ShoppingCart from './user/ShoppingCart'
import LoginAdmin from './admin/LoginAdmin'
import DashboardAdmin from './admin/DashboardAdmin'
import ManageBank from './admin/ManageBank'
import Profile from './user/Profile'
import PasswordUpdate from './user/PasswordUpdate'
import AddressContact from './user/AddressContact'
import Order from './user/Order'
import OrderDetail from './user/OrderDetail'
import OrderHistory from './user/OrderHistory'
import Payment from './user/Payment'
import Notification from './user/Notification'

const cookie = new cookies()


class App extends Component {

    componentDidMount(){
        var userCookie = cookie.get('stillLogin')
        var idCookie = parseInt(cookie.get('idLogin'))
        var roleCookie = parseInt(cookie.get('role'))
        var cartCookie = parseInt(cookie.get('cartqty'))
        var notification = cookie.get('notification')

        if (userCookie !== undefined || idCookie !== NaN || roleCookie !== NaN || cartCookie !== NaN || notification.length === 0) {

            this.props.keepLogin(userCookie, idCookie,roleCookie,cartCookie,notification)
        
        }
}

    render () {
        return (
        <BrowserRouter>
            <div>
                <Header/>
                <Route path='/' exact component={Home}/>
                <Route path='/product/:part' component={ProductsByPart}/>
                <Route path='/login' component={Login}/>
                <Route path='/register' component={Register}/>
                <Route path='/profile' component={Profile}/>
                <Route path='/passwordupdate' component={PasswordUpdate}/>
                <Route path='/order' component={Order}/>
                <Route path='/orderhistory' component={OrderHistory}/>
                <Route path='/payment' component={Payment}/>
                <Route path='/notification' component={Notification}/>
                <Route path='/orderitem/:orderid' component={OrderDetail}/>
                <Route path='/addresscontact' component={AddressContact}/>
                <Route path='/manageproduct' component={ManageProduct}/>
                <Route path='/manageuser' component={ManageUser}/>
                <Route path='/managepart' component={ManagePart}/>
                <Route path='/detailproduct/:idproduct' component={DetailProduct}/>
                <Route path='/shoppingcart' component={ShoppingCart}/>
                <Route path='/admin/login' component={LoginAdmin}/>
                <Route path='/admin/dashboard' component={DashboardAdmin}/>
                <Route path='/managebank' component={ManageBank}/>
                <Footer/>
            </div>
        </BrowserRouter>
            
        )
    }
}


export default connect (null, {keepLogin})(App)