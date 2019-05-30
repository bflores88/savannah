import React, { Component } from 'react';
import Item from '../Item';
import './ItemsBox.scss';

class ItemsBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      input: '',
      items: [{ name: 'banana' }, { name: 'kiwi' }],
    };

    // this.handleInputChange = this.handleInputChange.bind(this);
  }

  // handleInputChange(e) {
  //   const { value } = e.target;
  //   this.setState({ input: value });
  // }

  render() {
    console.log(this.props.items);
    const input = this.state.input;
    const itemsBox = this.props.items.map((item, idx) => {
      return <Item name={item.name} id={item.id} price={item.price} />;
    });
    return <div className="itemsBox">{itemsBox}</div>;
  }
}

export default ItemsBox;