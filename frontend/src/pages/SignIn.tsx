import ButtonConfirm from "@/components/ButtonConfirm";
import Input from "@/components/Input";
import Title from "@/components/Title";
import React, { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

const nameRegex = /^[a-zA-Z][a-zA-Z0-9]{5,}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function SignIn() {
  const navigate = useNavigate();
  const { loginWithCredentials, loading} = useAuthStore();
  const [values, setValues] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });
  const [authError, setAuthError] = useState('');
  type ErrorKey = keyof typeof errors;

  const validateLoginCredential = (loginInput: string) => {
    if (!loginInput) return false;

    if (loginInput.includes('@')){
      return emailRegex.test(loginInput);
    } else{
      return nameRegex.test(loginInput);
    }
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setValues(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name as ErrorKey]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (authError) setAuthError('');
  };

  const validateForm= () => {
    const newErrors = {username: '', password: ''};
    let isValid = true;

    if (!values.username.trim()){
      newErrors.username = "Whoops! We need your username or email to continue.";
      isValid = false;
    } else if (!validateLoginCredential(values.username.trim())){
      newErrors.username = "Hmm, that doesn’t look quite right. Try a valid username or email.";
      isValid = false;
    }

    if (!values.password.trim()){
      newErrors.password = "You forgot the password part — kind of important.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (validateForm()){
      await loginWithCredentials(values.username, values.password)
      .then( () => {
        navigate('/dashboard');
      })
      .catch( (error) => {
        if (error.response && error.response.data){
          setAuthError(error.response.data.message || "Authentication failed");
        } else {
          setAuthError('Authentication failed. Please try again.');
        }
      });
    }
  };

  return (
    <>
    <div className="flex flex-col gap-9 items-center px-10 justify-center">
      <Title color="beige">Nice to see you again!</Title>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8 items-center px-10 justify-center">
        <div className="w-72 text-start">
          <Input
          placeholder="Enter login or email"
          name="username"
          onChange={handleChange}
          className={errors.username ? "outline-red text-red" : ""}
          />
          { errors.username && <p className="text-red mt-3">{errors.username}</p>}
        </div>
        <div className="w-72 text-start">
          <Input
          placeholder="Enter password"
          name="password"
          type="password"
          onChange={handleChange}
          className={errors.password ? "outline-red text-red" : ""}
          />
          {errors.password && <p className="text-red mt-3">{errors.password}</p>}
        </div>
        <div className="w-72">
          <ButtonConfirm disabled={loading} className={loading ? "bg-green-400 text-green-200": ""}>Sign In</ButtonConfirm>
        </div>
      </form>
      { authError && (
        <div className="w-72 text-red text-sm">{authError}</div>
      )}
      <div className="w-72 h-12 flex items-center">
        <div className="font-normal text-start tracking-wide text-beige-100 text-md">
          Dont have an account?&nbsp;<Link to={'/sign-up'} className="text-blue p-2.5">Sign up now</Link>
        </div>
      </div>
    </div>
    </>
  )
}

export default SignIn;