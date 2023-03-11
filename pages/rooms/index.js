import { ProductService } from '@/utils/ProductService';
import { RoomService } from '@/utils/RoomService';

import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';

import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { Toolbar } from 'primereact/toolbar';
import { addBooking, addRoom } from '../api/product/helper';

import { classNames } from 'primereact/utils';

import { BookingService } from '@/utils/BookingService';
import { Axios } from 'axios';
import React, { useEffect, useState } from 'react';

const RoomManager = () => {
  let emptyRoom = {
    roomNumber: '',
    roomType: '',
    price: '',
    isAvailable: true,
    amenities: [],
    bookings: [],
  };
  let emptyBooking = {
    user: '',
    room: '',
    checkIn: '',
    checkOut: null,
    totalPrice: 0,
  };

  const [rooms, setRooms] = useState([]);

  const [dropdownValue, setDropdownValue] = useState(null);

  const [bookings, setBookings] = useState([]);

  const [selectedRoomType, setSelectedRoomType] = useState('');

  const [users, setUsers] = useState([]);
  const [selectedUser2, setSelectedUser2] = useState(null);
  const [roomNumber, setRoomNumber] = useState(''); // set initial value to '123'
  const [checkInValue, setCheckInValue] = useState(null);
  const [checkOutValue, setCheckOutValue] = useState(null);
  const [booking, setBooking] = useState(emptyBooking);

  const [filteredValue, setFilteredValue] = useState(null);
  const [room, setRoom] = useState(emptyRoom);

  const [roomDialog, setRoomDialog] = useState(false);
  const [bookingDialog, setBookingDialog] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [submitted2, setSubmitted2] = useState(false);

  const [multiselectValue, setMultiselectValue] = useState(null);

  const [layout, setLayout] = useState('grid');
  const [sortOrder, setSortOrder] = useState(null);
  const [sortField, setSortField] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');

  const [dialogVisible, setDialogVisible] = useState(false);

  const handleItemClick = () => {
    setDialogVisible(!dialogVisible);
  };

  function getRandomRoomNumber() {
    const filteredRooms = rooms.filter(
      (room) => room.roomType === selectedRoomType && room.isAvailable
    );
    const randomIndex = Math.floor(Math.random() * filteredRooms.length);
    return filteredRooms[randomIndex]?.roomNumber;
  }

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
  const hideDialog2 = () => {
    setSubmitted2(false);
    setBookingDialog(false);
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

  const updateBooking = async (id, bookingData) => {
    try {
      const res = await Axios.put(`/api/booking/${id}`, bookingData);
      return res.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
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
    console.log(booking);
    setSubmitted2(true);

    if (booking._id && bookings.some((b) => b._id === booking._id)) {
      // Booking already exists, update it
      const updatedBookings = bookings.map((b) =>
        b._id === booking._id ? booking : b
      );
      await updateBooking(booking._id, booking);
      setBookings(updatedBookings);
    } else {
      // Booking doesn't exist, create a new one
      const newBooking = { ...booking, id: createId() };
      await addBooking(newBooking);
      setBookings([...bookings, newBooking]);
    }

    setBookingDialog(false);
    setBooking(emptyBooking);
  };

  const footer = (
    <div>
      <Button label="Cancel" icon="pi pi-times" onClick={handleItemClick} />
      <Button label="Book" icon="pi pi-check" onClick={saveBooking} />
    </div>
  );

  useEffect(() => {
    const roomService = new RoomService();
    const bookingService = new BookingService();

    const productService = new ProductService();
    roomService.getRooms().then((data) => setRooms(data));
    bookingService.getBookings().then((data) => setBookings(data));
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
  const openNew2 = () => {
    setBooking(emptyBooking);
    setSubmitted2(false);
    setBookingDialog(true);
  };

  const onDropDownChangeBookingRoomType = (e) => {
    let _booking = { ...booking };
    // console.log(e.target);
    _booking['roomType'] = e.target.value.id;
    setBooking(_booking);
  };

  const checkInChange = (e) => {
    let _booking = { ...booking };
    console.log(e);
    _booking['checkIn'] = e;
    setBooking(_booking);
  };
  const checkOutChange = (e) => {
    let _booking = { ...booking };
    console.log(e);
    _booking['checkOut'] = e;
    setBooking(_booking);
  };
  const roomChange = (e) => {
    let _booking = { ...booking };
    console.log(e._id);

    _booking['room'] = e._id;
    setBooking(_booking);
  };

  const onDropDownChangeUser = (e) => {
    let _booking = { ...booking };
    console.log(e.target.value._id);
    _booking['user'] = e.target.value._id;
    setBooking(_booking);
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
            label="Book"
            className="p-button-danger mr-2"
            onClick={openNew2}
            icon="pi pi-shopping-cart"
          />
        </div>
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
            src={`/demo/images/product/bamboo-watch.jpg`}
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
                data.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="p-tag p-tag-rounded p-tag-info m-1"
                  >
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
              onClick={saveBooking}
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
              src={`/demo/images/product/bamboo-watch.jpg`}
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
                  data.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="p-tag p-tag-rounded p-tag-info m-1"
                    >
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
            right={leftToolbarTemplate}
            // right={rightToolbarTemplate}
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
                  onDropDownChangeBookingRoomType(e, 'name');
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
            visible={bookingDialog}
            footer={footer}
            onHide={hideDialog2}
            header="Booking"
          >
            <div style={{ position: 'relative' }}>
              <div className="p-fluid border-0">
                <div className="field">
                  <label htmlFor="selectUser ">Select User</label>
                  <Dropdown
                    options={users}
                    value={selectedUser2}
                    className={classNames({
                      'p-invalid': submitted2 && !booking.user,
                    })}
                    onChange={(e) => {
                      console.log(e.target.value._id);
                      setSelectedUser2(e.value);
                      onDropDownChangeUser(e, 'user');
                    }}
                    optionLabel={(user) =>
                      user.first_name + ' ' + user.last_name
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="roomType">Room Type</label>
                  <Dropdown
                    value={dropdownValue}
                    className={classNames({
                      'p-invalid': submitted && !booking.roomType,
                    })}
                    onHide={() => {
                      var a = getRandomRoomNumber();
                      console.log('Yeh Dekh', typeof a);
                      var b = rooms.filter((room) => room.roomNumber === a)[0];
                      // console.log(typeof b);
                      setRoomNumber(a);
                      roomChange(b, 'room');
                    }}
                    onClick={() => {
                      setRoomNumber(getRandomRoomNumber());
                    }}
                    onChange={(e) => {
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
                    className={classNames({
                      'p-invalid': submitted2 && !booking.room,
                    })}
                    value={roomNumber}
                    onChange={(e) => {
                      // roomNumberChange();
                      // console.log(
                      //   rooms.filter(
                      //     (room) => room.roomNumber === e.target.value
                      //   )[0]
                      // )
                      setRoomNumber(e.target.value);
                    }}
                  />
                </div>
                <div className="field">
                  <label htmlFor="name">Check In </label>
                  <Calendar
                    showIcon
                    showButtonBar
                    className={classNames({
                      'p-invalid': submitted2 && !booking.checkIn,
                    })}
                    value={checkInValue}
                    hourFormat="12"
                    showTime={true}
                    onChange={(e) => {
                      console.log(e.value);
                      checkInChange(e.value.toISOString());
                      setCheckInValue(e.value);
                    }}
                  ></Calendar>
                </div>
                <div className="field">
                  <label htmlFor="quantity">Check Out</label>
                  <Calendar
                    showIcon
                    showButtonBar
                    className={classNames({
                      'p-invalid': submitted2 && !booking.checkOut,
                    })}
                    value={checkOutValue}
                    onChange={(e) => {
                      setValue(
                        (booking.checkIn - booking.checkIn / (1000 * 60 * 60)) *
                          rooms.filter(
                            (room) => room.roomNumber === roomNumber
                          )[0].price
                      );
                      checkOutChange(e.value.toISOString());
                      setCheckOutValue(e.value);
                    }}
                    showTime={true}
                    hourFormat="12"
                  />
                </div>
              </div>
              <div className="p-field">
                <label htmlFor="currencyInput">Enter Amount</label>
                <span className="p-input-icon-left">
                  <InputNumber
                    value={value}
                    className={classNames({
                      'p-invalid': submitted2 && !booking.price,
                    })}
                    onValueChange={(e) => setValue(e.value)}
                    showButtons
                    mode="currency"
                    currency="INR"
                    minFractionDigits={2}
                    format={currencyFormatter}
                    parse={currencyParser}
                  ></InputNumber>
                </span>
              </div>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default RoomManager;
