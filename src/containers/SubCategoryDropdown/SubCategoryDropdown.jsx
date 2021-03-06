import React, { Component } from 'react';
import { connect } from 'react-redux';
// import './CategoryDropdown.scss';
import { addItem } from '../../actions';
import { resetNewItem } from '../../actions';
import { loadCategories } from '../../actions';
import { updateChosenSubCategory } from '../../actions';

class SubCategoryDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category_dropdown_id: '',
      subcategory_dropdown_id: '',
      subcategories: [],
    };
    this.handleInputOnChange = this.handleInputOnChange.bind(this);
  }

  handleInputOnChange(e) {
    const value = e.target.value;
    const name = e.target.name;
    this.setState({ subcategory_dropdown_id: value });
    this.props.updateChosenSubCategory(value);
  }

  componentDidMount() {
    this.props.loadCategories();
  }

  render() {
    let subCategoryOptions;
    if (this.props.category_id !== '') {
      const { category_id } = this.props;

      let filteredCategory = this.props.categories.filter((categories) => categories.id == category_id);

      let filteredSubcategories = filteredCategory[0].sub_categories;

      subCategoryOptions = filteredSubcategories.map((subcategory, idx) => {
        return <option value={subcategory.id}>{subcategory.sub_category_name}</option>;
      });
    }

    if (this.props.category_id !== '') {
      return (
        <select
          name="subcategory_dropdown_id"
          className="select"
          value={this.state.subcategory_dropdown_id}
          onChange={this.handleInputOnChange}
          required
        >
          <option value="">Choose a SubCategory</option>

          {subCategoryOptions}
        </select>
      );
    } else {
      return <div />;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    images: state.itemReducer.images,
    currentUser: state.itemReducer.currentUser,
    newestItem: state.itemReducer.newestItem,
    categories: state.itemReducer.categories,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addItem: (item) => {
      dispatch(addItem(item));
    },
    resetNewItem: (item) => {
      dispatch(resetNewItem(item));
    },
    loadCategories: () => {
      dispatch(loadCategories());
    },
    updateChosenSubCategory: (id) => {
      dispatch(updateChosenSubCategory(id));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SubCategoryDropdown);
