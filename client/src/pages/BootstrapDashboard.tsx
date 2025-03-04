import React, { useState } from 'react';
import { Link } from 'wouter';

const BootstrapDashboard: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar (col-md-3) */}
        {showSidebar && (
          <div className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
            <div className="position-sticky pt-3">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <Link href="/" className="nav-link active">
                    <i className="bi bi-house-door me-2"></i>
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/orders" className="nav-link">
                    <i className="bi bi-file-earmark me-2"></i>
                    Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/products" className="nav-link">
                    <i className="bi bi-cart me-2"></i>
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/customers" className="nav-link">
                    <i className="bi bi-people me-2"></i>
                    Customers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/reports" className="nav-link">
                    <i className="bi bi-bar-chart me-2"></i>
                    Reports
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/settings" className="nav-link">
                    <i className="bi bi-gear me-2"></i>
                    Settings
                  </Link>
                </li>
              </ul>

              <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
                <span>Saved reports</span>
                <a className="link-secondary" href="#" aria-label="Add a new report">
                  <i className="bi bi-plus-circle"></i>
                </a>
              </h6>
              <ul className="nav flex-column mb-2">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Current month
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Last quarter
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Year-end sale
                  </a>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Main content */}
        <main className={`col-md-9 ms-sm-auto ${showSidebar ? 'col-lg-10' : 'col-lg-12'} px-md-4`}>
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              <button 
                type="button" 
                className="btn btn-sm btn-outline-secondary me-2"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                {showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
              </button>
              
              <div className="btn-group me-2">
                <button type="button" className="btn btn-sm btn-outline-secondary">Share</button>
                <button type="button" className="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <i className="bi bi-calendar"></i>
                This week
              </button>
            </div>
          </div>

          {/* Charts */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header">
                  <h5 className="card-title">Sales Overview</h5>
                </div>
                <div className="card-body" style={{ height: '300px', background: '#f8f9fa' }}>
                  <div className="d-flex justify-content-center align-items-center h-100">
                    <p className="text-muted">Chart Placeholder</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="row mb-4">
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="card text-white bg-primary h-100">
                <div className="card-header">Revenue</div>
                <div className="card-body">
                  <h5 className="card-title">$24,500</h5>
                  <p className="card-text">Total revenue this month</p>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-4 mb-md-0">
              <div className="card text-white bg-success h-100">
                <div className="card-header">Orders</div>
                <div className="card-body">
                  <h5 className="card-title">128</h5>
                  <p className="card-text">Orders processed</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-white bg-info h-100">
                <div className="card-header">Customers</div>
                <div className="card-body">
                  <h5 className="card-title">45</h5>
                  <p className="card-text">New customers this month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <h2>Recent Orders</h2>
          <div className="table-responsive">
            <table className="table table-striped table-sm">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Date</th>
                  <th scope="col">Customer</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{new Date().toLocaleDateString()}</td>
                    <td>Customer {index + 1}</td>
                    <td>${Math.floor(Math.random() * 1000)}</td>
                    <td>
                      <span className={`badge ${index % 3 === 0 ? 'bg-success' : index % 3 === 1 ? 'bg-warning' : 'bg-danger'}`}>
                        {index % 3 === 0 ? 'Completed' : index % 3 === 1 ? 'Pending' : 'Cancelled'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button className="btn btn-sm btn-outline-secondary">View</button>
                        <button className="btn btn-sm btn-outline-secondary">Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav aria-label="Page navigation example" className="mt-4">
            <ul className="pagination justify-content-center">
              <li className="page-item disabled">
                <a className="page-link" href="#" tabIndex={-1} aria-disabled="true">Previous</a>
              </li>
              <li className="page-item active"><a className="page-link" href="#">1</a></li>
              <li className="page-item"><a className="page-link" href="#">2</a></li>
              <li className="page-item"><a className="page-link" href="#">3</a></li>
              <li className="page-item">
                <a className="page-link" href="#">Next</a>
              </li>
            </ul>
          </nav>
          
          {/* Formulário Bootstrap */}
          <h2 className="mt-5 mb-4">Contact Form</h2>
          <div className="row">
            <div className="col-md-6">
              <form>
                <div className="mb-3">
                  <label htmlFor="nameInput" className="form-label">Name</label>
                  <input type="text" className="form-control" id="nameInput" placeholder="Enter your name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="emailInput" className="form-label">Email address</label>
                  <input type="email" className="form-control" id="emailInput" placeholder="name@example.com" />
                  <div className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="messageTextarea" className="form-label">Message</label>
                  <textarea className="form-control" id="messageTextarea" rows={3}></textarea>
                </div>
                <div className="mb-3 form-check">
                  <input type="checkbox" className="form-check-input" id="exampleCheck1" />
                  <label className="form-check-label" htmlFor="exampleCheck1">Subscribe to newsletter</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="my-5 pt-5 text-muted text-center text-small">
            <p className="mb-1">© 2025 Company Name</p>
            <ul className="list-inline">
              <li className="list-inline-item"><a href="#">Privacy</a></li>
              <li className="list-inline-item"><a href="#">Terms</a></li>
              <li className="list-inline-item"><a href="#">Support</a></li>
            </ul>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default BootstrapDashboard;