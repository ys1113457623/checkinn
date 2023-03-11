const BASE_URL = 'http://localhost:3001/';

export const getUsers = async () => {
  const response = await fetch(`${BASE_URL}api/users`);
  const json = await response.json();

  return json;
};

export async function addUser(formData) {
  try {
    console.log(JSON.stringify(formData));
    const Options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };

    const response = await fetch(`${BASE_URL}api/product`, Options);
    const json = await response.json();
    console.log('done');

    return json;
  } catch (error) {
    console.log('error');
    return error;
  }
}

export async function addRoom(formData) {
  try {
    console.log(JSON.stringify(formData));
    const Options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    };

    const response = await fetch(`${BASE_URL}api/rooms`, Options);
    const json = await response.json();
    console.log('done');

    return json;
  } catch (error) {
    console.log('error');
    return error;
  }
}
