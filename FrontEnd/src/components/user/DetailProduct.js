import React, { Component } from 'react'
import axios from '../../config/axios'
import {addToCart} from '../../actions'
import cookies from 'universal-cookie'
import {connect} from 'react-redux'

const cookie = new cookies()

class DetailProduct extends Component {
    state = {
        products : [],
         part: []
    }

    componentDidMount() {
        const idproduct = parseInt(this.props.match.params.idproduct)
        axios.get(`/product/part/${idproduct}`)
        .then(res => {this.setState({products: res.data.product, part: res.data.result2})
        })
    }

    render() {
        const {products} = this.state
        return (
          <div className='container mt-5'>
            <div className='card'>
              <div className='card-header bg-grey'>
                <p className='lead text-center'>Produk Detail</p>
              </div>
              <div className='card-body'>
                <div className='row'>
                  <div className='col-md-8 col-sm-12 order-2 order-md-1'>
                    <ul className='list-group mt-3'>
                      <li className='list-group-item pl-3'><div className='font-weight-bold'>Product: </div>{products.product_name }</li>
                      <li className='list-group-item pl-3'><div className='font-weight-bold'>Brand: </div>{products.brand_name }</li>
                      <li className='list-group-item pl-3'><div className='font-weight-bold'>Specification: </div>{products.specification_name }</li>
                      <li className='list-group-item pl-3'><div className='font-weight-bold'>Weight: </div>{`${products.weight } kg`}</li>
                      <li className='list-group-item pl-3'><div className='font-weight-bold'>Price: </div>{`Rp ${products.price }`}</li>
                      <li className='list-group-item pl-3'><div className='font-weight-bold'>Part: </div>{this.state.part.map(item => {return item.name})}</li>
                      <li className='list-group-item pl-3'><div className='font-weight-bold'>Description: </div>{products.description}</li>
                    </ul>
                  </div>
                  <div className='col-md-4 col-sm-12 order-md-2'>
                    <ul className='list-group mt-3'>
                    <img
                      src={products.image}
                      alt={products.product_name}
                      key={new Date()}
                      className='card-img-top img-thumbnail rounded' />
                      <button onClick={() => {this.props.addToCart(products.id, cookie.get('idLogin'))}}
                      className='btn btn-outline-secondary btn-block'>
                      Add to Cart
                      </button>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
}

export default connect(null,{addToCart})(DetailProduct)