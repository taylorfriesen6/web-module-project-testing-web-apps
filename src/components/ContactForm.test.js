import React from 'react';
import {render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ContactForm from './ContactForm';

test('renders without errors', ()=>{
    render(<ContactForm/>);
});

test('renders the contact form header', ()=> {
    render(<ContactForm/>);
    const header = screen.getByRole('heading');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent('Contact Form');
});

test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
    render(<ContactForm/>);
    const firstname = screen.getByLabelText('First Name*');
    expect(firstname).toBeInTheDocument();
    userEvent.type(firstname, 'Edd');
    expect(firstname).toHaveValue('Edd');
    const errors = screen.queryAllByTestId('error');
    expect(errors.length).toEqual(1);
});

test('renders THREE error messages if user enters no values into any fields.', async () => {
  render(<ContactForm/>);
  const firstname = screen.getByLabelText('First Name*');
  expect(firstname).toBeInTheDocument();
  const lastname = screen.getByLabelText('Last Name*');
  expect(lastname).toBeInTheDocument();
  const email = screen.getByLabelText('Email*');
  expect(email).toBeInTheDocument();

  userEvent.type(firstname, ' ');
  userEvent.clear(firstname);
  userEvent.type(lastname, ' ');
  userEvent.clear(lastname);
  userEvent.type(email, ' ');
  userEvent.clear(email);

  const errors = screen.queryAllByTestId('error');
  expect(errors.length).toEqual(3);
});

test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
  render(<ContactForm/>);
  const firstname = screen.getByLabelText('First Name*');
  expect(firstname).toBeInTheDocument();
  const lastname = screen.getByLabelText('Last Name*');
  expect(lastname).toBeInTheDocument();
  const email = screen.getByLabelText('Email*');
  expect(email).toBeInTheDocument();

  userEvent.type(firstname, 'Taylor');
  userEvent.type(lastname, 'Friesen');
  userEvent.type(email, ' ');
  userEvent.clear(email);

  const errors = screen.queryAllByTestId('error');
  expect(errors.length).toEqual(1);
});

test('renders "email must be a valid email address" if an invalid email is entered', async () => {
  render(<ContactForm/>);
  const email = screen.getByLabelText('Email*');
  userEvent.type(email, 'not an email');
  const error = screen.getByText(/email must be a valid email address/i);
  expect(error).toBeInTheDocument();
});

test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
  render(<ContactForm/>);
  const submit = screen.getByRole('button');
  userEvent.click(submit);
  const error = screen.getByText(/lastName is a required field/i);
  expect(error).toBeInTheDocument();
});

test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
  render(<ContactForm/>);
  const firstname = screen.getByLabelText('First Name*');
  const lastname = screen.getByLabelText('Last Name*');
  const email = screen.getByLabelText('Email*');
  const submit = screen.getByRole('button');

  userEvent.type(firstname, 'Taylor');
  userEvent.type(lastname, 'Friesen');
  userEvent.type(email, 'example@test.com');

  userEvent.click(submit);

  const firstnameDisplay = screen.getByTestId('firstnameDisplay');
  expect(firstnameDisplay).toHaveTextContent('Taylor');
  const lastnameDisplay = screen.getByTestId('lastnameDisplay');
  expect(lastnameDisplay).toHaveTextContent('Friesen');
  const emailDisplay = screen.getByTestId('emailDisplay');
  expect(emailDisplay).toHaveTextContent('example@test.com');
  const messageDisplay = screen.queryByTestId('messageDisplay');
  expect(messageDisplay).not.toBeInTheDocument();
});

test('renders all fields text when all fields are submitted.', async () => {
  render(<ContactForm/>);
  const firstname = screen.getByLabelText('First Name*');
  const lastname = screen.getByLabelText('Last Name*');
  const email = screen.getByLabelText('Email*');
  const message = screen.getByLabelText('Message');
  const submit = screen.getByRole('button');

  userEvent.type(firstname, 'Taylor');
  userEvent.type(lastname, 'Friesen');
  userEvent.type(email, 'example@test.com');
  userEvent.type(message, 'hi');

  userEvent.click(submit);

  const firstnameDisplay = screen.getByTestId('firstnameDisplay');
  expect(firstnameDisplay).toHaveTextContent('Taylor');
  const lastnameDisplay = screen.getByTestId('lastnameDisplay');
  expect(lastnameDisplay).toHaveTextContent('Friesen');
  const emailDisplay = screen.getByTestId('emailDisplay');
  expect(emailDisplay).toHaveTextContent('example@test.com');
  const messageDisplay = screen.queryByTestId('messageDisplay');
  expect(messageDisplay).toHaveTextContent('hi');
});