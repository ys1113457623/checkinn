import { ProductService } from '@/utils/ProductService';
import { RoomService } from '@/utils/RoomService';

import getConfig from 'next/config';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Toolbar } from 'primereact/toolbar';
import { addRoom } from '../api/product/helper';

import { classNames } from 'primereact/utils';

import BookingsList from '@/components/BookingList';
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
  let emptyBooking = {
    user: null,
    room: null,
    checkIn: Date.now(),
    checkOut: null,
    totalPrice: 0,
  };

  const [rooms, setRooms] = useState([]);

  const [dropdownValue, setDropdownValue] = useState(null);
  const [roomType, setRoomType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');

  const [selectedItem, setSelectedItem] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser2, setSelectedUser2] = useState(null);
  const [roomNumber, setRoomNumber] = useState(''); // set initial value to '123'
  const [checkInValue, setCheckInValue] = useState(null);
  const [checkOutValue, setCheckOutValue] = useState(null);
  const [booking, setBooking] = useState(emptyBooking);

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
  const toast = useRef(null);
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleItemClick = (data) => {
    setDialogVisible(!dialogVisible);
  };

  function getRandomRoomNumber() {
    const filteredRooms = rooms.filter(
      (room) => room.roomType === selectedRoomType && room.isAvailable
    );
    const randomIndex = Math.floor(Math.random() * filteredRooms.length);
    return filteredRooms[randomIndex]?.roomNumber;
  }

  const footer = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={handleItemClick} />
      <Button label="Book" icon="pi pi-check" onClick={handleItemClick} />
    </div>
  );

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
  const [value, setValue] = useState(0);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IND',
    minimumFractionDigits: 2,
  });

  const currencyParser = (value) => {
    return value.replace(/[^\d]/g, '');
  };
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

  const createId = () => {
    let id = '';
    let chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < rooms.length; i++) {
      if (rooms[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const updateRoom = async (updatedRoom) => {
    try {
      // Update room in database
      await Axios.put(`/api/rooms/${updatedRoom._id}`, updatedRoom);

      // Update room in state
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room._id === updatedRoom._id) {
            return updatedRoom;
          } else {
            return room;
          }
        })
      );

      console.log('Room updated successfully');
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };
  const saveRoom = async () => {
    setSubmitted(true);

    if (
      room.roomNumber &&
      rooms.some((r) => r.roomNumber === room.roomNumber)
    ) {
      // Room with this roomNumber already exists, update it
      const updatedRooms = rooms.map((r) =>
        r.roomNumber === room.roomNumber ? room : r
      );
      await updateRoom(room._id, room);
      setRooms(updatedRooms);
    } else {
      // Room doesn't exist, create a new one
      const newRoom = { ...room, id: createId() };
      const names = multiselectValue.map((item) => item.name);
      newRoom.amenities = names;
      await addRoom(newRoom);
      setRooms([...rooms, newRoom]);
    }

    setRoomDialog(false);
    setRoom(emptyRoom);
  };
  const saveBooking = async () => {
    setSubmitted(true);

    if (
      room.roomNumber &&
      rooms.some((r) => r.roomNumber === room.roomNumber)
    ) {
      // Room with this roomNumber already exists, update it
      const updatedRooms = rooms.map((r) =>
        r.roomNumber === room.roomNumber ? room : r
      );
      await updateRoom(room._id, room);
      setRooms(updatedRooms);
    } else {
      // Room doesn't exist, create a new one
      const newRoom = { ...room, id: createId() };
      const names = multiselectValue.map((item) => item.name);
      newRoom.amenities = names;
      await addRoom(newRoom);
      setRooms([...rooms, newRoom]);
    }

    setRoomDialog(false);
    setRoom(emptyRoom);
  };

  useEffect(() => {
    const roomService = new RoomService();
    const productService = new ProductService();
    roomService.getRooms().then((data) => setRooms(data));
    productService.getProducts().then((data) => setUsers(data));
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
            className="p-button-danger mr-2"
            onClick={confirmDeleteSelected}
            disabled={!selectedRooms || !selectedRooms.length}
          />
          <Button
            label="Delete"
            className="p-button-danger mr-2"
            onClick={() => handleItemClick()}
            icon="pi pi-shopping-cart"
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
  //     .post('http://localhost:3000/api/rooms', {
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
          placeholder="Search by Room Number"
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
  //     .delete(`http://localhost:3000/api/rooms/?id=${id}`)
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
              {data.amenities.length !== 0 ? (
                data.amenities.map((amenity) => (
                  <span className="p-tag p-tag-rounded p-tag-info m-1">
                    {amenity}
                  </span>
                ))
              ) : (
                <span className="p-tag p-tag-rounded p-tag-info m-1">No</span>
              )}
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
                {data.amenities.length !== 0 ? (
                  data.amenities.map((amenity) => (
                    <span className="p-tag p-tag-rounded p-tag-info m-1">
                      {amenity}
                    </span>
                  ))
                ) : (
                  <span className="p-tag p-tag-rounded p-tag-info m-1">No</span>
                )}
              </div>
              <div className="flex align-items-center justify-content-between">
                <span className="text-2xl font-semibold">₹ {data.price}</span>

                {/* <Button
                  onClick={console.log(data)}
                  icon="pi pi-shopping-cart"
                  disabled={!data.isAvailable}
                /> */}
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
          <Dialog
            style={{ width: '450px', height: 'auto' }}
            modal
            className="p-fluid"
            visible={dialogVisible}
            footer={footer}
            header="Booking"
            onHide={() => setDialogVisible(false)}
          >
            <div style={{ position: 'relative' }}>
              <div className="p-fluid border-0">
                <div className="field">
                  <label htmlFor="selectUser ">Select User</label>
                  <Dropdown
                    options={users.map((user) => ({
                      name: user.first_name + ' ' + user.last_name,
                    }))}
                    value={selectedUser2}
                    onChange={(e) => {
                      setSelectedUser2(e.value);
                      setSelectedUser(
                        users.filter(
                          (user) =>
                            user.first_name + ' ' + user.last_name ===
                            e.value.name
                        )[0]
                      );
                    }}
                    optionLabel="name"
                  />
                </div>
                <div className="field">
                  <label htmlFor="roomType">Room Type</label>
                  <Dropdown
                    value={dropdownValue}
                    onSelectCapture={(e) => {
                      setRoomNumber(getRandomRoomNumber());
                    }}
                    onClick={(e) => {
                      setRoomNumber(getRandomRoomNumber());
                    }}
                    onChange={(e) => {
                      console.log(typeof e.target.value.name);
                      setSelectedRoomType(e.value.name);
                      setDropdownValue(e.value);
                    }}
                    options={dropdownValues}
                    optionLabel="name"
                    placeholder="Select"
                  />
                </div>
                <div className="field">
                  <label htmlFor="roomType">Room Number</label>
                  <InputText
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="name">Check In </label>
                  <Calendar
                    showIcon
                    showButtonBar
                    value={checkInValue}
                    hourFormat="12"
                    showTime={true}
                    onChange={(e) => setCheckInValue(e.value)}
                  ></Calendar>
                </div>
                <div className="field">
                  <label htmlFor="quantity">Check Out</label>
                  <Calendar
                    showIcon
                    showButtonBar
                    value={checkOutValue}
                    onChange={(e) => {
                      setValue(
                        ((checkOutValue - checkInValue) / (1000 * 60 * 60)) *
                          rooms.filter(
                            (room) => room.roomNumber === roomNumber
                          )[0].price
                      );
                      setCheckOutValue(e.value);
                    }}
                    showTime={true}
                    hourFormat="12"
                  />

                  {/* <Calendar
                      showIcon
                      showButtonBar
                      showTime={true}
                      hourFormat="24"
                      dateFormat="dd/mm/yy"
                      value={checkOutValue}
                      timeOnly={true}
                      onChange={(e) => setCheckOutValue(e.value)}
                    ></Calendar> */}
                </div>
              </div>
              <div className="p-field">
                <label htmlFor="currencyInput">Enter Amount</label>
                <span className="p-input-icon-left">
                  <InputNumber
                    value={value}
                    onValueChange={(e) => setValue(e.value)}
                    showButtons
                    mode="currency"
                    currency="INR"
                    minFractionDigits={2}
                    format={currencyFormatter}
                    parse={currencyParser}
                  ></InputNumber>

                  {/* <InputNumber
                    id="currencyInput"
                    value={value}
                    onValueChange={(e) => setValue(e.value)}
                    mode="currency"
                    currency="INR"
                    locale="en-US"
                    placeholder="$0.00"
                    minFractionDigits={2}
                    showButtons
                    buttonLayout="horizontal"
                    suffix=".00"
                    decimalSeparator="."
                    thousandSeparator=","
                    className="p-inputtext-lg"
                    format={currencyFormatter}
                    parse={currencyParser}
                  /> */}
                </span>
              </div>
              <BookingsList />
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
