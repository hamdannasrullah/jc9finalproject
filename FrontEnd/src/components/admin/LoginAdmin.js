import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

import {onLoginAdmin} from '../../actions'
import {afterTwoSeconds} from '../../actions'

class LoginAdmin extends Component {
    onSubmitClick = () => {
        const user = this.username.value
        const pass = this.password.value
        this.props.onLoginAdmin(user, pass) 
    }
    onErrorLogin = () => {
        if (this.props.error !== '') {
            return (
                <div>
                    <div className='alert alert-danger mt-4 text-center'>
                        {this.props.error}
                    </div>
                </div>
            )
        }else if(this.props.empty !== ''){
            return (
                <div className='alert alert-danger mt-4 text-center'>
                    {this.props.empty}
                </div>
            )
        } else {
            return null
        }
        
    }
    render(){
        const {role} = this.props.user

        if(role !== 1){
            return(
                <div>
                <div className='mt-5 row'>
                    <div className='col-sm-6 col-md-3 mx-auto card'>
                        <div className='card-body'>
                            <div className='border-bottom border-secondary card-title'>
                                <h1>Login as Admin</h1>
                            </div>
                            <div className='card-title mt-1'>
                                <h4>Username</h4>
                            </div>
                            <form className='input-group'>
                                <input ref={input => {this.username = input}} className='form-control' type='text'/></form>
                            <div className='card-title mt-1'>
                                <h4>Password</h4>
                            </div>
                            <form className='input-group'>
                                <input ref={input => {this.password = input}}className='form-control' type='password'/>
                            </form>
                            <button className='btn btn-dark btn-block mt-5' 
                                onClick={this.onSubmitClick}>Login</button>
                                {this.onErrorLogin()}
                                {this.props.afterTwoSeconds()}
                        </div>
                    </div>
                </div>
                </div>
            )
        }else{
            return(
                <Redirect to='/admin/dashboard' />
            )

        }
    }
}

const mapStateToProps = state => {
    return {error : state.auth.error, empty: state.auth.empty, user:state.auth}
}

export default connect(mapStateToProps,{onLoginAdmin,afterTwoSeconds})(LoginAdmin)