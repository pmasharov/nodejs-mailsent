import React, { useState } from 'react';
import './App.css';
import { Container, Grid, Button, TextField, Typography } from '@material-ui/core';

function App() {
  const [recipient, setRecipient] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [data, setData] = useState({ respData: null, isFetching: true })


  const postData = ({ reqData, url }) => {
    return fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqData), // тип данных в body должен соответвовать значению заголовка "Content-Type"
    })
      .then(response => response.json()); // парсит JSON ответ в Javascript объект
  }


  const send = () => {
    const url = 'http://localhost:8080/send-email';
    const reqData = {
      recipient,
      subject,
      message
    }
    postData({ url, reqData })
      .then(respData => setData({
        respData,
        isFetching: false
      }))
      .catch(error => console.log(error))
  }
  const contactAdd = () => {
    const url = 'http://localhost:8080/contacts/add';
    const reqData = {
      email,
      name
    }
    postData({ url, reqData })
      .then(respData => setData({
        respData,
        isFetching: false
      }))
      .catch(error => console.log(error))
  }

  const contactsGet = () => {
    fetch('http://localhost:8080/contacts')
      .then(response => console.log(response.json()))
  }


  console.log(data);
  return (
    <Container style={{ marginTop: '1rem' }}>
      <Grid item container direction='column' spacing={2}>
        <Grid item>
          <TextField
            variant='outlined'
            fullWidth
            label="Recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.currentTarget.value)}
          >
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            fullWidth
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.currentTarget.value)}
          >
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            multiline
            fullWidth
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
          >
          </TextField>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={send}
          >
            {'send'}
          </Button>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
          >
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            variant='outlined'
            multiline
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          >
          </TextField>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={contactAdd}
          >
            {'add contact'}
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            onClick={contactsGet}
          >
            {'get contacts'}
          </Button>
        </Grid>
      </Grid>
    </Container >
  );
}

export default App;
