import ButtonConfirm from '@/components/ButtonConfirm';
import Input from '@/components/Input';
import Title from '@/components/Title'
import axios from 'axios';
import React, { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const nameRegex = /^[a-zA-Z][a-zA-Z0-9]{5,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passRegex = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/

function SignUp() {
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    main: ''
  });
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPass: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (validateForm()){
      setLoading(true);
      await axios.post('/api/auth/signup', {
        username: values.username,
        email: values.email,
        password: values.password,
        confirmPass: values.password
      })
      .then(response => {
        if (response.data && response.data.success) {
          setSuccess(true);
          setLoading(false);
          setValues({
            username: '',
            email: '',
            password: '',
            confirmPass: ''
          });
          setTimeout(()=>{
            navigate('/sign-in');
          }, 2000);
        }
      })
      .catch(error => {
        setLoading(false);
        if (error.response.data && error.response) {
          setErrors(prev => ({...prev, main: error.response.data.message || "Looks like our signup hamsters took a coffee break. Try again in a few!"}));
        }
      })
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors( prev => ({
      ...prev,
      main: ''
    }));

    const {name, value} = e.target;
    setValues( prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]){
      setErrors( prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm= () => {
    const newErrors = {username: '',email: '', password: '', main: ''};
    let isValid = true;

    if (!values.username.trim() || !values.email.trim() || !values.password.trim()){
      newErrors.main = "Whoops! Enter a username, email, and password to continue.";
      isValid = false;
    };

    if (values.confirmPass !== values.password) {
      newErrors.password = "Please make sure both password are the same";
      isValid = false;
    };

    if(!nameRegex.test(values.username)) {
      newErrors.username = "Please choose a username that starts with a letter and has at least 6 characters. No special symbols allowed.";
      isValid = false;
    };

    if(!emailRegex.test(values.email)) {
      newErrors.email = "Oops! That doesn't look like a valid email. Try something like name@example.com";
      isValid = false;
    };

    if(!passRegex.test(values.password)) {
      newErrors.password = "Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character.";
      isValid = false;
    };

    setErrors(newErrors);
    return isValid;
  };

  return (
    <>
      <div className='flex flex-col gap-9 items-center px-10 justify-center pb-60'>
        <div>
          <Title color="beige">Create Account</Title>
          <div className="font-medium text-md text-beige-100 text-center leading-7">Your Personal CS2 Skin Ledger: Record Sales, Purchases, and Profits.</div>
        </div>
        { success ? (
          <div className='text-green-300 text-lg'>Account created successfully! Redirecting to login...</div>
        ) : (
          <form onSubmit={handleSubmit} className='flex flex-col gap-8 items-center px-10 justify-center'>
            <div className="w-72">
              <Input
              placeholder="Enter login"
              name="username"
              onChange={handleChange}
              className={errors.username ? "outline-red text-red" : ""}
              />
              {errors.username && <p className="text-red mt-3">{errors.username}</p>}
            </div>
            <div className="w-72">
              <Input
              placeholder="Enter email"
              name="email"
              onChange={handleChange}
              className={errors.email ? "outline-red text-red" : ""}
              />
              {errors.email && <p className="text-red mt-3">{errors.email}</p>}
            </div>
            <div className="w-72">
              <Input
              placeholder="Enter password"
              name="password"
              type='password'
              onChange={handleChange}
              className={errors.password ? "outline-red text-red" : ""}
              />
              {errors.password && <p className="text-red mt-3">{errors.password}</p>}
            </div>
              <Input
              placeholder="Confirm password"
              name="confirmPass"
              type='password'
              onChange={handleChange}
              className={errors.password ? "outline-red text-red" : ""}
              />
            <div className="w-72">
            <ButtonConfirm disabled={loading} className={loading ? "bg-green-400 text-green-200": ""}>Sign Up</ButtonConfirm>
            {errors.main && <p className="text-red mt-3">{errors.main}</p>}
            </div>
          </form>
        )}
        <div className='flex w-full h-12 text-center items-center justify-center mt-12'>
          <Link to={'/sign-in'}>
            <div className='text-beige-200 hover:text-beige-100 font-normal p-2'>Already have an <span className='text-blue'>account</span></div>
          </Link>
        </div>
      </div>
    </>
  )
}

export default SignUp