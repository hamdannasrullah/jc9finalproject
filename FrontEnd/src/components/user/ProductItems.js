import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import {addToCart} from '../../actions'
import { connect } from 'react-redux'
import cookies from 'universal-cookie'

const cookie = new cookies()

class ProductItems extends Component {

    render () {
        const {item} = this.props
        
        return (
            <div className='card col-sm-5 col-md-3' style={{height:'535px'}}>
                <Link to={`/detailproduct/${item.id}`}>
                  <img
                    className='card-img-top rounded'
                    src={item.image}
                    alt={`image` + item.id}
                    style={{height:'280px'}}/>

                    <div className='card-body' style={{height:'200px'}}>
                      <p className='card-title font-weight-bold'>{item.product_name}</p>
                      <p className='card-text text-secondary'>{item.brand_name}</p>
                      <p className='card-text font-weight-bold text-danger'>
                      {`Rp ` + item.price.toLocaleString()}</p>
                    </div>
                  </Link>
                    <button
                      className='btn btn-outline-dark btn-block'
                      onClick={() => { this.props.addToCart( item.id, cookie.get('idLogin'))}}>
                      Add to Cart
                    </button>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return { user: state.auth }
}

export default connect(mapStateToProps, {addToCart})(ProductItems)