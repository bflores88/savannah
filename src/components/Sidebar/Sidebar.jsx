import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.scss';
import CategoryLinks from '../CategoryLinks';

const Sidebar = (props) => {
  //generate links for items by category
  const createItemCategoryLinks = () => {
    return (
      <div className="category-links">
        <h4>Shop By Category</h4>
        <Link to="/">
          <button>View All</button>
        </Link>
        <CategoryLinks />
      </div>
    );
  };

  const createDefaultLinks = (id) => {
    const userLink = `/profiles/${id}`;
    const userItemsLink = `/users/${id}/items`;
    return (
      <>
        <div className="nav-links">
          <Link to="/">
            <button>Home</button>
          </Link>
        </div>

        <div className="nav-links">
          <Link to={userLink}>
            <button>My Profile</button>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/profiles/settings">
            <button>Settings</button>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/messages">
            <button>Messages</button>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/cart">
            <button>My Cart</button>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/orders">
            <button>My Orders</button>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/sales">
            <button>My Sales</button>
          </Link>
        </div>

        <div className="nav-links">
          <Link to={userItemsLink}>
            <button>My Items</button>
          </Link>
        </div>

        <div className="nav-links">
          <Link to="/add-item">
            <button>Add Items</button>
          </Link>
        </div>
      </>
    );
  };

  //conditional statement to show if isLoggedIn is true or false (logged in or not) AND check the role

  //first if statement is for non-users
  //second if is for users
  //else is for admins and moderators

  if (!props.currentUser) {
    return (
      <div className="public-nav">
        <div className="logo">
          <i className="sunLogo" className="fas fa-sun" />
          <Link to="/">Savannah</Link>
        </div>
        <div className="wrap-links">
          <div className="nav-links">
            <Link to="/register">
              <button>Register</button>
            </Link>
          </div>

          <div className="nav-links">
            <Link to="/">
              <button>Home</button>
            </Link>
          </div>
        </div>
        <div className="cat-links">{createItemCategoryLinks()}</div>
      </div>
    );
  } else if (props.currentUser.role_id === 3) {
    // const messageLink = `/messages/${props.currentUser.id}`;
    return (
      <div className="user-nav">
        <div className="logo">
          <i className="sunLogo" class="fas fa-sun" />
          <Link to="/">Savannah</Link>
        </div>
        <div className="wrap-links">
          {createDefaultLinks(props.currentUser.id)}
          <div className="cat-links">{createItemCategoryLinks()}</div>
        </div>
      </div>
    );
  } else if (props.currentUser.role_id === 2) {
    // const messageLink = `/messages/${props.currentUser.id}`;
    return (
      <div className="admin-nav">
        <div className="logo">
          <i className="sunLogo" class="fas fa-sun" />
          <Link to="/">SAVANNAH</Link>
        </div>
        <div className="wrap-links">
          {createDefaultLinks(props.currentUser.id)}

          <br />

          <div className="nav-links">
            <Link to="/admin-items">
              <button>All Items</button>
            </Link>
          </div>

          <div className="cat-links">{createItemCategoryLinks()}</div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="admin-nav">
        <div className="logo">
          <i className="sunLogo" class="fas fa-sun" />
          <Link to="/">Savannah</Link>
        </div>

        <div className="wrap-links">
          {createDefaultLinks(props.currentUser.id)}

          <br />

          <div className="nav-links">
            <Link to="/admin-users">
              <button>All Users</button>
            </Link>
          </div>

          <div className="nav-links">
            <Link to="/admin-items">
              <button>All Items</button>
            </Link>
          </div>

          <div className="nav-links">
            <Link to="/admin-categories">
              <button>All Categories</button>
            </Link>
          </div>

          <div className="cat-links">{createItemCategoryLinks()}</div>
        </div>
      </div>
    );
  }
};

export default Sidebar;
