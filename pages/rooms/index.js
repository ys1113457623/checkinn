import { RoomService } from '@/utils/RoomService';
import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Toolbar } from 'primereact/toolbar';

import { classNames } from 'primereact/utils';

import React, { useEffect, useRef, useState } from 'react';

const RoomManager = () => {
  const listValue = [
    { name: 'San Francisco', code: 'SF' },
    { name: 'London', code: 'LDN' },
    { name: 'Paris', code: 'PRS' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Berlin', code: 'BRL' },
    { name: 'Barcelona', code: 'BRC' },
    { name: 'Rome', code: 'RM' },
  ];
  let emptyRoom = {
    roomNumber: '',
    roomType: '',
    price: '',
    isAvailable: true,
    amenities: [],
    bookings: [],
  };

  const [rooms, setRooms] = useState('');

  const [dropdownValue, setDropdownValue] = useState(null);
  const [roomType, setRoomType] = useState(null);

  const [filteredValue, setFilteredValue] = useState(null);
  const [room, setRoom] = useState(emptyRoom);
  const [selectedRooms, setSelectedRooms] = useState(null);
  const [roomDialog, setRoomDialog] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [multiselectValue, setMultiselectValue] = useState(null);

  const [layout, setLayout] = useState('grid');
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const contextPath = getConfig().publicRuntimeConfig.contextPath;
  const dt = useRef(null);

  const sortOptions = [
    { label: 'Price High to Low', value: '!price' },
    { label: 'Price Low to High', value: 'price' },
  ];
  const dropdownValues = [
    { name: 'Single' },
    { name: 'Double' },
    { name: 'Triple' },
    { name: 'Suite' },
  ];
  const multiselectValues = [{ name: 'Wifi' }, { name: 'AC' }, { name: 'TV' }];
  const exportCSV = () => {
    dt.current.exportCSV();
  };
  // Fetch all rooms from the server on component mount
  useEffect(() => {
    // axios
    //   .get('/api/rooms')
    //   .then((res) => {
    //     setRooms(res.data);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, []);

  const hideDialog = () => {
    setSubmitted(false);
    setRoomDialog(false);
  };

  const saveRoom = async () => {
    setSubmitted(true);
    multiselectValue = multiselectValue.map((item) => item.name);
    room.amenities = multiselectValue;
    console.log(JSON.stringify(room));
    // if (room.roomNumber.trim()) {
    //   let _products = [...rooms];
    //   let _product = { ...room };
    //   if (room.id) {
    //     const index = findIndexById(room.id);

    //     _products[index] = _product;
    //     toast.current.show({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Product Updated',
    //       life: 3000,
    //     });
    //   } else {
    //     _product.id = createId();
    //     _products.push(_product);
    //     console.log(_product);
    //     await addUser(_product);
    //     // Axios.post('http://localhost:3000/api/product', _product,{"Accept":"application/json, text/plain, /","Content-Type": "multipart/form-data"}
    //     // )
    //     toast.current.show({
    //       severity: 'success',
    //       summary: 'Successful',
    //       detail: 'Product Created',
    //       life: 3000,
    //     });
    //   }

    //   setRooms(_products);
    //   setProductDialog(false);
    //   setRoom(emptyProduct);
    // }
  };

  useEffect(() => {
    const roomService = new RoomService();
    roomService.getRooms().then((data) => setRooms(data));
    setGlobalFilterValue('');
  }, []);

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _room = { ...room };
    _room[`${name}`] = val;

    setRoom(_room);
  };

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
        onClick={saveRoom}
      />
    </>
  );

  const openNew = () => {
    setRoom(emptyRoom);
    setSubmitted(false);
    setRoomDialog(true);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || '';
    let _room = { ...room };
    _room[`${name}`] = val;

    setRoom(_room);
  };

  const onDropDownChangeRoomType = (e, name) => {
    let _room = { ...room };
    _room['roomType'] = e.target.value.name;
    setRoom(_room);
  };

  const handleMultiselectChange = (e) => {
    // Map the selected values to an object with the required format
    const selectedValuesAsObjects = e.value.map((value) => ({
      name: value,
      // Add any other required properties to the object
    }));

    setSelectedValues(selectedValuesAsObjects);
  };

  const confirmDeleteSelected = () => {
    setDeleteRoomsDialog(true);
  };

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
            disabled={!selectedRooms || !selectedRooms.length}
          />
        </div>
      </React.Fragment>
    );
  };
  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <FileUpload
          mode="basic"
          accept="image/*"
          maxFileSize={1000000}
          label="Import"
          chooseLabel="Import"
          className="mr-2 inline-block"
        />
        <Button
          label="Export"
          icon="pi pi-upload"
          className="p-button-help"
          onClick={exportCSV}
        />
      </React.Fragment>
    );
  };

  const onFilter = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    if (value.length === 0) {
      setFilteredValue(null);
    } else {
      const filtered = rooms.filter((room) => {
        return room.roomNumber.toString().toLowerCase().includes(value);
      });
      setFilteredValue(filtered);
    }
  };

  // Function to handle adding a new room
  // const handleAddRoom = () => {
  //   axios
  //     .post('http://localhost:3001/api/rooms', {
  //       roomNumber,
  //       roomType,
  //       price,
  //       amenities,
  //     })
  //     .then((res) => {
  //       setRooms([...rooms, res.data]);
  //       setRoomNumber('');
  //       setRoomType('');
  //       setPrice('');
  //       setAmenities([]);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  const onSortChange = (event) => {
    const value = event.value;

    if (value.indexOf('!') === 0) {
      setSortOrder(-1);
      setSortField(value.substring(1, value.length));
      setSortKey(value);
    } else {
      setSortOrder(1);
      setSortField(value);
      setSortKey(value);
    }
  };

  const itemTemplate = (data, layout) => {
    if (!data) {
      return;
    }

    if (layout === 'list') {
      return dataviewListItem(data);
    } else if (layout === 'grid') {
      return dataviewGridItem(data);
    }
  };

  const dataViewHeader = (
    <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
      <Dropdown
        value={sortKey}
        options={sortOptions}
        optionLabel="label"
        placeholder="Sort By Price"
        onChange={onSortChange}
      />
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          value={globalFilterValue}
          onChange={onFilter}
          placeholder="Search by Name"
        />
      </span>
      <DataViewLayoutOptions
        layout={layout}
        onChange={(e) => setLayout(e.value)}
      />
    </div>
  );

  // Function to handle deleting a room
  // const handleDeleteRoom = (id) => {
  //   axios
  //     .delete(`http://localhost:3001/api/rooms/?id=${id}`)
  //     .then(() => {
  //       setRooms(rooms.filter((room) => room._id !== id));
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };
  const dataviewListItem = (data) => {
    return (
      <div className="col-12">
        <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
          <img
            src={`${contextPath}/demo/images/product/bamboo-watch.jpg`}
            alt={data.name}
            className="my-4 md:my-0 w-9 md:w-10rem shadow-2 mr-5"
          />
          <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
            <div className="font-bold text-2xl">
              Room No : {data.roomNumber}
            </div>
            <div className="mb-2">{data.roomType}</div>
            {/* <Rating
              value={data.rating}
              readOnly
              cancel={false}
              className="mb-2"
            ></Rating> */}
            <div className="flex flex-row flex-wrap">
              {data.amenities.map((amenity) => (
                <span className="p-tag p-tag-rounded p-tag-info m-1">
                  {amenity}
                </span>
              ))}
            </div>
            {/* <div className="flex align-items-center">
              <span className="font-semibold">{data.amenities}</span>
            </div> */}
          </div>
          <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
            <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">
              ${data.price}
            </span>
            <Button
              icon="pi pi-shopping-cart"
              label="Book"
              disabled={data.isAvailable === false}
              className="mb-2 p-button-sm"
            ></Button>
            <span className={`product-badge status-${data.inventoryStatus}`}>
              {data.isAvailable ? 'Available' : 'Not Available'}
            </span>
          </div>
        </div>
      </div>
    );
  };
  const dataviewGridItem = (data) => {
    return (
      <div className="col-12 lg:col-4 w-3">
        <div className="card m-3 border-1 surface-border p-2">
          <div class="max-w-xs rounded overflow-hidden shadow-lg">
            <img
              class="w-full"
              src={`${contextPath}/demo/images/product/bamboo-watch.jpg`}
              alt="Sunset in the mountains"
            />
            <span
              className={`product-badge status-${
                data.isAvailable ? 'Available' : 'Not Available'
              } p-tag-rounded p-tag-info font-normal`}
            >
              {data.isAvailable ? 'Available' : 'Not Available'}
            </span>

            <div class="px-1 py-1">
              <div class="font-bold text-xl mb-2">
                Room No : {data.roomNumber}
              </div>
              <div
                class="font-normal
                mb-2 text-base"
              >
                {data.roomType} Room
              </div>
              <div className="flex flex-row flex-wrap">
                {data.amenities.map((amenity) => (
                  <span className="p-tag p-tag-rounded p-tag-info m-1">
                    {amenity}
                  </span>
                ))}
              </div>
              <div className="flex align-items-center justify-content-between">
                <span className="text-2xl font-semibold">₹ {data.price}</span>
                <Button
                  icon="pi pi-shopping-cart"
                  disabled={data.isAvailable === false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="grid list-demo">
      <div className="col-12">
        <div className="card">
          <h5>DataView</h5>
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            right={rightToolbarTemplate}
          ></Toolbar>
          <DataView
            value={filteredValue || rooms}
            layout={layout}
            paginator
            rows={9}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
            header={dataViewHeader}
          ></DataView>
          <Dialog
            visible={roomDialog}
            style={{ width: '450px' }}
            header="Guest Details"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="roomNumber">Room Number</label>
              <InputNumber
                id="roomNumber"
                value={room.roomNumber}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !room.roomNumber,
                })}
                onChange={(e) => {
                  onInputNumberChange(e, 'roomNumber');
                }}
              />
            </div>
            <div className="field">
              <label htmlFor="roomType">Room Type</label>
              <Dropdown
                value={dropdownValue}
                className={classNames({
                  'p-invalid': submitted && !room.roomType,
                })}
                onChange={(e) => {
                  console.log(typeof e.target.value.name);
                  setDropdownValue(e.value);
                  onDropDownChangeRoomType(e, 'name');
                }}
                options={dropdownValues}
                optionLabel="name"
                placeholder="Select"
              />
            </div>
            <div className="field">
              <label htmlFor="roomType">Amenities</label>

              <MultiSelect
                id="multiselect"
                options={multiselectValues}
                value={multiselectValue}
                onChange={(e) => {
                  setMultiselectValue(e.value);
                }}
                optionLabel="name"
              ></MultiSelect>
            </div>
            <div className="field">
              <label htmlFor="price">Room Price</label>
              <InputNumber
                id="price"
                value={room.price}
                required
                autoFocus
                className={classNames({
                  'p-invalid': submitted && !room.price,
                })}
                onChange={(e) => {
                  onInputNumberChange(e, 'price');
                }}
              />
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <h1>Room Manager</h1>

  //     {/* Add a new room */}
  //     <h2>Add a new room</h2>
  //     <label htmlFor="roomNumber">Room number:</label>
  //     <input
  //       type="number"
  //       id="roomNumber"
  //       value={roomNumber}
  //       onChange={(e) => setRoomNumber(e.target.value)}
  //     />
  //     <br />
  //     <label htmlFor="roomType">Room type:</label>
  //     <select
  //       id="roomType"
  //       value={roomType}
  //       onChange={(e) => setRoomType(e.target.value)}
  //     >
  //       <option value="">Select a room type</option>
  //       <option value="Single">Single</option>
  //       <option value="Double">Double</option>
  //       <option value="Triple">Triple</option>
  //       <option value="Suite">Suite</option>
  //     </select>
  //     <br />
  //     <label htmlFor="price">Price per night:</label>
  //     <input
  //       type="number"
  //       id="price"
  //       value={price}
  //       onChange={(e) => setPrice(e.target.value)}
  //     />
  //     <br />
  //     <label htmlFor="amenities">Amenities:</label>
  //     <input
  //       type="text"
  //       id="amenities"
  //       value={amenities}
  //       onChange={(e) => setAmenities(e.target.value.split(','))}
  //     />
  //     <br />
  //     <button onClick={handleAddRoom}>Add room</button>

  //     {/* List all rooms */}
  //     <h2>All rooms</h2>
  //     <ul>
  //       {rooms.map((room) => (
  //         <li key={room._id}>
  //           Room {room.roomNumber} - {room.roomType} - ${room.price}/night -
  //           Amenities: {room.amenities.join(', ')}
  //           <button onClick={() => handleDeleteRoom(room._id)}>Delete</button>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
};

export default RoomManager;
