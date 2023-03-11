import getConfig from 'next/config';

import { ProductService } from '@/utils/ProductService';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import React, { useEffect, useRef, useState } from 'react';
import validator from 'validator';
import { addUser } from '../api/product/helper';

const Crud = () => {
  let emptyProduct = {
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    gender: 'Male',
    phone_number: '',
    address: '',
    country: '',
    city: '',
    pincode: null,
  };
  // const [formData, setFormData] = useReducer(formReducer, {});

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   if (Object.keys(formData).length == 0)
  //     return console.log("Don't have Form Data");
  //   console.log(formData);
  // };

  const [message, setMessage] = useState(false);

  const validateEmail = (e) => {
    var email = e.target.value;
    if (validator.isEmail(email)) {
      setMessage(true);
    } else {
      setMessage(false);
    }
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const contextPath = getConfig().publicRuntimeConfig.contextPath;

  // const [image, setImage] = useState(null);

  useEffect(() => {
    const productService = new ProductService();
    productService.getProducts().then((data) => setProducts(data));
  }, []);

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    if (product.first_name.trim()) {
      let _products = [...products];
      let _product = { ...product };
      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Updated',
          life: 3000,
        });
      } else {
        _product.id = createId();
        _products.push(_product);
        console.log(_product);
        await addUser(_product);
        // Axios.post('http://localhost:3000/api/product', _product,{"Accept":"application/json, text/plain, /","Content-Type": "multipart/form-data"}
        // )
        toast.current.show({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Created',
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Product Deleted',
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const createId = () => {
    let id = '';
    let chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  // const exportCSV = () => {
  //   dt.current.exportCSV();
  // };

  const confirmDeleteSelected = () => {
    setDeleteProductsDialog(true);
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: 'success',
      summary: 'Successful',
      detail: 'Products Deleted',
      life: 3000,
    });
  };

  // const onCategoryChange = (e) => {
  //   let _product = { ...product };
  //   _product['category'] = e.value;
  //   setProduct(_product);
  // };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
  };

  // const onInputNumberChange = (e, name) => {
  //   const val = e.value || 0;
  //   let _product = { ...product };
  //   _product[`${name}`] = val;

  //   setProduct(_product);
  // };

  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <div className="my-2">
          <Button
            label="New"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={confirmDeleteSelected}
            disabled={!selectedProducts || !selectedProducts.length}
          />
        </div>
      </React.Fragment>
    );
  };

  // const codeBodyTemplate = (rowData) => {
  //   return (
  //     <>
  //       <span className="p-column-title">Code</span>
  //       {rowData.code}
  //     </>
  //   );
  // };

  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.first_name} {rowData.last_name}
      </>
    );
  };

  const priceBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {rowData.country}
      </>
    );
  };

  const categoryBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Category</span>
        {rowData.category}
      </>
    );
  };

  // const ratingBodyTemplate = (rowData) => {
  //   return (
  //     <>
  //       <span className="p-column-title">Reviews</span>
  //       <Rating value={rowData.rating} readOnly cancel={false} />
  //     </>
  //   );
  // };

  const statusBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        <span className={`product-badge status-${rowData.inventoryStatus}`}>
          {rowData.inventoryStatus}
        </span>
      </>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Manage Guests</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Search..."
        />
      </span>
    </div>
  );

  const productDialogFooter = (
    <>
      <Button
        label="Cancel"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Save"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveProduct}
      />
    </>
  );
  const deleteProductDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </>
  );
  const deleteProductsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          {/* New Product And Delete Product */}
          <Toolbar className="mb-4" right={leftToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={products}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
            globalFilter={globalFilter}
            emptyMessage="No products found."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '4rem' }}
            ></Column>
            {/* <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ minWidth: '15rem' }}></Column> */}
            <Column
              field="name"
              header="Name"
              sortable
              body={nameBodyTemplate}
              headerStyle={{ minWidth: '15rem' }}
            ></Column>
            {/* <Column header="Image" body={imageBodyTemplate}></Column> */}
            <Column
              field="gender"
              header="Gender"
              body={priceBodyTemplate}
              sortable
            ></Column>
            <Column
              field="phoneNumber"
              header="Phone Number"
              sortable
              body={categoryBodyTemplate}
              headerStyle={{ minWidth: '10rem' }}
            ></Column>
            {/* <Column field="rating" header="Reviews" body={ratingBodyTemplate} sortable></Column> */}
            <Column
              field="inventoryStatus"
              header="Status"
              body={statusBodyTemplate}
              sortable
              headerStyle={{ minWidth: '10rem' }}
            ></Column>
            <Column
              body={actionBodyTemplate}
              headerStyle={{ minWidth: '10rem' }}
            ></Column>
          </DataTable>

          <Dialog
            visible={productDialog}
            style={{ width: '450px' }}
            header="Guest Details"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            {product.image && (
              <img
                src={`${contextPath}/demo/images/product/${product.image}`}
                alt={product.image}
                width="150"
                className="mt-0 mx-auto mb-5 block shadow-2"
              />
            )}

            <div className="formgrid grid">
              <div className="field col">
                <label htmlFor="name">First Name</label>
                <InputText
                  id="name"
                  value={product.first_name}
                  onChange={(e) => onInputChange(e, 'first_name')}
                  required
                  autoFocus
                  className={classNames({
                    'p-invalid': submitted && !product.name,
                  })}
                />
              </div>
              <div className="field col">
                <label htmlFor="quantity">Last Name</label>
                <InputText
                  id="name"
                  value={product.last_name}
                  onChange={(e) => onInputChange(e, 'last_name')}
                  required
                  autoFocus
                  className={classNames({
                    'p-invalid': submitted && !product.name,
                  })}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="description">Email</label>
              <InputText
                id="description"
                value={product.email}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !product.email,
                })}
                onChange={(e) => {
                  onInputChange(e, 'email');
                  validateEmail(e);
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="phone_number">Phone Number</label>
              <InputText
                id="phone_numnber"
                value={product.phone_number}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !product.phone_number,
                })}
                onChange={(e) => {
                  onInputChange(e, 'phone_number');
                  validateEmail(e);
                }}
              />
            </div>
            <div className="p-fluid formgrid grid">
              <div className="field col-12">
                <label htmlFor="address">Address</label>
                <InputTextarea
                  id="address"
                  rows="3"
                  value={product.address}
                  onChange={(e) => onInputChange(e, 'address')}
                  required
                  autoFocus
                  className={classNames({
                    'p-invalid': submitted && !product.address,
                  })}
                />
              </div>

              <div className="field col-12 md:col-4">
                <label htmlFor="city">Country</label>
                <InputText
                  id="city"
                  type="text"
                  value={product.country}
                  onChange={(e) => onInputChange(e, 'country')}
                  required
                  autoFocus
                  className={classNames({
                    'p-invalid': submitted && !product.country,
                  })}
                />
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="city">City</label>
                <InputText
                  id="city"
                  type="text"
                  value={product.city}
                  required
                  autoFocus
                  className={classNames({
                    'p-invalid': submitted && !product.city,
                  })}
                  onChange={(e) => onInputChange(e, 'city')}
                />
              </div>
              <div className="field col-12 md:col-4">
                <label htmlFor="pincode">Pincode</label>
                <InputText
                  id="pincode"
                  type="text"
                  required
                  autoFocus
                  className={classNames({
                    'p-invalid': submitted && !product.pincode,
                  })}
                  value={product.pincode}
                  onChange={(e) => onInputChange(e, 'pincode')}
                />
              </div>
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {product && (
                <span>
                  Are you sure you want to delete <b>{product.name}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: '450px' }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: '2rem' }}
              />
              {product && (
                <span>
                  Are you sure you want to delete the selected products?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Crud;
